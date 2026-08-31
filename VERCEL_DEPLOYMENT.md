# Vercel Deployment Guide

Your app is now deployed to Vercel! Follow these steps to configure environment variables.

## ✅ What's Done
- GitHub repository connected to Vercel
- Code pushed to main branch
- Vercel auto-deployment configured
- vercel.json configuration file created

## 🔐 Setting Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Find the `oky-Opex` project
3. Click on it to open settings

### Step 2: Navigate to Environment Variables
1. Click on **Settings** tab
2. Click on **Environment Variables** in the left menu

### Step 3: Add Firebase Credentials

Add the following environment variables with the values from your `.env.local`:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyADopRUWeNbrev-wb316uUQiAPq88OYlnQ` | Already in your .env.local |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `okyinv.firebaseapp.com` | Firebase project domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `okyinv` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `okyinv.firebasestorage.app` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `331299209811` | From Firebase config |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:331299209811:web:e2e28c0ed5a8c404f7fca6` | From Firebase config |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-Z5SLSZEEK1` | Analytics ID |
| `NEXT_PUBLIC_APP_URL` | `https://oky-opex.vercel.app` | Already configured |

### Step 4: For Database (Optional)

If you want to use PostgreSQL instead of the demo database:

1. Set up a Postgres database (e.g., via Railway, Supabase, or AWS RDS)
2. Add to Vercel environment:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/oky_opex
   ```

### Step 5: For Firebase Admin SDK (Optional)

If you have Firebase service account credentials:

1. Get the JSON file from Firebase Console > Project Settings > Service Accounts
2. Add to Vercel environment:
   ```
   FIREBASE_PROJECT_ID=okyinv
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@okyinv.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
   ```

## 🚀 Deployment Process

### Automatic Deployment
- Every push to `main` branch triggers auto-deployment
- Vercel builds and deploys automatically
- Takes ~3-5 minutes

### Manual Redeployment
1. Go to Vercel Dashboard
2. Click the project
3. Click **Deployments** tab
4. Click the three dots on latest deployment
5. Select **Redeploy**

## 📊 Deployment Status

You can check deployment status at:
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Live App**: https://oky-opex.vercel.app
- **GitHub Actions**: https://github.com/Donterry0/oky-Opex/actions

## 🔗 View Logs

To see build and deployment logs:
1. Go to Vercel Dashboard
2. Click `oky-Opex` project
3. Click on a deployment
4. View build output and logs

## ✨ How the App Works on Vercel

The app uses a **3-tier fallback system**:

1. **PostgreSQL (Prisma)** - If `DATABASE_URL` is set
2. **Firebase** - If Firebase credentials are set
3. **Demo Database** - Built-in fallback (in-memory)

On Vercel:
- ✅ Demo DB works immediately (no setup needed)
- ✅ Can add PostgreSQL for production data
- ✅ Can add Firebase for cloud storage
- ✅ Session data stored in cookies (works across all modes)

## 🧪 Testing Your Deployment

1. Visit: https://oky-opex.vercel.app
2. Click **Register**
3. Create an account:
   - Name: Test User
   - Email: test@example.com
   - Password: Password123!
4. Should redirect to dashboard
5. Try logging out and back in

## ❌ Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all environment variables are set
- Verify `npm run build` works locally

### App Shows Blank Page
- Check browser console for errors
- Verify Firebase credentials are correct
- Check Vercel function logs

### 500 Internal Server Error
- Check Vercel edge function logs
- Verify environment variables
- App will fall back to demo DB if database fails

## 📈 Next Steps

1. ✅ Push code to GitHub (already done)
2. ⏳ Add Firebase env vars to Vercel (you do this)
3. 🚀 Vercel auto-deploys
4. 🌍 App lives at https://oky-opex.vercel.app
5. 📊 Monitor on Vercel Dashboard
6. 🔄 Continuous deployment on every git push

## 🎯 Production Checklist

- [ ] Vercel project created and connected
- [ ] Firebase environment variables added
- [ ] App builds successfully on Vercel
- [ ] Can register new user on live app
- [ ] Can login and access dashboard
- [ ] Navigation works
- [ ] Markets/trading pages load
- [ ] Logout works

## 📞 Support

If you need help:
1. Check Vercel logs: https://vercel.com/dashboard/oky-Opex/deployments
2. Check GitHub: https://github.com/Donterry0/oky-Opex
3. Review error messages in browser console

---

**Your app is live at**: https://oky-opex.vercel.app ✅
