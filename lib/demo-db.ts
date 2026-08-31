// Demo Database - Simple In-Memory Store for Testing
// This allows the app to work without PostgreSQL

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  kycStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  createdAt: Date;
  lastLogin?: Date;
  demoBalance: number;
}

// In-memory store (in production, this would be Prisma + PostgreSQL or Firebase)
export const demoUsers: Map<string, DemoUser> = new Map();
export const userSessions: Map<string, { userId: string; expiresAt: Date }> = new Map();

export async function findUserByEmail(email: string): Promise<DemoUser | null> {
  const users = Array.from(demoUsers.values());
  for (const user of users) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return user;
    }
  }
  return null;
}

export async function findUserById(id: string): Promise<DemoUser | null> {
  return demoUsers.get(id) || null;
}

export async function createUser(data: {
  email: string;
  name: string;
  passwordHash: string;
  role?: 'USER' | 'ADMIN';
}): Promise<DemoUser> {
  const user: DemoUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: data.email.toLowerCase(),
    name: data.name,
    passwordHash: data.passwordHash,
    role: data.role || 'USER',
    status: 'ACTIVE',
    kycStatus: 'NOT_STARTED',
    createdAt: new Date(),
    demoBalance: 10000, // Initial demo balance in USD
  };

  demoUsers.set(user.id, user);
  return user;
}

export async function updateUser(id: string, data: Partial<DemoUser>): Promise<DemoUser | null> {
  const user = demoUsers.get(id);
  if (!user) return null;

  const updated = { ...user, ...data };
  demoUsers.set(id, updated);
  return updated;
}

export async function updateUserBalance(
  userId: string,
  amount: number
): Promise<DemoUser | null> {
  const user = demoUsers.get(userId);
  if (!user) return null;

  const updated = { ...user, demoBalance: user.demoBalance + amount };
  demoUsers.set(userId, updated);
  return updated;
}

export async function recordUserLogin(userId: string): Promise<void> {
  const user = demoUsers.get(userId);
  if (user) {
    user.lastLogin = new Date();
    demoUsers.set(userId, user);
  }
}

// Initialize with demo admin account
async function initializeDemoData() {
  const adminExists = await findUserByEmail(process.env.ADMIN_EMAIL || 'admin@oky.demo');
  if (!adminExists) {
    await createUser({
      email: process.env.ADMIN_EMAIL || 'admin@oky.demo',
      name: 'Admin',
      passwordHash: process.env.ADMIN_PASSWORD_HASH || 'demo-hash', // In real app, this is hashed
      role: 'ADMIN',
    });
  }
}

// Initialize on module load
initializeDemoData().catch(console.error);
