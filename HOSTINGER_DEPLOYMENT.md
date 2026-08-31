# Hostinger Deployment Guide

This guide covers deploying oky-Opex (a Next.js 14 app with Prisma/PostgreSQL
and Firebase) to Hostinger.

## 1. Choose the right Hostinger plan

This app is **not a static site** — it uses server-side rendering, API
routes / Server Actions, and needs a persistent Node.js process. Hostinger's
basic shared "Website Builder" hosting (static files / PHP only) **cannot**
run it. You need one of:

- **Hostinger Cloud/Business hosting with the Node.js App feature** (hPanel
  provides a "Node.js" application type on certain plans), or
- **Hostinger VPS** — full root access, install Node.js yourself, run the
  app with a process manager (PM2) behind Nginx.

VPS gives the most control and is the safest choice for full compatibility
with Prisma and native dependencies. Confirm your plan supports Node.js
before proceeding.

## 2. Database

The app uses Prisma against PostgreSQL, with an in-memory fallback so it can
still run without a live DB connection (see `lib/settings.ts`,
`lib/inquiries.ts`, `lib/auth.ts`). Hostinger's built-in database support is
MySQL-only, so plan for one of:

- An external managed Postgres provider (e.g. Neon, Supabase, Railway,
  AWS RDS) — set `DATABASE_URL` to point at it, or
- A self-hosted Postgres instance on your Hostinger VPS.

Firebase (Auth + Realtime Database) is a separate cloud service and works
the same regardless of where the app is hosted — just carry over the
`NEXT_PUBLIC_FIREBASE_*` / `FIREBASE_*` environment variables described in
`.env.example` and `VERCEL_DEPLOYMENT.md`.

## 3. Environment variables

Set the same variables documented in `.env.example`, including:

- `DATABASE_URL`
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`,
  `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`,
  `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`,
  `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `NEXTAUTH_SECRET`, `JWT_SECRET`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `NEXT_PUBLIC_APP_URL` (set to your Hostinger domain, e.g.
  `https://yourdomain.com`)

Also add your domain to the `allowedOrigins` list in `next.config.mjs` so
Next.js Server Actions accept requests from it.

## 4. Build & start commands

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build   # runs `prisma generate && next build`
npm run start   # runs `next start`
```

Node.js `>=18.18.0` is required (see `engines` in `package.json`).

The build produces a self-contained `.next/standalone` server bundle
(`output: 'standalone'` in `next.config.mjs`), which is convenient to deploy
to a Node.js host — copy `.next/standalone`, `.next/static`, and `public`
to the server if you want the minimal footprint, or simply run
`npm run build && npm run start` directly on the server/VPS.

## 5a. Deploying via hPanel's Node.js App feature

1. In hPanel, open **Advanced > Node.js** and create a new application.
2. Set the application root to the repository directory, the startup file
   to `node_modules/.bin/next` with arguments `start` (or point it at a
   small `server.js` that calls `next start` if the panel requires a single
   entry file), and choose a supported Node.js version (>=18.18).
3. Add the environment variables from Step 3 in the app's environment
   variable settings.
4. Use the panel's "Run NPM Install" / "Run NPM Build" actions (or SSH in)
   to run the commands from Step 4.
5. Start/restart the application from hPanel.
6. Attach your domain and enable the free SSL certificate in hPanel.

## 5b. Deploying via a Hostinger VPS

1. SSH into the VPS, install Node.js `>=18.18` (e.g. via `nvm` or
   `NodeSource`), and install PostgreSQL if self-hosting the database.
2. Clone this repository onto the VPS and `cd` into it.
3. Create a `.env` file with the variables from Step 3.
4. Run the build & start commands from Step 4 to verify the app boots.
5. Use PM2 to keep it running: see `deploy/pm2.config.js`.
   ```bash
   npm install -g pm2
   pm2 start deploy/pm2.config.js
   pm2 save
   pm2 startup
   ```
6. Install Nginx and use `deploy/nginx.oky-opex.conf` as a starting point
   for reverse-proxying port 80/443 to the Node.js process on port 3000.
7. Point your domain's DNS A record at the VPS IP, then run
   `sudo certbot --nginx -d yourdomain.com` to enable free HTTPS via
   Let's Encrypt.

## 6. Verification checklist

- [ ] App loads over HTTPS at your Hostinger domain
- [ ] Firebase login/auth works
- [ ] Prisma-backed features work (or fall back gracefully if DB is
      unreachable)
- [ ] `npm run build`, `npx tsc --noEmit`, and `npm run lint` pass locally
      before pushing changes
