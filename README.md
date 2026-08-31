# oky-Opex

A full-stack broker/trading platform built with Next.js, featuring a public
marketing site and a secure admin panel. Optimized for **free-tier hosting**
with **Render** (app), **Firebase** (auth + data), and **GitHub Pages**
(documentation).

## Hosting architecture

| Layer            | Service                          | Notes                                   |
|-------------------|-----------------------------------|------------------------------------------|
| Full-stack app     | [Render](https://render.com) (free) | Node.js/Next.js web service, see `render.yaml` |
| Auth & database     | [Firebase](https://firebase.google.com) (free) | Authentication + Firestore/Realtime DB |
| Documentation site   | [GitHub Pages](https://pages.github.com) | Static docs published from `docs/` |
| CI/CD               | GitHub Actions | `.github/workflows/deploy-render.yml` and `.github/workflows/github-pages.yml` |

## Features

- **Public website:** landing page, markets, asset pages, support, legal pages.
- **Admin panel:** authentication, dashboard, user management, KYC review,
  withdrawals, balances, settings, and an audit log.
- **Authentication:** Firebase Auth (email/password) with a Prisma/Postgres
  fallback for local development without Firebase configured.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your Firebase + database values
npx prisma migrate dev       # if using Postgres
npm run dev
```

Visit `http://localhost:3000`.

## Deploying to Render + Firebase

1. **Create a Firebase project.**
   - Go to the [Firebase Console](https://console.firebase.google.com/) and
     create a project (free "Spark" plan is enough to start).
   - Enable **Authentication** (Email/Password provider) and
     **Firestore Database** (or Realtime Database).
   - Under Project Settings → General, register a Web App to get the
     `NEXT_PUBLIC_FIREBASE_*` client config values.
   - Under Project Settings → Service Accounts, generate a private key to get
     `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`
     for server-side use.
   - See `FIREBASE_SETUP.md` and `FIREBASE_INTEGRATION.md` for more detail.

2. **Deploy to Render.**
   - Push this repository to GitHub (already done ✅).
   - In the [Render dashboard](https://dashboard.render.com), choose
     **New → Blueprint** and point it at this repo. Render will read
     `render.yaml` and provision a free-tier web service automatically.
   - Alternatively, create a **New → Web Service** manually with:
     - Build command: `npm ci && npm run build`
     - Start command: `npm run start`
   - Fill in the environment variables listed in `.env.example` under the
     service's **Environment** tab (Firebase client + admin config, database
     URL, admin credentials, secrets, etc). Render automatically injects
     `PORT`, which Next.js honors via `next start`.
   - Once deployed, set `NEXT_PUBLIC_APP_URL` to your Render URL, e.g.
     `https://oky-opex.onrender.com`.

3. **Enable auto-deploy via GitHub Actions (optional).**
   - Render auto-deploys from `main` by default once connected. The
     `Deploy to Render` workflow (`.github/workflows/deploy-render.yml`) also
     runs a build check on every push and can explicitly hit a Render
     [Deploy Hook](https://render.com/docs/deploy-hooks) if you add the
     `RENDER_DEPLOY_HOOK_URL` secret to the repo (Settings → Secrets and
     variables → Actions).

4. **Free tier notes.**
   - Render's free web services spin down after inactivity, so the first
     request after idling may take 30-60s (cold start).
   - Firebase's free Spark plan has daily read/write quotas — keep admin
     dashboard queries scoped/paginated rather than fetching entire
     collections.

## Publishing documentation to GitHub Pages

The `docs/` folder contains a static documentation site. It is published
automatically by `.github/workflows/github-pages.yml` whenever `docs/`
changes on `main`. To enable it the first time:

1. Go to the repository **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or run the workflow manually) — the site will be available
   at `https://<owner>.github.io/oky-Opex/`.

## Environment variables

See `.env.example` for the full list, including database, Firebase
(client + admin), authentication secrets, admin defaults, and app URL
settings.