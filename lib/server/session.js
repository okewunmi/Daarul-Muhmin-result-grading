// Server-only: signed, HttpOnly session cookie (no extra dependency).
import crypto from 'node:crypto';

export const COOKIE_NAME = 'dm_session';
export const SESSION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error('SESSION_SECRET must be set to a random string of at least 32 characters');
  }
  return s;
}

const sign = (payload) =>
  crypto.createHmac('sha256', secret()).update(payload).digest('base64url');

export function createSessionToken(userId) {
  const payload = Buffer.from(
    JSON.stringify({ uid: userId, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

// Returns the user id if the token is genuine and not expired, otherwise null.
export function readSessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;

  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!uid || !exp || exp < Math.floor(Date.now() / 1000)) return null;
    return uid;
  } catch {
    return null;
  }
}

export const cookieOptions = (maxAge = SESSION_SECONDS) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge,
});
