// Server-only: talks to Neon Postgres over HTTPS (works well on Netlify functions).
import { neon } from '@neondatabase/serverless';

let sql;

function getSql() {
  if (!sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');
    sql = neon(url);
  }
  return sql;
}

export async function query(text, params = []) {
  return getSql().query(text, params);
}

export async function one(text, params = []) {
  const rows = await query(text, params);
  return rows[0] ?? null;
}

const toCamel = (key) => key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

// DB row (snake_case) -> object the UI already expects (camelCase + $id).
export function mapRow(row, { omit = [] } = {}) {
  if (!row) return null;
  const out = {};
  for (const [key, value] of Object.entries(row)) {
    if (key === 'id') {
      out.$id = value;
      continue;
    }
    if (omit.includes(key)) continue;
    out[toCamel(key)] = value instanceof Date ? value.toISOString() : value;
  }
  return out;
}

export const mapRows = (rows, opts) => rows.map((r) => mapRow(r, opts));
