-- Daarul Muhmin result system: Postgres schema (Neon)
-- Safe to run more than once (everything uses IF NOT EXISTS).
-- Run it with:  npm run db:migrate   (or paste it into the Neon SQL Editor)

create table if not exists users (
  id            text primary key default gen_random_uuid()::text,
  full_name     text not null,
  arabic_name   text not null default '',
  email         text not null,
  password_hash text not null,
  is_active     boolean not null default true,
  created_by    text not null default 'self-registration',
  created_at    timestamptz not null default now()
);
create unique index if not exists users_email_lower_key on users (lower(email));

create table if not exists academic_sessions (
  id                  text primary key default gen_random_uuid()::text,
  session_name        text not null,
  session_name_arabic text not null default '',
  start_date          text not null default '',
  end_date            text not null default '',
  next_term_begins    text not null default '',
  is_active           boolean not null default false,
  created_at          timestamptz not null default now(),
  created_by          text not null default ''
);

create table if not exists classes (
  id                  text primary key default gen_random_uuid()::text,
  class_name          text not null,
  class_name_arabic   text not null default '',
  academic_session_id text references academic_sessions(id) on delete restrict,
  current_enrollment  integer not null default 0,
  created_at          timestamptz not null default now(),
  created_by          text not null default ''
);
create index if not exists classes_session_idx on classes (academic_session_id);

create table if not exists students (
  id                  text primary key default gen_random_uuid()::text,
  full_name           text not null,
  arabic_name         text not null default '',
  gender              text not null default 'Male',
  class_id            text references classes(id) on delete restrict,
  academic_session_id text references academic_sessions(id) on delete restrict,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  created_by          text not null default '',
  updated_at          timestamptz not null default now()
);
create index if not exists students_class_idx   on students (class_id);
create index if not exists students_session_idx on students (academic_session_id);

create table if not exists subjects (
  id           text primary key default gen_random_uuid()::text,
  english_name text not null,
  arabic_name  text not null default '',
  max_score    integer not null default 100,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  created_by   text not null default ''
);

create table if not exists results (
  id                          text primary key default gen_random_uuid()::text,
  student_id                  text not null references students(id) on delete cascade,
  subject_id                  text not null references subjects(id) on delete cascade,
  class_id                    text references classes(id) on delete restrict,
  academic_session_id         text not null references academic_sessions(id) on delete restrict,
  term                        text not null default 'First Term',
  term_arabic                 text not null default '',
  score                       double precision not null check (score >= 0 and score <= 100),
  grade                       text not null default '',
  grade_arabic                text not null default '',
  remark                      text not null default '',
  remark_arabic               text not null default '',
  teacher_comment             text not null default '',
  teacher_comment_arabic      text not null default '',
  class_teacher_remark        text not null default '',
  class_teacher_remark_arabic text not null default '',
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),
  created_by                  text not null default '',
  -- one score per student, per subject, per session, per term
  unique (student_id, subject_id, academic_session_id, term)
);
create index if not exists results_student_idx on results (student_id);
create index if not exists results_class_idx   on results (class_id, academic_session_id);
