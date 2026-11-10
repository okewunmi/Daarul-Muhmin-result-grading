// Administrator tool: set a new password for an account.
//   npm run db:reset-password -- someone@example.com "NewPassword123"
import bcrypt from 'bcryptjs';
import { connect } from './_db.mjs';

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error('Usage: npm run db:reset-password -- email@example.com "NewPassword"');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}

const sql = connect();
const hash = await bcrypt.hash(password, 10);
const rows = await sql.query(
  'update users set password_hash = $1, is_active = true where lower(email) = lower($2) returning email',
  [hash, email]
);
console.log(rows.length ? `Password updated for ${rows[0].email}` : `No account found for ${email}`);
