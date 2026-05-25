# Cardinal Immersions Backend

Production-ready Express backend for the Cardinal Immersions platform.

## What this backend covers

- Public applications and institutional inquiries
- Admin authentication with JWT and bcrypt
- Admin CRUD for applications, inquiries, programs, and admins
- Dashboard stats and CSV exports
- Audit logging
- Email notifications via Resend, with dev-mode console fallback

## Neon Setup

1. Create a Neon project and copy the Postgres connection string into `DATABASE_URL`.

2. Install dependencies

```bash
cd backend
npm install
```

3. Copy environment variables

```bash
copy .env.example .env
```

4. Fill in `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, and the first-admin variables.

## Do migrations run automatically?

Yes. `npm run dev` and `npm start` both call the bootstrap sequence in [backend/src/server.js](C:/Users/pc/Desktop/Projects/andylcc/backend/src/server.js), which:

1. checks the Neon connection
2. runs the schema migration file
3. seeds the first super admin if the table is empty
4. seeds demo programs if `SEED_DEMO_PROGRAMS=true`
5. starts the server

You still can run migrations manually if you want:

```bash
npm run migrate
```

## How to start the backend by itself

From the repository root:

```powershell
cd backend
npm install
npm run dev
```

That starts the backend only. It will boot on `PORT` from `.env` and expose `/health`.

## How to start frontend + backend together

From the repository root:

```powershell
.\start.ps1
```

Or on Unix-like shells:

```bash
./start.sh
```

## Environment Notes

- `DATABASE_URL` should point to Neon.
- `DATABASE_SSL=true` is recommended unless your Neon URL already includes `sslmode=require`.
- `RESEND_API_KEY` is optional during development. If missing, emails are logged to the console.
- `FIRST_ADMIN_*` values are used to create the initial super admin on first startup when the database is empty.

## API Overview

Public:

- `POST /api/applications`
- `POST /api/inquiries`
- `GET /api/programs`
- `GET /api/programs/:slug`
- `GET /health`

Auth:

- `POST /api/auth/login`
- `GET /api/auth/me`

Admin:

- `GET /api/admin/applications`
- `GET /api/admin/applications/:id`
- `PATCH /api/admin/applications/:id`
- `DELETE /api/admin/applications/:id`
- `GET /api/admin/inquiries`
- `GET /api/admin/inquiries/:id`
- `PATCH /api/admin/inquiries/:id`
- `DELETE /api/admin/inquiries/:id`
- `GET /api/admin/programs`
- `POST /api/admin/programs`
- `PUT /api/admin/programs/:id`
- `DELETE /api/admin/programs/:id`
- `GET /api/admin/admins`
- `POST /api/admin/admins`
- `PUT /api/admin/admins/:id`
- `DELETE /api/admin/admins/:id`
- `GET /api/admin/stats`
- `GET /api/admin/exports/applications.csv`
- `GET /api/admin/exports/inquiries.csv`

## Frontend Integration Notes

The existing frontend currently uses `localStorage` and mock auth helpers. Replace those calls with API requests:

- `mockAdminData.getApplications()` -> `GET /api/admin/applications`
- `mockAdminData.setApplications()` -> `PATCH /api/admin/applications/:id`
- `mockAdminData.getInquiries()` -> `GET /api/admin/inquiries`
- `mockAdminData.setInquiries()` -> `PATCH /api/admin/inquiries/:id`
- `mockAdminData.getPrograms()` -> `GET /api/admin/programs`
- `adminAuth.loginAdmin()` -> `POST /api/auth/login`
- `adminAuth.getCurrentAdmin()` -> `GET /api/auth/me`

Store the JWT in `sessionStorage` and send it in `Authorization: Bearer <token>` headers for admin requests.

## Important Compatibility Notes

- The current frontend lives in the repo root, not `/frontend`.
- The frontend currently uses browser storage for admin state, so it will need API integration work.
- The frontend admin login is email-only today, while this backend uses JWT + password auth.
- The current UI uses a few legacy status values that do not exactly match the new schema:
  - `partnership` in the current inquiry UI maps to `partnered` in the backend schema.
  - `coming-soon` in the current programs UI maps to `coming_soon` in the backend schema.
- The admin programs page in the existing frontend uses a calendar-style record shape (`startDate`, `endDate`, `imageUrl`) that is not identical to the new public program schema, so that page will need a follow-up frontend mapping.

## Frontend env

The frontend should use `VITE_API_BASE_URL=http://localhost:5000` during local development so its requests hit the backend.
