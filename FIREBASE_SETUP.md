# Firebase Integration Guide

This guide walks you through setting up Firebase for the oky-Opex trading simulator.

## Overview

The application supports two authentication approaches:
1. **Prisma + PostgreSQL** (Default) - Works out of the box
2. **Firebase Authentication** (Optional) - For cloud-based authentication

## Option 1: Using Prisma (Default - Already Configured)

The application uses Prisma with PostgreSQL by default. No additional setup needed beyond having the database running.

```bash
# Start PostgreSQL (if using docker)
docker run -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=oky_opex -p 5432:5432 postgres:latest

# Run migrations
npx prisma migrate dev

# Start the app
npm run dev
```

## Option 2: Using Firebase (Optional)

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter "oky-opex" as the project name
4. Click through the setup wizard

### Step 2: Get Firebase Credentials

#### For Client-Side Authentication:

1. In Firebase Console, go to **Project Settings** (⚙️ icon)
2. Click on **"Your apps"** section
3. Click **"Add app"** → **Web**
4. Register the app with alias "oky-web"
5. Copy the configuration object (you'll see firebaseConfig)
6. Add to `.env.local` (or `.env`):

```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="oky-opex.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="oky-opex"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="oky-opex.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abc123..."
```

#### For Server-Side (Admin SDK):

1. In Firebase Console, go to **Project Settings** (⚙️ icon)
2. Click **"Service Accounts"** tab
3. Click **"Generate New Private Key"**
4. Save the JSON file
5. Extract values and add to `.env.local`:

```env
FIREBASE_PROJECT_ID="oky-opex"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xyz@oky-opex.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----\n"
```

### Step 3: Enable Authentication Methods

1. In Firebase Console, go to **Authentication**
2. Click **"Get Started"**
3. Enable **Email/Password** provider:
   - Click **Email/Password**
   - Enable "Email/Password" toggle
   - Click "Save"

### Step 4: Create Firestore Database (Optional)

For storing user profiles in Firestore:

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create Database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location
5. Click **"Create"**

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your Firebase credentials.

## Testing the Setup

### Test Database Connection:
```bash
npx prisma db push
```

### Test Firebase Connection:
```bash
npm run build
```

If you get no errors, Firebase is properly configured.

### Run Development Server:
```bash
npm run dev
```

Visit `http://localhost:3000` and try logging in.

## Troubleshooting

### "Firebase is not configured" Error
- Check that `NEXT_PUBLIC_FIREBASE_*` variables are set in `.env.local`
- Restart the development server after changing `.env.local`
- Make sure variables don't start with "your-"

### "Cannot create user" Error
- Ensure Email/Password authentication is enabled in Firebase Console
- Check Firebase quotas/limits in Console → Usage

### "Invalid API Key" Error
- Verify your Firebase credentials are correct
- Check that your web app is registered in Firebase Console
- Make sure API_KEY is not restricted to certain websites (if using restrictions, add localhost:3000)

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Run `npx prisma db push` to sync schema

## Architecture

### Without Firebase (Using Prisma)
```
Login Form → loginAction (Server) → Prisma.User.findUnique → Session Cookie
```

### With Firebase
```
Login Form → Firebase Auth SDK → Backend checks Firebase Session → Session Cookie
```

Both methods create an `oky_session` cookie for maintaining the user session.

## Security Notes

1. **Never commit `.env.local`** - It contains sensitive credentials
2. **Use `.env.example`** - Keep it updated with variable names only
3. **In production**, use:
   - Environment variables from hosting provider (Vercel, etc.)
   - Firebase Security Rules for database access
   - HTTPS only for authentication
   - Restrict Firebase API keys by domain

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth for Web](https://firebase.google.com/docs/auth/web/start)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
