// Creates the tables. Safe to run again at any time.   npm run db:migrate
import { readFileSync } from 'node:fs';
import { connect } from './_db.mjs';

const sql = connect();
const schema = readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8');

const statements = schema
  .split('\n')
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}
console.log(`Database is ready (${statements.length} statements applied).`);
