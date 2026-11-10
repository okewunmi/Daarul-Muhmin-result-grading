# Daarul Muhmin – Result Grading System

Next.js app for managing academic sessions, classes, students, subjects and bilingual (English/Arabic) results.
Hosted on Netlify, data stored in **Neon** (serverless Postgres).

## How it fits together

- The browser never talks to the database. Pages call `lib/api.js`, which sends requests to
  `app/api/rpc/route.js`; that route runs the SQL in `lib/server/actions.js` using `DATABASE_URL`.
- Login uses a signed, HttpOnly cookie (7 days). Passwords are hashed with bcrypt.
- Tables are defined in `db/schema.sql`.

## First-time setup

1. **Neon**: create a free account at neon.com, create a project, and copy the connection string
   (Project dashboard → Connect).
2. **Netlify**: Site configuration → Environment variables, add:
   - `DATABASE_URL` – the Neon connection string
   - `SESSION_SECRET` – a long random string
     (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
3. **Create the tables** (once): either run
   `DATABASE_URL="..." npm run db:migrate`, or paste `db/schema.sql` into the Neon **SQL Editor** and run it.
4. Push to GitHub; Netlify redeploys.
5. **Open the site straight away and register the first account.** While the database has no
   accounts, anyone can register; after that, registration is closed and new accounts must be created
   by a logged-in user (or set `ALLOW_REGISTRATION=true` temporarily).

## Local development

```bash
cp .env.example .env.local   # fill in DATABASE_URL and SESSION_SECRET
npm install
npm run db:migrate
npm run dev
```

## Backups (please do this every term)

```bash
DATABASE_URL="..." npm run db:backup
# writes backups/backup-YYYY-MM-DD.json

DATABASE_URL="..." npm run db:restore -- backups/backup-YYYY-MM-DD.json
# loads a backup into an empty, migrated database
```

Keep a copy outside this project (e.g. Google Drive). The file holds student data, so never commit it
(`/backups` is git-ignored) and never upload it anywhere public.

## Forgotten password

There is no public "forgot password" any more (it let anyone reset anyone's password). The administrator runs:

```bash
DATABASE_URL="..." npm run db:reset-password -- teacher@example.com "NewPassword123"
```

## Secrets

Never put keys or connection strings in the code. Use environment variables only.

## Rescuing data from the old Appwrite project (one-time)

1. In the Appwrite console create a **new API key** with only the read scopes for databases/documents.
2. Run (Mac/Linux; on Windows set the variables first or use Git Bash):

```bash
APPWRITE_ENDPOINT="https://nyc.cloud.appwrite.io/v1" \
APPWRITE_PROJECT_ID="..." APPWRITE_DATABASE_ID="..." APPWRITE_API_KEY="..." \
npm run db:import-appwrite
```

With only those variables it saves a raw copy to `backups/appwrite-export-DATE.json`. Add
`DATABASE_URL` as well to import the data into Neon (original IDs are kept; safe to run twice).
Staff accounts are not imported: register the first account again. Delete the API key afterwards.
