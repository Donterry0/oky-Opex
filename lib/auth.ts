import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  clearFirebaseSession,
  getFirebaseSessionUser,
  hasFirebaseConfig,
  setFirebaseSession,
} from '@/lib/firebase';
import { prisma } from '@/lib/prisma';
import { findUserById, userSessions } from '@/lib/demo-db';

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  passwordHash?: string;
  withdrawalPinHash?: string | null;
  kycStatus?: string;
  status?: string;
  [key: string]: unknown;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function hashWithdrawalPin(pin: string) {
  return bcrypt.hash(pin, 12);
}

export async function verifyWithdrawalPin(pin: string, hash: string) {
  if (!pin || !hash) return false;
  return bcrypt.compare(pin, hash);
}

export async function generateSessionToken() {
  return crypto.randomUUID();
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('oky_session')?.value;

  if (!token) return null;

  if (hasFirebaseConfig()) {
    const user = await getFirebaseSessionUser(token);
    if (!user) return null;
    return user as SessionUser;
  }

  // Try Prisma first
  try {
    const session = await prisma.session.findFirst({
      where: { tokenHash: token },
      include: { user: true },
    });

    if (session && new Date(session.expiresAt) >= new Date()) {
      return session.user as SessionUser;
    }

    if (session) {
      await prisma.session.deleteMany({ where: { id: session.id } });
    }
  } catch {
    // Prisma failed, try demo database
    console.warn('Prisma failed, falling back to demo database');
  }

  // Fall back to demo database
  const session = userSessions.get(token);
  if (!session || session.expiresAt < new Date()) {
    userSessions.delete(token);
    return null;
  }

  const user = await findUserById(session.userId);
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    kycStatus: user.kycStatus,
    status: user.status,
  } as SessionUser;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'ADMIN') redirect('/dashboard');
  return user;
}

export async function setSessionCookie(userId: string, token: string) {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  if (hasFirebaseConfig()) {
    await setFirebaseSession(userId, token);
    cookies().set('oky_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    });
    return;
  }

  // Try Prisma first
  try {
    await prisma.session.create({
      data: { userId, tokenHash: token, expiresAt },
    });
  } catch {
    // Prisma failed, use demo database
    console.warn('Prisma failed, using demo database for session');
    userSessions.set(token, { userId, expiresAt });
  }

  cookies().set('oky_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function clearSessionCookie() {
  const token = cookies().get('oky_session')?.value;
  if (token) {
    if (hasFirebaseConfig()) {
      await clearFirebaseSession(token);
    }
    userSessions.delete(token); // Also clear from demo db
  }
  cookies().delete('oky_session');
}

export async function ensureDemoSeed() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@oky.demo';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin123!';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'OKY Admin',
        passwordHash: await hashPassword(adminPassword),
        role: 'ADMIN',
        kycStatus: 'APPROVED',
        demoBalance: { create: { amount: 250000, currency: 'USD' } },
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'ADMIN_CREATED',
        details: 'Initial demo admin account was created.',
      },
    });
  }

  const demoUser = await prisma.user.findUnique({ where: { email: 'demo@oky.demo' } });
  if (!demoUser) {
    await prisma.user.create({
      data: {
        email: 'demo@oky.demo',
        name: 'Demo Trader',
        passwordHash: await hashPassword('Demo123!'),
        role: 'USER',
        demoBalance: { create: { amount: 10000, currency: 'USD' } },
      },
    });
  }
}
