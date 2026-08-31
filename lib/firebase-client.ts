import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const hasClientFirebaseConfig = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.includes('your-')
  );
};

let app: ReturnType<typeof initializeApp> | null = null;

export const getFirebaseClientApp = () => {
  if (!hasClientFirebaseConfig()) return null;
  
  if (!app) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error('Firebase initialization error:', error);
      return null;
    }
  }
  
  return app;
};

export const getFirebaseClientAuth = () => {
  const clientApp = getFirebaseClientApp();
  if (!clientApp) return null;
  
  try {
    const auth = getAuth(clientApp);
    // Set persistence to LOCAL so sessions survive page reloads
    setPersistence(auth, browserLocalPersistence);
    return auth;
  } catch (error) {
    console.error('Firebase auth error:', error);
    return null;
  }
};
