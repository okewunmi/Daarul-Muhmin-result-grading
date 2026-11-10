// One-time rescue: copy everything out of the restored Appwrite project.
//
//  Step 1 (only needs the Appwrite variables): saves a raw copy to backups/appwrite-export-DATE.json
//  Step 2 (if DATABASE_URL is also set):       imports it into Neon, keeping the original IDs
//
// Required environment variables:
//   APPWRITE_ENDPOINT     e.g. https://nyc.cloud.appwrite.io/v1
//   APPWRITE_PROJECT_ID   your project ID
//   APPWRITE_DATABASE_ID  your database ID
//   APPWRITE_API_KEY      a NEW API key with only the  databases.read  and  documents.read  scopes
//   DATABASE_URL          (optional, for step 2) Neon connection string
//
// Staff accounts are exported but NOT imported: their passwords used an old unsalted hash
// that the new login does not accept. Register the first account again, then create the others.

import { mkdirSync, writeFileSync } from 'node:fs';

const need = (name) => {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing ${name}`);
    process.exit(1);
  }
  return v;
};

const endpoint = need('APPWRITE_ENDPOINT').replace(/\/$/, '');
const projectId = need('APPWRITE_PROJECT_ID');
const databaseId = need('APPWRITE_DATABASE_ID');
const apiKey = need('APPWRITE_API_KEY');

const COLLECTIONS = {
  users: 'userauth',
  academic_sessions: 'academicSessions',
  classes: 'classes',
  students: 'students',
  subjects: 'subjects',
  results: 'results',
};

async function listAll(collectionId) {
  const docs = [];
  let cursor = null;
  for (;;) {
    const params = new URLSearchParams();
    params.append('queries[]', JSON.stringify({ method: 'limit', values: [100] }));
    if (cursor) params.append('queries[]', JSON.stringify({ method: 'cursorAfter', values: [cursor] }));

    const res = await fetch(`${endpoint}/databases/${databaseId}/collections/${collectionId}/documents?${params}`, {
      headers: { 'X-Appwrite-Project': projectId, 'X-Appwrite-Key': apiKey },
    });
    if (!res.ok) {
      throw new Error(`Appwrite ${res.status} on "${collectionId}": ${(await res.text()).slice(0, 300)}`);
    }
    const { documents } = await res.json();
    docs.push(...documents);
    if (documents.length < 100) return docs;
    cursor = documents[documents.length - 1].$id;
  }
}

// ---- Step 1: raw export ------------------------------------------------------------------
const raw = { exportedAt: new Date().toISOString(), collections: {} };
for (const [table, collectionId] of Object.entries(COLLECTIONS)) {
  raw.collections[table] = await listAll(collectionId);
  console.log(`exported ${String(raw.collections[table].length).padStart(5)}  ${collectionId}`);
}
mkdirSync(new URL('../backups/', import.meta.url), { recursive: true });
const fileName = `appwrite-export-${new Date().toISOString().slice(0, 10)}.json`;
writeFileSync(new URL(`../backups/${fileName}`, import.meta.url), JSON.stringify(raw, null, 2));
console.log(`\nRaw copy saved to backups/${fileName}`);
console.log('It contains student data and password hashes: keep it private, never commit or share it.\n');

if (!process.env.DATABASE_URL) {
  console.log('DATABASE_URL not set, so stopping after the export. Copy that file somewhere safe now.');
  process.exit(0);
}

// ---- Step 2: import into Neon ------------------------------------------------------------
const { connect } = await import('./_db.mjs');
const sql = connect();

const str = (v) => (v === undefined || v === null ? '' : String(v));
const bool = (v, d = false) => (v === undefined || v === null ? d : v === true || v === 'true');
const timestamp = (doc) => {
  for (const candidate of [doc.createdAt, doc.$createdAt]) {
    const t = candidate ? new Date(candidate) : null;
    if (t && !Number.isNaN(t.getTime())) return t.toISOString();
  }
  return new Date().toISOString();
};
const updated = (doc) => {
  const t = doc.updatedAt ? new Date(doc.updatedAt) : null;
  return t && !Number.isNaN(t.getTime()) ? t.toISOString() : timestamp(doc);
};

async function insert(table, row) {
  const columns = Object.keys(row);
  await sql.query(
    `insert into ${table} (${columns.join(', ')}) values (${columns.map((_, i) => `$${i + 1}`).join(', ')})
     on conflict do nothing`,
    columns.map((c) => row[c])
  );
}

const ids = { sessions: new Set(), classes: new Set(), students: new Set(), subjects: new Set() };
const skipped = [];

for (const d of raw.collections.academic_sessions) {
  await insert('academic_sessions', {
    id: d.$id, session_name: str(d.sessionName), session_name_arabic: str(d.sessionNameArabic),
    start_date: str(d.startDate), end_date: str(d.endDate), next_term_begins: str(d.nextTermBegins),
    is_active: bool(d.isActive), created_at: timestamp(d), created_by: str(d.createdBy),
  });
  ids.sessions.add(d.$id);
}

for (const d of raw.collections.classes) {
  await insert('classes', {
    id: d.$id, class_name: str(d.className), class_name_arabic: str(d.classNameArabic),
    academic_session_id: ids.sessions.has(d.academicSessionId) ? d.academicSessionId : null,
    current_enrollment: Number.parseInt(d.currentEnrollment, 10) || 0,
    created_at: timestamp(d), created_by: str(d.createdBy),
  });
  ids.classes.add(d.$id);
}

for (const d of raw.collections.subjects) {
  await insert('subjects', {
    id: d.$id, english_name: str(d.englishName), arabic_name: str(d.arabicName),
    max_score: Number.parseInt(d.maxScore, 10) || 100, is_active: bool(d.isActive, true),
    created_at: timestamp(d), created_by: str(d.createdBy),
  });
  ids.subjects.add(d.$id);
}

for (const d of raw.collections.students) {
  await insert('students', {
    id: d.$id, full_name: str(d.fullName), arabic_name: str(d.arabicName), gender: str(d.gender) || 'Male',
    class_id: ids.classes.has(d.classId) ? d.classId : null,
    academic_session_id: ids.sessions.has(d.academicSessionId) ? d.academicSessionId : null,
    is_active: bool(d.isActive, true), created_at: timestamp(d), created_by: str(d.createdBy), updated_at: updated(d),
  });
  ids.students.add(d.$id);
}

for (const d of raw.collections.results) {
  const score = Number(d.score);
  if (!ids.students.has(d.studentId) || !ids.subjects.has(d.subjectId) || !ids.sessions.has(d.academicSessionId)) {
    skipped.push(`result ${d.$id}: its student, subject or session no longer exists`);
    continue;
  }
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    skipped.push(`result ${d.$id}: invalid score "${d.score}"`);
    continue;
  }
  await insert('results', {
    id: d.$id, student_id: d.studentId, subject_id: d.subjectId,
    class_id: ids.classes.has(d.classId) ? d.classId : null, academic_session_id: d.academicSessionId,
    term: str(d.term) || 'First Term', term_arabic: str(d.termArabic), score,
    grade: str(d.grade), grade_arabic: str(d.gradeArabic), remark: str(d.remark), remark_arabic: str(d.remarkArabic),
    teacher_comment: str(d.teacherComment), teacher_comment_arabic: str(d.teacherCommentArabic),
    class_teacher_remark: str(d.classTeacherRemark), class_teacher_remark_arabic: str(d.classTeacherRemarkArabic),
    created_at: timestamp(d), updated_at: updated(d), created_by: str(d.createdBy),
  });
}

// make the head-counts match reality
await sql.query(
  `update classes c set current_enrollment =
     (select count(*)::int from students s where s.class_id = c.id and s.is_active)`
);

console.log('Imported into Neon:');
for (const t of ['academic_sessions', 'classes', 'subjects', 'students', 'results']) {
  const [{ n }] = await sql.query(`select count(*)::int as n from ${t}`);
  console.log(`  ${t.padEnd(18)} ${n}`);
}
if (skipped.length) {
  console.log(`\nSkipped ${skipped.length} record(s):`);
  skipped.forEach((s) => console.log('  - ' + s));
}
console.log('\nStaff accounts were not imported. Open the site and register your admin account.');
