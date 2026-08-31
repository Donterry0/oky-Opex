# OKY — Simulated Broker / Exchange Platform

OKY is a full-stack, simulated digital asset brokerage web application built with Next.js (App Router), Prisma, and PostgreSQL. It provides a public-facing marketing site plus a secure admin panel for managing users, KYC, balances, deposits/withdrawals, inquiries, and platform settings.

> ⚠️ **Simulated environment**: All balances, trades, deposits, and withdrawals are test-only and carry no real monetary value.

## Features

### Public site
- Landing page, About Us, Services (Markets), and Contact/inquiry form
- Account registration and login
- Live-style market data, portfolio, and watchlist
- Responsive layout for mobile, tablet, and desktop

### Admin panel (`/admin`)
- Secure, role-gated authentication (`role: ADMIN`)
- Dashboard with key metrics (users, KYC, withdrawals, deposits, balances, volume)
- User management, KYC review, balance adjustments
- Deposit review (crypto wallet deposit requests credited to user balance on approval)
- Withdrawal review, transaction history, audit logs
- Contact form inquiries/leads management
- Platform settings (support contact details)

## Tech stack
- **Frontend/Backend:** Next.js 14 (App Router, Server Actions)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Cookie-based sessions with bcrypt password hashing (optional Firebase Auth integration)
- **Validation:** Zod
- **Styling:** Tailwind CSS

## Getting started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (local or hosted, e.g. Neon, Supabase, RDS)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy the example file and fill in your own values:
```bash
cp .env.example .env
```
At minimum, set `DATABASE_URL` to a real PostgreSQL connection string. See `.env.example` for all supported variables (Firebase, session secrets, admin defaults).

### 3. Run database migrations
```bash
npx prisma migrate deploy   # applies committed migrations (production/CI)
# or, during local development:
npx prisma migrate dev
```

### 4. Seed the database
Creates an initial admin account (`ADMIN_EMAIL`/`ADMIN_PASSWORD`), a demo user, and default settings:
```bash
npm run db:seed
```

### 5. Run the app
```bash
npm run dev
```
Visit `http://localhost:3000`. Log in to `/admin` with the seeded admin credentials.

## Available scripts
| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate the Prisma client and build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Apply committed Prisma migrations (`prisma migrate deploy`) |
| `npm run db:seed` | Seed the database with an admin account, demo user, and default settings |

## Deployment
This project is ready to deploy to any Node.js hosting platform.

### Vercel
A `vercel.json` is included with build/install commands preconfigured. Set the required environment variables (see `.env.example`) in your Vercel project settings, then deploy:
```bash
vercel --prod
```
After the first deploy, run `npx prisma migrate deploy` and `npm run db:seed` against your production `DATABASE_URL` (e.g. via a one-off Vercel CLI/CI job) to initialize the schema and admin account.

### Other platforms (Heroku, Railway, Render, AWS, etc.)
1. Provision a PostgreSQL database and set `DATABASE_URL`.
2. Set the remaining environment variables from `.env.example`.
3. Run `npm install && npm run build`.
4. Run `npx prisma migrate deploy && npm run db:seed` once against the target database.
5. Start the app with `npm run start`.

## Database schema
The Prisma schema (`prisma/schema.prisma`) defines models for users, sessions, KYC submissions, assets, balances, holdings, orders/trades, deposits, withdrawals, transactions, audit logs, contact inquiries, and platform settings. Run `npx prisma studio` to browse data locally.
