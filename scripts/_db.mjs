// Shared by the helper scripts: connect to Neon using DATABASE_URL.
import { neon } from '@neondatabase/serverless';

export function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not set. Example:\n  DATABASE_URL="postgres://..." npm run db:migrate');
    process.exit(1);
  }
  return neon(url);
}
