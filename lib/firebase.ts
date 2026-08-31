import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export function hasFirebaseConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  return Boolean(
    projectId &&
      clientEmail &&
      privateKey &&
      !projectId.includes('your-project') &&
      !clientEmail.includes('your-project') &&
      !privateKey.includes('BEGIN PRIVATE KEY-----')
  );
}

export function getFirebaseApp() {
  if (!hasFirebaseConfig()) return null;

  try {
    if (getApps().length === 0) {
      const app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        }),
      });
      return app;
    }

    return getApps()[0];
  } catch {
    return null;
  }
}

export function getFirebaseDb() {
  const app = getFirebaseApp();
  if (!app) return null;
  return getFirestore(app);
}

export function getFirebaseAuth() {
  const app = getFirebaseApp();
  if (!app) return null;
  return getAuth(app);
}

export async function findFirebaseUserByEmail(email: string) {
  const db = getFirebaseDb();
  if (!db) return null;

  const snap = await db.collection('users').doc(email.toLowerCase()).get();
  if (!snap.exists) return null;

  return { id: snap.id, ...(snap.data() as Record<string, unknown>) };
}

export async function createFirebaseUser({
  email,
  name,
  passwordHash,
  role,
}: {
  email: string;
  name: string;
  passwordHash: string;
  role: string;
}) {
  const db = getFirebaseDb();
  if (!db) return null;

  const id = email.toLowerCase();
  const payload = {
    id,
    email: id,
    name,
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.collection('users').doc(id).set(payload, { merge: true });
  return payload;
}

type FirebaseUserRecord = {
  id: string;
  email?: string;
  name?: string | null;
  role?: string;
  [key: string]: unknown;
};

export async function getFirebaseSessionUser(token: string): Promise<FirebaseUserRecord | null> {
  const db = getFirebaseDb();
  if (!db) return null;

  const sessionSnap = await db.collection('sessions').doc(token).get();
  if (!sessionSnap.exists) return null;

  const session = sessionSnap.data() as { userId?: string; expiresAt?: string } | undefined;
  if (!session?.userId || !session.expiresAt) return null;

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    await db.collection('sessions').doc(token).delete();
    return null;
  }

  const userSnap = await db.collection('users').doc(session.userId).get();
  if (!userSnap.exists) return null;

  const data = userSnap.data() as Record<string, unknown> | undefined;
  if (!data) return null;

  return { ...data, id: userSnap.id } as FirebaseUserRecord;
}

export async function setFirebaseSession(userId: string, token: string) {
  const db = getFirebaseDb();
  if (!db) return null;

  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

  await db.collection('sessions').doc(token).set({
    userId,
    expiresAt,
    createdAt: new Date().toISOString(),
  });

  return expiresAt;
}

export async function clearFirebaseSession(token: string) {
  const db = getFirebaseDb();
  if (!db) return null;
  await db.collection('sessions').doc(token).delete();
  return true;
}
