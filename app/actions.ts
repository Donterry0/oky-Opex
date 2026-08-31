'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import {
  clearSessionCookie,
  getSessionUser,
  hashPassword,
  hashWithdrawalPin,
  setSessionCookie,
  verifyPassword,
  verifyWithdrawalPin,
} from '@/lib/auth';
import { getAssetBySymbol } from '@/lib/market';
import { findUserByEmail, createUser, recordUserLogin } from '@/lib/demo-db';
import { createInquiry, updateInquiryStatus, deleteInquiry } from '@/lib/inquiries';

const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const tradeSchema = z.object({
  symbol: z.string().min(2),
  side: z.enum(['BUY', 'SELL']),
  quantity: z.coerce.number().positive(),
});

export async function registerAction(formData: FormData) {
  const payload = registerSchema.parse({
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  });

  // Try Prisma first, fall back to demo database
  try {
    const existing = await prisma.user.findUnique({ where: { email: payload.email.toLowerCase() } });
    if (existing) {
      redirect('/register?error=account-exists');
    }

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email.toLowerCase(),
        passwordHash: await hashPassword(payload.password),
        role: 'USER',
        demoBalance: { create: { amount: 10000, currency: 'USD' } },
        transactions: {
          create: [{
            type: 'DEMO_BALANCE',
            asset: 'USD',
            amount: 10000,
            status: 'COMPLETED',
            description: 'Initial DEMO balance credited to the new account.',
          }],
        },
      },
    });

    const token = crypto.randomUUID();
    await setSessionCookie(user.id, token);
    revalidatePath('/dashboard');
    redirect('/dashboard');
  } catch {
    // Prisma failed, use demo database
    console.warn('Prisma failed, using demo database for registration');
    
    const existing = await findUserByEmail(payload.email);
    if (existing) {
      redirect('/register?error=account-exists');
    }

    const user = await createUser({
      email: payload.email,
      name: payload.name,
      passwordHash: await hashPassword(payload.password),
      role: 'USER',
    });

    const token = crypto.randomUUID();
    await setSessionCookie(user.id, token);
    revalidatePath('/dashboard');
    redirect('/dashboard');
  }
}

export async function loginAction(formData: FormData) {
  const payload = loginSchema.parse({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  });

  try {
    // Try Prisma first
    const user = await prisma.user.findUnique({ where: { email: payload.email.toLowerCase() } });
    if (!user || !(await verifyPassword(payload.password, user.passwordHash))) {
      redirect('/login?error=invalid-credentials');
    }

    const token = crypto.randomUUID();
    await setSessionCookie(user.id, token);
    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
    redirect('/dashboard');
  } catch {
    // Prisma failed, use demo database
    console.warn('Prisma failed, using demo database for login');
    
    const user = await findUserByEmail(payload.email);
    if (!user || !(await verifyPassword(payload.password, user.passwordHash))) {
      redirect('/login?error=invalid-credentials');
    }

    const token = crypto.randomUUID();
    await setSessionCookie(user.id, token);
    await recordUserLogin(user.id);
    redirect('/dashboard');
  }
}

export async function logoutAction() {
  const current = await getSessionUser();
  if (current) {
    try {
      await prisma.session.deleteMany({ where: { userId: current.id } });
    } catch {
      // Prisma failed, demo database cleanup happens in clearSessionCookie
      console.warn('Prisma failed, using demo database for logout');
    }
  }
  await clearSessionCookie();
  redirect('/login');
}

export async function buyOrSellAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const payload = tradeSchema.parse({
    symbol: String(formData.get('symbol') ?? ''),
    side: String(formData.get('side') ?? '').toUpperCase(),
    quantity: Number(formData.get('quantity') ?? 0),
  });

  const market = await getAssetBySymbol(payload.symbol);
  if (!market) redirect('/markets?error=market-data-unavailable');

  const total = payload.quantity * market.current_price;
  const balance = await prisma.demoBalance.findUnique({ where: { userId: user.id } });
  const holding = await prisma.holding.findUnique({
    where: { userId_assetSymbol: { userId: user.id, assetSymbol: payload.symbol.toUpperCase() } },
  });

  if (payload.side === 'BUY' && Number(balance?.amount ?? 0) < total) {
    redirect('/asset/' + payload.symbol + '?error=insufficient-demo-balance');
  }

  if (payload.side === 'SELL' && Number(holding?.quantity ?? 0) < payload.quantity) {
    redirect('/asset/' + payload.symbol + '?error=insufficient-holdings');
  }

  await prisma.$transaction(async (tx) => {
    if (payload.side === 'BUY') {
      await tx.demoBalance.update({
        where: { userId: user.id },
        data: { amount: { decrement: total } },
      });

      if (holding) {
        const newQty = Number(holding.quantity) + payload.quantity;
        const previousValue = Number(holding.averagePrice ?? market.current_price) * Number(holding.quantity);
        const newAverage = (previousValue + total) / newQty;
        await tx.holding.update({
          where: { id: holding.id },
          data: { quantity: newQty, averagePrice: newAverage },
        });
      } else {
        await tx.holding.create({
          data: {
            userId: user.id,
            assetSymbol: payload.symbol.toUpperCase(),
            quantity: payload.quantity,
            averagePrice: market.current_price,
          },
        });
      }
    } else {
      const nextQuantity = Number(holding?.quantity ?? 0) - payload.quantity;
      if (holding) {
        if (nextQuantity <= 0) {
          await tx.holding.delete({ where: { id: holding.id } });
        } else {
          await tx.holding.update({
            where: { id: holding.id },
            data: { quantity: nextQuantity },
          });
        }
      }
      await tx.demoBalance.update({
        where: { userId: user.id },
        data: { amount: { increment: total } },
      });
    }

    await tx.simulatedTrade.create({
      data: {
        userId: user.id,
        assetSymbol: payload.symbol.toUpperCase(),
        side: payload.side,
        quantity: payload.quantity,
        price: market.current_price,
        total,
        status: 'SIMULATED',
      },
    });

    await tx.transaction.create({
      data: {
        userId: user.id,
        type: payload.side,
        asset: payload.symbol.toUpperCase(),
        amount: total,
        status: 'SIMULATED TRADE',
        description: `${payload.side} ${payload.quantity} ${payload.symbol.toUpperCase()} at ${market.current_price.toFixed(2)} USD.`,
      },
    });
  });

  revalidatePath('/dashboard');
  revalidatePath('/portfolio');
  revalidatePath('/transactions');
  revalidatePath('/wallet');
  redirect('/portfolio');
}

export async function toggleWatchlistAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const symbol = String(formData.get('symbol') ?? '').toUpperCase();
  const existing = await prisma.watchlist.findUnique({
    where: { userId_assetSymbol: { userId: user.id, assetSymbol: symbol } },
  });

  if (existing) {
    await prisma.watchlist.delete({ where: { id: existing.id } });
  } else {
    await prisma.watchlist.create({ data: { userId: user.id, assetSymbol: symbol } });
  }

  revalidatePath('/watchlist');
  redirect('/watchlist');
}

export async function submitKycAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const payload = {
    fullName: String(formData.get('fullName') ?? ''),
    dob: String(formData.get('dob') ?? ''),
    country: String(formData.get('country') ?? ''),
    address: String(formData.get('address') ?? ''),
    documentType: String(formData.get('documentType') ?? ''),
  };

  await prisma.kYCSubmission.create({
    data: {
      userId: user.id,
      fullName: payload.fullName,
      dob: payload.dob,
      country: payload.country,
      address: payload.address,
      documentType: payload.documentType,
      status: 'PENDING',
    },
  });

  await prisma.user.update({ where: { id: user.id }, data: { kycStatus: 'PENDING' } });
  redirect('/kyc?status=submitted');
}

export async function submitSecurityAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const currentPassword = String(formData.get('currentPassword') ?? '');
  const newPassword = String(formData.get('newPassword') ?? '');
  const withdrawalPin = String(formData.get('withdrawalPin') ?? '');

  if (newPassword) {
    const storedHash = user.passwordHash ?? '';
    if (!(await verifyPassword(currentPassword, storedHash))) {
      redirect('/security?error=invalid-password');
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hashPassword(newPassword) },
    });
  }

  if (withdrawalPin) {
    await prisma.user.update({
      where: { id: user.id },
      data: { withdrawalPinHash: await hashWithdrawalPin(withdrawalPin) },
    });
  }

  redirect('/security?status=updated');
}

export async function submitWithdrawalAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const asset = String(formData.get('asset') ?? '');
  const amount = Number(formData.get('amount') ?? 0);
  const destination = String(formData.get('destination') ?? '');
  const pin = String(formData.get('pin') ?? '');

  if (!asset || amount <= 0) {
    redirect('/withdraw?error=invalid-withdrawal-amount');
  }

  if (user.kycStatus !== 'APPROVED') {
    redirect('/withdraw?error=kyc-required');
  }

  const balance = await prisma.demoBalance.findUnique({ where: { userId: user.id } });
  if (Number(balance?.amount ?? 0) < amount) {
    redirect('/withdraw?error=insufficient-demo-balance');
  }

  const isValidPin = await verifyWithdrawalPin(pin, user.withdrawalPinHash ?? '');
  if (!isValidPin) {
    redirect('/withdraw?error=invalid-pin');
  }

  await prisma.withdrawal.create({
    data: {
      userId: user.id,
      assetSymbol: asset.toUpperCase(),
      amount,
      destination,
      status: 'PENDING',
      pinVerified: true,
    },
  });

  await prisma.transaction.create({
    data: {
      userId: user.id,
      type: 'WITHDRAWAL',
      asset: asset.toUpperCase(),
      amount,
      status: 'PENDING',
      description: 'Simulated withdrawal request submitted and awaiting administrator review.',
    },
  });

  redirect('/withdraw?status=submitted');
}

export async function adminBalanceAction(formData: FormData) {
  const currentUser = await getSessionUser();
  if (!currentUser || currentUser.role !== 'ADMIN') redirect('/dashboard');

  const email = String(formData.get('email') ?? '');
  const amount = Number(formData.get('amount') ?? 0);
  const reason = String(formData.get('reason') ?? '');

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) redirect('/admin/balances?error=user-not-found');

  await prisma.$transaction(async (tx) => {
    const balance = await tx.demoBalance.findUnique({ where: { userId: user.id } });
    const next = (Number(balance?.amount ?? 0) + amount);

    await tx.demoBalance.upsert({
      where: { userId: user.id },
      update: { amount: next },
      create: { userId: user.id, amount: next, currency: 'USD' },
    });

    await tx.balanceAdjustment.create({
      data: {
        userId: user.id,
        adminId: currentUser.id,
        amount,
        reason,
        type: amount >= 0 ? 'CREDIT' : 'DEBIT',
      },
    });

    await tx.transaction.create({
      data: {
        userId: user.id,
        type: 'DEMO_BALANCE_ADJUSTMENT',
        asset: 'USD',
        amount: Math.abs(amount),
        status: 'ADMIN_ADJUSTED',
        description: `ADMIN ${amount >= 0 ? 'added' : 'removed'} $${Math.abs(amount).toFixed(2)} DEMO for: ${reason}`,
      },
    });
  });

  revalidatePath('/admin');
  redirect('/admin/balances?status=updated');
}

export async function updateWithdrawalStatusAction(formData: FormData) {
  const currentUser = await getSessionUser();
  if (!currentUser || currentUser.role !== 'ADMIN') redirect('/dashboard');

  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');

  const withdrawal = await prisma.withdrawal.findUnique({ where: { id } });
  if (!withdrawal) redirect('/admin/withdrawals?error=withdrawal-not-found');

  await prisma.withdrawal.update({
    where: { id },
    data: {
      status: status === 'APPROVED' ? 'APPROVED' : 'REJECTED',
      reviewedBy: currentUser.id,
      reviewedAt: new Date(),
    },
  });

  redirect('/admin/withdrawals?status=updated');
}

export async function submitDepositAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const asset = String(formData.get('asset') ?? '');
  const amount = Number(formData.get('amount') ?? 0);
  const walletAddress = String(formData.get('walletAddress') ?? '');
  const txReference = String(formData.get('txReference') ?? '') || undefined;

  if (!asset || amount <= 0 || !walletAddress) {
    redirect('/deposit?error=invalid-deposit');
  }

  await prisma.deposit.create({
    data: {
      userId: user.id,
      assetSymbol: asset.toUpperCase(),
      amount,
      walletAddress,
      txReference,
      status: 'PENDING',
    },
  });

  await prisma.transaction.create({
    data: {
      userId: user.id,
      type: 'DEPOSIT',
      asset: asset.toUpperCase(),
      amount,
      status: 'PENDING',
      description: 'Crypto wallet deposit submitted and awaiting administrator review.',
    },
  });

  redirect('/deposit?status=submitted');
}

export async function updateDepositStatusAction(formData: FormData) {
  const currentUser = await getSessionUser();
  if (!currentUser || currentUser.role !== 'ADMIN') redirect('/dashboard');

  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');
  const nextStatus = status === 'APPROVED' ? 'APPROVED' : 'REJECTED';

  const deposit = await prisma.deposit.findUnique({ where: { id } });
  if (!deposit) redirect('/admin/deposits?error=deposit-not-found');
  if (deposit.status !== 'PENDING') redirect('/admin/deposits?error=deposit-already-reviewed');

  await prisma.$transaction(async (tx) => {
    await tx.deposit.update({
      where: { id },
      data: {
        status: nextStatus,
        reviewedBy: currentUser.id,
        reviewedAt: new Date(),
      },
    });

    if (nextStatus === 'APPROVED') {
      const balance = await tx.demoBalance.findUnique({ where: { userId: deposit.userId } });
      const next = Number(balance?.amount ?? 0) + deposit.amount;

      await tx.demoBalance.upsert({
        where: { userId: deposit.userId },
        update: { amount: next },
        create: { userId: deposit.userId, amount: next, currency: 'USD' },
      });

      await tx.transaction.create({
        data: {
          userId: deposit.userId,
          type: 'DEPOSIT',
          asset: deposit.assetSymbol,
          amount: deposit.amount,
          status: 'COMPLETED',
          description: `Crypto wallet deposit of ${deposit.amount} ${deposit.assetSymbol} approved and credited to balance.`,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: deposit.userId,
          actorId: currentUser.id,
          action: 'DEPOSIT_APPROVED',
          details: `Approved deposit of ${deposit.amount} ${deposit.assetSymbol} from wallet ${deposit.walletAddress}.`,
        },
      });
    } else {
      await tx.transaction.create({
        data: {
          userId: deposit.userId,
          type: 'DEPOSIT',
          asset: deposit.assetSymbol,
          amount: deposit.amount,
          status: 'REJECTED',
          description: `Crypto wallet deposit of ${deposit.amount} ${deposit.assetSymbol} was rejected.`,
        },
      });
    }
  });

  revalidatePath('/admin/deposits');
  revalidatePath('/wallet');
  redirect('/admin/deposits?status=updated');
}

export async function submitInquiryAction(formData: FormData) {
  const payload = inquirySchema.parse({
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? '') || undefined,
    subject: String(formData.get('subject') ?? ''),
    message: String(formData.get('message') ?? ''),
  });

  await createInquiry(payload);

  redirect('/contact?status=sent');
}

export async function updateInquiryStatusAction(formData: FormData) {
  const currentUser = await getSessionUser();
  if (!currentUser || currentUser.role !== 'ADMIN') redirect('/dashboard');

  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');

  await updateInquiryStatus(id, status);
  revalidatePath('/admin/inquiries');
  redirect('/admin/inquiries?status=updated');
}

export async function deleteInquiryAction(formData: FormData) {
  const currentUser = await getSessionUser();
  if (!currentUser || currentUser.role !== 'ADMIN') redirect('/dashboard');

  const id = String(formData.get('id') ?? '');

  await deleteInquiry(id);
  revalidatePath('/admin/inquiries');
  redirect('/admin/inquiries?status=deleted');
}
