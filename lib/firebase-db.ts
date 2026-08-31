import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  setPersistence,
  browserLocalPersistence,
  Auth,
} from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';
import { Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
};

export const hasFirebaseConfig = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.includes('your-')
  );
};

let app = getApps().length > 0 ? getApps()[0] : null;

export const getFirebaseApp = () => {
  if (!hasFirebaseConfig()) return null;
  
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

export const getFirebaseAuth = (): Auth | null => {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  
  try {
    const auth = getAuth(firebaseApp);
    setPersistence(auth, browserLocalPersistence);
    return auth;
  } catch (error) {
    console.error('Firebase auth error:', error);
    return null;
  }
};

export const getFirebaseDatabase = (): Database | null => {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  
  try {
    return getDatabase(firebaseApp);
  } catch (error) {
    console.error('Firebase database error:', error);
    return null;
  }
};

export interface FirebaseUser {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN';
  kycStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  createdAt: string;
  demoBalance: number;
}

export async function createFirebaseUser(
  email: string,
  password: string,
  name: string
): Promise<FirebaseUser | null> {
  try {
    const auth = getFirebaseAuth();
    const db = getFirebaseDatabase();
    
    if (!auth || !db) return null;

    // Create auth account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Create user profile in Realtime Database
    const userData: FirebaseUser = {
      id: firebaseUser.uid,
      email: firebaseUser.email || email,
      name,
      role: 'USER',
      kycStatus: 'NOT_STARTED',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      demoBalance: 10000, // Initial demo balance
    };

    // Store user data in Realtime Database
    const userRef = ref(db, `users/${firebaseUser.uid}`);
    await set(userRef, userData);

    return userData;
  } catch (error) {
    console.error('Firebase create user error:', error);
    return null;
  }
}

export async function getFirebaseUserByEmail(email: string): Promise<FirebaseUser | null> {
  try {
    const db = getFirebaseDatabase();
    if (!db) return null;

    // Query users by email (in a real app, use Firestore indexes)
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);

    if (!snapshot.exists()) return null;

    const users = snapshot.val();
    for (const userId in users) {
      if (users[userId].email === email) {
        return users[userId] as FirebaseUser;
      }
    }

    return null;
  } catch (error) {
    console.error('Firebase get user error:', error);
    return null;
  }
}

export async function getFirebaseUserById(userId: string): Promise<FirebaseUser | null> {
  try {
    const db = getFirebaseDatabase();
    if (!db) return null;

    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) return null;

    return snapshot.val() as FirebaseUser;
  } catch (error) {
    console.error('Firebase get user by id error:', error);
    return null;
  }
}
