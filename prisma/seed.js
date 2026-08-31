/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@oky.demo';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'OKY Admin',
        passwordHash,
        role: 'ADMIN',
        kycStatus: 'APPROVED',
        demoBalance: { create: { amount: 250000, currency: 'USD' } },
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: 'ADMIN_CREATED',
        details: 'Initial admin account was created via the database seed script.',
      },
    });

    console.log(`Created admin account: ${adminEmail}`);
  } else {
    console.log('Admin account already exists, skipping.');
  }

  const demoEmail = 'demo@oky.demo';
  const existingDemo = await prisma.user.findUnique({ where: { email: demoEmail } });
  if (!existingDemo) {
    const passwordHash = await bcrypt.hash('Demo123!', 12);
    await prisma.user.create({
      data: {
        email: demoEmail,
        name: 'Demo Trader',
        passwordHash,
        role: 'USER',
        demoBalance: { create: { amount: 10000, currency: 'USD' } },
      },
    });
    console.log(`Created demo account: ${demoEmail}`);
  } else {
    console.log('Demo account already exists, skipping.');
  }

  const settings = await prisma.settings.findFirst();
  if (!settings) {
    await prisma.settings.create({ data: {} });
    console.log('Created default settings row.');
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
