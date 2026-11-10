// Saves every table to a JSON file in ./backups.   npm run db:backup
// Do this regularly (for example at the end of every term) and keep a copy
// somewhere outside this project, such as Google Drive.
import { mkdirSync, writeFileSync } from 'node:fs';
import { connect } from './_db.mjs';

const sql = connect();
const tables = ['users', 'academic_sessions', 'classes', 'students', 'subjects', 'results'];

const backup = { takenAt: new Date().toISOString(), tables: {} };
for (const table of tables) {
  backup.tables[table] = await sql.query(`select * from ${table}`);
  console.log(`${table}: ${backup.tables[table].length} rows`);
}

mkdirSync(new URL('../backups/', import.meta.url), { recursive: true });
const file = new URL(`../backups/backup-${new Date().toISOString().slice(0, 10)}.json`, import.meta.url);
writeFileSync(file, JSON.stringify(backup, null, 2));
console.log(`\nSaved to backups/${file.pathname.split('/').pop()}`);
console.log('This file contains student data and password hashes. Keep it private and never commit it.');
