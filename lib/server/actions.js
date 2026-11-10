// Server-only. Every data operation the app needs, written as SQL.
// Each action is  { auth: 'public' | 'user', run(ctx, ...args) }.
//   ctx.user            -> the logged-in user row (or null)
//   ctx.startSession(id)-> ask the route to set the login cookie
//   ctx.endSession()    -> ask the route to clear the login cookie
// Return shapes match what the UI already expects from the old Appwrite layer.

import bcrypt from 'bcryptjs';
import { query, one, mapRow, mapRows } from './db.js';
import { gradingSystem } from '../grading.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_HIDDEN = { omit: ['password_hash'] };

const ok = (message, extra = {}) => ({ success: true, ...(message ? { message } : {}), ...extra });
const fail = (message, extra = {}) => ({ success: false, message, ...extra });

const text = (v, fallback = '') => (v === undefined || v === null ? fallback : String(v).trim());
const bool = (v) => v === true || v === 'true';
const int = (v) => Math.round(Number(v));
const ref = (v) => (v ? String(v) : null); // '' / undefined -> NULL for foreign keys

// A bcrypt hash of a random string, used so that "no such user" takes as long as "wrong password".
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

const publicUser = (row) => ({
  $id: row.id,
  fullName: row.full_name,
  arabicName: row.arabic_name,
  email: row.email,
});

// Builds "update <table> set ..." from a whitelist so callers can never touch other columns.
// allowed = { uiFieldName: ['db_column', coerceFn] }
function buildUpdate(table, id, allowed, updates, { touch = false } = {}) {
  const sets = [];
  const params = [];
  for (const [field, [column, coerce]] of Object.entries(allowed)) {
    if (updates && Object.prototype.hasOwnProperty.call(updates, field) && updates[field] !== undefined) {
      params.push(coerce(updates[field]));
      sets.push(`${column} = $${params.length}`);
    }
  }
  if (touch) sets.push('updated_at = now()');
  if (sets.length === 0) return null;
  params.push(id);
  return { sql: `update ${table} set ${sets.join(', ')} where id = $${params.length} returning *`, params };
}

async function updateRow(table, id, allowed, updates, opts) {
  const built = buildUpdate(table, id, allowed, updates, opts);
  if (!built) return { row: null, nothing: true };
  const row = await one(built.sql, built.params);
  return { row, nothing: false };
}

async function deleteRow(table, id, label, blockedMessage) {
  try {
    const rows = await query(`delete from ${table} where id = $1 returning id`, [id]);
    if (rows.length === 0) return fail(`${label} not found`);
    return ok(`${label} deleted successfully`);
  } catch (err) {
    if (err?.code === '23503') return fail(blockedMessage); // still referenced elsewhere
    throw err;
  }
}

// ---------------------------------------------------------------- users / auth

async function validateNewPassword(password, confirm) {
  if (password !== confirm) return 'Passwords do not match';
  if (!password || password.length < 8) return 'Password must be at least 8 characters long';
  return null;
}

const auth = {
  me: {
    auth: 'public',
    run: async (ctx) => ok('', { user: ctx.user ? publicUser(ctx.user) : null }),
  },

  login: {
    auth: 'public',
    run: async (ctx, email, password) => {
      if (!email || !password) return fail('Please provide both email and password');

      const user = await one('select * from users where lower(email) = lower($1)', [text(email)]);
      // Always run bcrypt, so response time doesn't reveal whether the email exists.
      const valid = await bcrypt.compare(String(password), user ? user.password_hash : DUMMY_HASH);

      if (!user || !valid) return fail('Invalid email or password');
      if (!user.is_active) return fail('Account is inactive. Please contact administrator');

      ctx.startSession(user.id);
      return ok('Login successful!', { user: publicUser(user) });
    },
  },

  logout: {
    auth: 'public',
    run: async (ctx) => {
      ctx.endSession();
      return ok('Logged out successfully');
    },
  },

  createUser: {
    auth: 'public',
    run: async (ctx, fullName, arabicName, email, password, confirmPassword) => {
      // Who may create accounts? An already-logged-in staff member, or anyone while
      // there are no accounts yet (first-time setup), or anyone if ALLOW_REGISTRATION=true.
      if (!ctx.user && process.env.ALLOW_REGISTRATION !== 'true') {
        const { count } = await one('select count(*)::int as count from users');
        if (count > 0) {
          return fail('Registration is closed. Please ask the administrator to create your account.');
        }
      }

      const passwordProblem = await validateNewPassword(password, confirmPassword);
      if (passwordProblem) return fail(passwordProblem);
      if (!text(fullName)) return fail('Full name is required');
      if (!EMAIL_RE.test(text(email))) return fail('Invalid email format');

      const passwordHash = await bcrypt.hash(String(password), 10);
      try {
        const row = await one(
          `insert into users (full_name, arabic_name, email, password_hash, created_by)
           values ($1, $2, $3, $4, $5) returning *`,
          [text(fullName), text(arabicName), text(email).toLowerCase(), passwordHash, ctx.user?.email || 'self-registration']
        );
        return ok('Account created successfully!', { user: publicUser(row) });
      } catch (err) {
        if (err?.code === '23505') return fail('A user with this email already exists');
        throw err;
      }
    },
  },

  getAllUsers: {
    auth: 'user',
    run: async () => {
      const rows = await query('select * from users order by created_at desc');
      return ok('', { users: mapRows(rows, USER_HIDDEN) });
    },
  },

  updateUser: {
    auth: 'user',
    run: async (ctx, userId, updates = {}) => {
      if (userId === ctx.user.id && updates.isActive === false) {
        return fail('You cannot deactivate your own account');
      }
      if (updates.email !== undefined && !EMAIL_RE.test(text(updates.email))) {
        return fail('Invalid email format');
      }
      try {
        const { row, nothing } = await updateRow('users', userId, {
          fullName: ['full_name', text],
          arabicName: ['arabic_name', text],
          email: ['email', (v) => text(v).toLowerCase()],
          isActive: ['is_active', bool],
        }, updates);
        if (nothing) return fail('Nothing to update');
        if (!row) return fail('User not found');
        return ok('User updated successfully', { user: mapRow(row, USER_HIDDEN) });
      } catch (err) {
        if (err?.code === '23505') return fail('A user with this email already exists');
        throw err;
      }
    },
  },

  deleteUser: {
    auth: 'user',
    run: async (ctx, userId) => {
      if (userId === ctx.user.id) return fail('You cannot delete your own account');
      return deleteRow('users', userId, 'User', 'This user cannot be deleted');
    },
  },

  resetPassword: {
    auth: 'user',
    run: async (ctx, userId, newPassword, confirmPassword) => {
      const problem = await validateNewPassword(newPassword, confirmPassword);
      if (problem) return fail(problem);
      const hash = await bcrypt.hash(String(newPassword), 10);
      const row = await one('update users set password_hash = $1 where id = $2 returning id', [hash, userId]);
      return row ? ok('Password reset successfully') : fail('User not found');
    },
  },

  // The old version let anybody reset anybody's password knowing only their email.
  // Without an email service there is no safe way to do that, so it is switched off.
  // The administrator can reset a password with:  npm run db:reset-password
  forgotPassword: {
    auth: 'public',
    run: async () =>
      fail('Password reset is handled by the school administrator. Please contact them to reset your password.'),
  },
};

// ---------------------------------------------------------------- academic sessions

const SESSION_FIELDS = {
  sessionName: ['session_name', text],
  sessionNameArabic: ['session_name_arabic', text],
  startDate: ['start_date', text],
  endDate: ['end_date', text],
  nextTermBegins: ['next_term_begins', text],
  isActive: ['is_active', bool],
};

const sessions = {
  create: {
    auth: 'user',
    run: async (ctx, d = {}) => {
      if (!text(d.sessionName)) return fail('Session name is required');
      const row = await one(
        `insert into academic_sessions
           (session_name, session_name_arabic, start_date, end_date, next_term_begins, is_active, created_by)
         values ($1,$2,$3,$4,$5,$6,$7) returning *`,
        [text(d.sessionName), text(d.sessionNameArabic), text(d.startDate), text(d.endDate),
         text(d.nextTermBegins), bool(d.isActive), ctx.user.email]
      );
      return ok('Academic session created successfully', { session: mapRow(row) });
    },
  },
  getAll: {
    auth: 'user',
    run: async () => ok('', { sessions: mapRows(await query('select * from academic_sessions order by created_at desc')) }),
  },
  getActive: {
    auth: 'user',
    run: async () =>
      ok('', { session: mapRow(await one('select * from academic_sessions where is_active order by created_at desc limit 1')) }),
  },
  update: {
    auth: 'user',
    run: async (ctx, id, updates) => {
      const { row, nothing } = await updateRow('academic_sessions', id, SESSION_FIELDS, updates);
      if (nothing) return fail('Nothing to update');
      return row ? ok('Session updated successfully', { session: mapRow(row) }) : fail('Session not found');
    },
  },
  delete: {
    auth: 'user',
    run: async (ctx, id) =>
      deleteRow('academic_sessions', id, 'Session',
        'This session still has classes, students or results. Remove those first.'),
  },
};

// ---------------------------------------------------------------- classes

const CLASS_FIELDS = {
  className: ['class_name', text],
  classNameArabic: ['class_name_arabic', text],
  academicSessionId: ['academic_session_id', ref],
};

async function refreshEnrollment(classId) {
  const row = await one(
    `update classes
        set current_enrollment = (select count(*)::int from students where class_id = $1 and is_active)
      where id = $1
      returning current_enrollment`,
    [classId]
  );
  return row ? row.current_enrollment : null;
}

const classes = {
  create: {
    auth: 'user',
    run: async (ctx, d = {}) => {
      if (!text(d.className)) return fail('Class name is required');
      try {
        const row = await one(
          `insert into classes (class_name, class_name_arabic, academic_session_id, created_by)
           values ($1,$2,$3,$4) returning *`,
          [text(d.className), text(d.classNameArabic), ref(d.academicSessionId), ctx.user.email]
        );
        return ok('Class created successfully', { class: mapRow(row) });
      } catch (err) {
        if (err?.code === '23503') return fail('The selected academic session no longer exists');
        throw err;
      }
    },
  },
  getAll: {
    auth: 'user',
    run: async () => ok('', { classes: mapRows(await query('select * from classes order by created_at desc')) }),
  },
  getBySession: {
    auth: 'user',
    run: async (ctx, sessionId) =>
      ok('', { classes: mapRows(await query('select * from classes where academic_session_id = $1 order by created_at', [sessionId])) }),
  },
  update: {
    auth: 'user',
    run: async (ctx, id, updates) => {
      const { row, nothing } = await updateRow('classes', id, CLASS_FIELDS, updates);
      if (nothing) return fail('Nothing to update');
      return row ? ok('Class updated successfully', { class: mapRow(row) }) : fail('Class not found');
    },
  },
  delete: {
    auth: 'user',
    run: async (ctx, id) =>
      deleteRow('classes', id, 'Class', 'This class still has students or results. Remove or move them first.'),
  },
  updateEnrollment: {
    auth: 'user',
    run: async (ctx, classId) => {
      const count = await refreshEnrollment(classId);
      return count === null ? fail('Class not found') : ok('', { count });
    },
  },
};

// ---------------------------------------------------------------- students

const STUDENT_FIELDS = {
  fullName: ['full_name', text],
  arabicName: ['arabic_name', text],
  gender: ['gender', (v) => text(v, 'Male')],
  classId: ['class_id', ref],
  academicSessionId: ['academic_session_id', ref],
  isActive: ['is_active', bool],
};

const students = {
  create: {
    auth: 'user',
    run: async (ctx, d = {}) => {
      if (!text(d.fullName)) return fail('Student name is required');
      try {
        const row = await one(
          `insert into students (full_name, arabic_name, gender, class_id, academic_session_id, created_by)
           values ($1,$2,$3,$4,$5,$6) returning *`,
          [text(d.fullName), text(d.arabicName), text(d.gender, 'Male'), ref(d.classId), ref(d.academicSessionId), ctx.user.email]
        );
        if (row.class_id) await refreshEnrollment(row.class_id);
        return ok('Student added successfully', { student: mapRow(row) });
      } catch (err) {
        if (err?.code === '23503') return fail('The selected class or session no longer exists');
        throw err;
      }
    },
  },
  getAll: {
    auth: 'user',
    run: async () =>
      ok('', { students: mapRows(await query('select * from students order by created_at desc limit 1000')) }),
  },
  getByClass: {
    auth: 'user',
    run: async (ctx, classId) =>
      ok('', { students: mapRows(await query('select * from students where class_id = $1 and is_active order by created_at', [classId])) }),
  },
  getBySession: {
    auth: 'user',
    run: async (ctx, sessionId) =>
      ok('', { students: mapRows(await query('select * from students where academic_session_id = $1 order by created_at', [sessionId])) }),
  },
  getById: {
    auth: 'user',
    run: async (ctx, id) => {
      const row = await one('select * from students where id = $1', [id]);
      return row ? ok('', { student: mapRow(row) }) : fail('Student not found', { student: null });
    },
  },
  update: {
    auth: 'user',
    run: async (ctx, id, updates) => {
      const before = await one('select class_id from students where id = $1', [id]);
      if (!before) return fail('Student not found');
      try {
        const { row, nothing } = await updateRow('students', id, STUDENT_FIELDS, updates, { touch: true });
        if (nothing) return fail('Nothing to update');
        // keep the head-count right if the student moved class or was (de)activated
        for (const classId of new Set([before.class_id, row.class_id])) {
          if (classId) await refreshEnrollment(classId);
        }
        return ok('Student updated successfully', { student: mapRow(row) });
      } catch (err) {
        if (err?.code === '23503') return fail('The selected class or session no longer exists');
        throw err;
      }
    },
  },
  delete: {
    auth: 'user',
    run: async (ctx, id) => {
      const before = await one('select class_id from students where id = $1', [id]);
      // results of this student are removed automatically (ON DELETE CASCADE)
      const result = await deleteRow('students', id, 'Student', 'This student cannot be deleted');
      if (result.success && before?.class_id) await refreshEnrollment(before.class_id);
      return result;
    },
  },
};

// ---------------------------------------------------------------- subjects

const SUBJECT_FIELDS = {
  englishName: ['english_name', text],
  arabicName: ['arabic_name', text],
  maxScore: ['max_score', int],
  isActive: ['is_active', bool],
};

const subjects = {
  create: {
    auth: 'user',
    run: async (ctx, d = {}) => {
      if (!text(d.englishName)) return fail('Subject name is required');
      const maxScore = d.maxScore ? int(d.maxScore) : 100;
      if (!Number.isFinite(maxScore) || maxScore <= 0) return fail('Maximum score must be a positive number');
      const row = await one(
        `insert into subjects (english_name, arabic_name, max_score, created_by)
         values ($1,$2,$3,$4) returning *`,
        [text(d.englishName), text(d.arabicName), maxScore, ctx.user.email]
      );
      return ok('Subject created successfully', { subject: mapRow(row) });
    },
  },
  getAll: {
    auth: 'user',
    run: async () =>
      ok('', { subjects: mapRows(await query('select * from subjects where is_active order by created_at')) }),
  },
  getById: {
    auth: 'user',
    run: async (ctx, id) => {
      const row = await one('select * from subjects where id = $1', [id]);
      return row ? ok('', { subject: mapRow(row) }) : fail('Subject not found', { subject: null });
    },
  },
  update: {
    auth: 'user',
    run: async (ctx, id, updates) => {
      const { row, nothing } = await updateRow('subjects', id, SUBJECT_FIELDS, updates);
      if (nothing) return fail('Nothing to update');
      return row ? ok('Subject updated successfully', { subject: mapRow(row) }) : fail('Subject not found');
    },
  },
  // Deactivates instead of deleting, so old results keep their subject.
  delete: {
    auth: 'user',
    run: async (ctx, id) => {
      const row = await one('update subjects set is_active = false where id = $1 returning id', [id]);
      return row ? ok('Subject deactivated successfully') : fail('Subject not found');
    },
  },
};

// ---------------------------------------------------------------- results

async function saveResult(ctx, d = {}) {
  const score = Number(d.score);
  if (d.score === '' || d.score === null || d.score === undefined || !Number.isFinite(score) || score < 0 || score > 100) {
    return fail('Score must be a number between 0 and 100');
  }
  if (!d.studentId || !d.subjectId || !d.academicSessionId) {
    return fail('Student, subject and academic session are required');
  }

  const term = text(d.term, 'First Term') || 'First Term';
  const grade = gradingSystem.calculateGrade(score);

  try {
    const row = await one(
      `insert into results
         (student_id, subject_id, class_id, academic_session_id, term, term_arabic, score,
          grade, grade_arabic, remark, remark_arabic,
          teacher_comment, teacher_comment_arabic, class_teacher_remark, class_teacher_remark_arabic, created_by)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       on conflict (student_id, subject_id, academic_session_id, term) do update set
         score = excluded.score,
         grade = excluded.grade,
         grade_arabic = excluded.grade_arabic,
         remark = excluded.remark,
         remark_arabic = excluded.remark_arabic,
         teacher_comment = excluded.teacher_comment,
         teacher_comment_arabic = excluded.teacher_comment_arabic,
         class_teacher_remark = excluded.class_teacher_remark,
         class_teacher_remark_arabic = excluded.class_teacher_remark_arabic,
         updated_at = now()
       returning *, (xmax <> 0) as was_update`,
      [
        d.studentId, d.subjectId, ref(d.classId), d.academicSessionId, term,
        gradingSystem.getTermArabic(term), score,
        grade.english, grade.arabic, grade.remark, grade.remarkArabic,
        text(d.teacherComment), text(d.teacherCommentArabic),
        text(d.classTeacherRemark), text(d.classTeacherRemarkArabic),
        ctx.user.email,
      ]
    );
    const { was_update: wasUpdate, ...rest } = row;
    return ok(wasUpdate ? 'Result updated successfully' : 'Result saved successfully', { result: mapRow(rest) });
  } catch (err) {
    if (err?.code === '23503') return fail('The student, subject, class or session for this result no longer exists');
    throw err;
  }
}

async function resultsFor(column, id, sessionId, term) {
  const conditions = [`${column} = $1`];
  const params = [id];
  if (sessionId) { params.push(sessionId); conditions.push(`academic_session_id = $${params.length}`); }
  if (term) { params.push(term); conditions.push(`term = $${params.length}`); }
  const rows = await query(`select * from results where ${conditions.join(' and ')} order by created_at`, params);
  return ok('', { results: mapRows(rows) });
}

const results = {
  saveResult: { auth: 'user', run: saveResult },
  getByStudent: { auth: 'user', run: (ctx, studentId, sessionId = null, term = null) => resultsFor('student_id', studentId, sessionId, term) },
  getByClass: { auth: 'user', run: (ctx, classId, sessionId = null, term = null) => resultsFor('class_id', classId, sessionId, term) },
  delete: { auth: 'user', run: async (ctx, id) => deleteRow('results', id, 'Result', 'This result cannot be deleted') },
};

// ---------------------------------------------------------------- dispatch table

function register(namespace, group, into) {
  for (const [name, def] of Object.entries(group)) into[`${namespace}.${name}`] = def;
}

export const actions = {};
register('auth', auth, actions);
register('sessions', sessions, actions);
register('classes', classes, actions);
register('students', students, actions);
register('subjects', subjects, actions);
register('results', results, actions);
