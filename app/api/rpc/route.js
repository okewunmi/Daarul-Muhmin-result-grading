import { NextResponse } from 'next/server';
import { actions } from '../../../lib/server/actions.js';
import { one } from '../../../lib/server/db.js';
import {
  COOKIE_NAME,
  cookieOptions,
  createSessionToken,
  readSessionToken,
} from '../../../lib/server/session.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const json = (body, status = 200) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request) {
  // Browsers cannot send JSON cross-site without a CORS preflight, so this also blocks CSRF.
  if (!(request.headers.get('content-type') || '').includes('application/json')) {
    return json({ success: false, message: 'Unsupported request' }, 415);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, message: 'Invalid request' }, 400);
  }

  const action = Object.prototype.hasOwnProperty.call(actions, body?.action) ? actions[body.action] : null;
  if (!action) return json({ success: false, message: 'Unknown action' }, 404);
  const args = Array.isArray(body.args) ? body.args : [];

  try {
    // Who is calling? Re-check the user in the database on every request, so a
    // deactivated or deleted account stops working immediately.
    let user = null;
    const userId = readSessionToken(request.cookies.get(COOKIE_NAME)?.value);
    if (userId) {
      user = await one('select * from users where id = $1 and is_active', [userId]);
    }

    if (action.auth !== 'public' && !user) {
      return json({ success: false, message: 'Your session has expired. Please log in again.', code: 401 }, 401);
    }

    let newSessionUserId = null;
    let endSession = false;
    const ctx = {
      user,
      startSession: (id) => { newSessionUserId = id; },
      endSession: () => { endSession = true; },
    };

    const result = await action.run(ctx, ...args);
    const response = json(result);

    if (newSessionUserId) {
      response.cookies.set(COOKIE_NAME, createSessionToken(newSessionUserId), cookieOptions());
    } else if (endSession) {
      response.cookies.set(COOKIE_NAME, '', cookieOptions(0));
    }
    return response;
  } catch (error) {
    console.error(`[rpc] ${body.action} failed:`, error);
    return json({ success: false, message: 'Something went wrong on the server. Please try again.' }, 500);
  }
}
