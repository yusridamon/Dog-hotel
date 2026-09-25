# Deploying Pawsome Stay Dog Hotel

Pawsome Stay is a full-stack app made of three parts: a React client (Create React App), an Express + Prisma API, and a PostgreSQL database. All environment-specific configuration comes from environment variables, so the exact same code runs locally and in production. You only change env vars between environments, never the source.

- `client/` React 18 frontend (React Router 6, Axios)
- `server/` Express 4 API with Prisma 5
- PostgreSQL database named `doghotel`

---

## Local development

### Server (`server/`)

Run these from the `server/` folder:

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

- `npm run db:push` syncs the Prisma schema to your local PostgreSQL database.
- `npm run db:seed` creates the default admin user `admin@doghotel.com` / `admin123` plus baseline data.
- `npm run dev` starts the API on http://localhost:5000 with auto-reload.

Copy `server/.env.example` to `server/.env` first and fill in `DATABASE_URL` and the other values.

### Client (`client/`)

Run these from the `client/` folder:

```bash
npm install
npm start
```

- Leave `REACT_APP_API_URL` unset for local development. The client defaults to `/api` and the CRA dev proxy (`"proxy": "http://localhost:5000"` in `client/package.json`) forwards API calls to the local server.
- The client runs on http://localhost:3000.

---

## Production deployment

This guide uses Railway for the API and a managed PostgreSQL database, and Cloudflare Pages for the client. Any equivalent Node host and static host work the same way because everything is driven by env vars.

### Step 1: Provision managed PostgreSQL

Create a managed PostgreSQL instance (Railway's PostgreSQL plugin, or any provider). Copy its connection string. This becomes your production `DATABASE_URL`.

Note: many managed providers require SSL, so you may need to append `?sslmode=require` to the connection string, for example:

```
postgresql://user:pass@host:5432/railway?sslmode=require
```

### Step 2: Deploy the server

Deploy the `server/` folder to Railway. Set the following environment variables on the service:

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Required. From Step 1 (add `?sslmode=require` if needed). |
| `JWT_SECRET` | Required. Long random secret. Generate one below. |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | The live client URL. Can be a comma-separated list to also allow localhost, e.g. `https://your-app.pages.dev,http://localhost:3000`. |
| `PRICE_PER_DOG_PER_NIGHT` | Default price per dog per night, e.g. `45`. |
| `EMAIL_HOST` | Optional. |
| `EMAIL_PORT` | Optional. |
| `EMAIL_USER` | Optional. |
| `EMAIL_PASS` | Optional. |
| `EMAIL_FROM` | Optional. |

Generate a strong `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Notes on the server service:

- Railway injects `PORT` automatically. The API reads it and binds to `0.0.0.0`, so do not hardcode a port in production.
- `postinstall` runs `prisma generate` automatically during install, so the Prisma client is built on deploy.
- Start command is `npm start`.

### Step 3: Initialise the production database (once)

From a shell whose `DATABASE_URL` points at the production database, run:

```bash
npx prisma db push
npm run db:seed
```

Why `db push`: this project has no migration baseline (no versioned migration history committed), so `prisma db push` is the correct way to create the schema directly from `schema.prisma`.

Warning: do NOT run `prisma migrate dev` (`npm run db:migrate`) against production. It is a development command and can drop and reset data. For a future migration-based workflow, `npm run db:deploy` (`prisma migrate deploy`) exists to apply committed migrations safely, but that requires you to start generating and committing migrations first.

### Step 4: Deploy the client

Deploy the `client/` folder to Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `build`
- Environment variable: `REACT_APP_API_URL` = the Railway API origin WITHOUT `/api`, for example `https://your-api.up.railway.app`. The client appends `/api` itself.

The `client/public/_redirects` file is copied into the build output and handles SPA routing so React Router routes resolve on refresh. If you host on Vercel instead, `client/vercel.json` provides the same fallback.

### Step 5: Wire up CORS and test

Set the API's `CLIENT_URL` to the deployed client URL (exact origin, no trailing slash), then redeploy or restart the API so CORS allows the client. Then test a full booking flow end to end from the live client.

### Step 6: Security before go-live

- Change the seeded admin password. The default `admin@doghotel.com` / `admin123` must not survive to production. Log in and change it before or at go-live.
- Use a strong, randomly generated `JWT_SECRET` (see Step 2).
- Never commit `.env` files. Set secrets in the host's environment settings only.

---

## Required environment variables

### Server

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Required | PostgreSQL connection string. May need `?sslmode=require`. |
| `JWT_SECRET` | Required | Long random secret for signing tokens. |
| `JWT_EXPIRES_IN` | Optional | Token lifetime, defaults to `7d` in code. |
| `NODE_ENV` | Required | `production` on the live host. |
| `CLIENT_URL` | Required | Allowed browser origin(s). Comma-separated list supported. |
| `PRICE_PER_DOG_PER_NIGHT` | Required | Default nightly price per dog. |
| `PORT` | Injected | Railway/managed hosts inject this. Falls back to `5000` locally. |
| `EMAIL_HOST` | Optional | SMTP host. |
| `EMAIL_PORT` | Optional | SMTP port. |
| `EMAIL_USER` | Optional | SMTP user. |
| `EMAIL_PASS` | Optional | SMTP password. |
| `EMAIL_FROM` | Optional | From address, e.g. `Dog Hotel <you@example.com>`. |

If any email variable is left unset, email sending is skipped.

### Client

| Variable | Required | Notes |
| --- | --- | --- |
| `REACT_APP_API_URL` | Required in production | API origin WITHOUT `/api`. Leave unset locally to use the dev proxy. |

---

## Troubleshooting

- CORS errors in the browser: confirm the API's `CLIENT_URL` matches the client origin exactly (scheme + host, no trailing slash). Use the comma-separated form if you need to allow more than one origin.
- 404 on refresh of a client route: ensure the `_redirects` file (or `vercel.json` on Vercel) was deployed with the build. On Cloudflare Pages the output directory must be `build` so `_redirects` lands at the site root.
- Prisma client errors at runtime (for example "did not initialize yet"): ensure `postinstall` / `prisma generate` ran during the build. Re-deploy so install runs, or run `npx prisma generate` in the service.
- Database connection or SSL errors: verify `DATABASE_URL` is correct and reachable from the host, and append `?sslmode=require` if the provider requires SSL.

---

## Notes

- This project currently uses `db push` (no versioned migrations are committed). Use `prisma db push` to create and update the schema. `db:deploy` is available for a future migration-based workflow once you start committing migrations.
- Uploads are not used by this app, so there is no file storage or bucket to configure.
- Bookings longer than 10 nights require a manual quote. An admin sets the price in the admin booking detail page rather than it being auto-calculated.
