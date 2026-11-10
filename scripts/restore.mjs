// Loads a backup file into an EMPTY database.   npm run db:restore -- backups/backup-2026-11-01.json
// (run  npm run db:migrate  first)
import { readFileSync } from 'node:fs';
import { connect } from './_db.mjs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: npm run db:restore -- backups/backup-YYYY-MM-DD.json');
  process.exit(1);
}

const sql = connect();
const { tables } = JSON.parse(readFileSync(file, 'utf8'));

// parents before children, so foreign keys are satisfied
const order = ['users', 'academic_sessions', 'classes', 'students', 'subjects', 'results'];

for (const table of order) {
  const rows = tables[table] || [];
  for (const row of rows) {
    const columns = Object.keys(row);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    await sql.query(
      `insert into ${table} (${columns.join(', ')}) values (${placeholders}) on conflict (id) do nothing`,
      columns.map((c) => row[c])
    );
  }
  console.log(`${table}: ${rows.length} rows restored`);
}
