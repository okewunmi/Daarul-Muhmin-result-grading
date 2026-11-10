// Browser-side data layer. Replaces the old lib/appwrite.js.
// The function names and return shapes are unchanged, so the pages keep working.
// All database access happens on the server (app/api/rpc/route.js), never in the browser.

import { gradingSystem } from './grading.js';

export { gradingSystem };

async function rpc(action, args = [], fallback = {}) {
  try {
    const response = await fetch('/api/rpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ action, args }),
    });
    const data = await response.json().catch(() => null);
    if (!data || typeof data !== 'object') {
      return { ...fallback, success: false, message: 'Unexpected response from the server' };
    }
    return { ...fallback, ...data };
  } catch (error) {
    console.error(`${action} failed:`, error);
    return { ...fallback, success: false, message: 'Network error. Please check your internet connection.' };
  }
}

// group('students', { getAll: { students: [] } })  ->  { getAll: (...args) => rpc('students.getAll', args, { students: [] }) }
const group = (namespace, functions) =>
  Object.fromEntries(
    Object.entries(functions).map(([name, fallback]) => [
      name,
      (...args) => rpc(`${namespace}.${name}`, args, fallback),
    ])
  );

const auth = group('auth', {
  login: {},
  logout: {},
  createUser: {},
  getAllUsers: { users: [] },
  updateUser: {},
  deleteUser: {},
  resetPassword: {},
  forgotPassword: {},
});

export const adminUserManagement = {
  ...auth,
  isConfigured: () => true,
  getCurrentUser: async () => (await rpc('auth.me')).user || null,
};

// Kept so existing imports keep working.
export const appwriteAuth = adminUserManagement;

export const academicSessionsManager = group('sessions', {
  create: {},
  getAll: { sessions: [] },
  getActive: { session: null },
  update: {},
  delete: {},
});

export const classesManager = group('classes', {
  create: {},
  getAll: { classes: [] },
  getBySession: { classes: [] },
  update: {},
  delete: {},
  updateEnrollment: {},
});

export const studentsManager = group('students', {
  create: {},
  getAll: { students: [] },
  getByClass: { students: [] },
  getBySession: { students: [] },
  getById: { student: null },
  update: {},
  delete: {},
});

export const subjectsManager = group('subjects', {
  create: {},
  getAll: { subjects: [] },
  getById: { subject: null },
  update: {},
  delete: {},
});

export const resultsManager = group('results', {
  saveResult: {},
  getByStudent: { results: [] },
  getByClass: { results: [] },
  delete: {},
});

// Older name that supported choosing a term; same implementation now.
export const resultsManagers = resultsManager;
