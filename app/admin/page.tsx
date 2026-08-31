import { redirect } from 'next/navigation';
import { AppLayout, PageHeader, StatCard } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');

  const [users, pendingKyc, pendingWithdrawals, balances, volume] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { kycStatus: 'PENDING' } }),
    prisma.withdrawal.count({ where: { status: 'PENDING' } }),
    prisma.demoBalance.aggregate({ _sum: { amount: true } }),
    prisma.simulatedTrade.aggregate({ _sum: { total: true } }),
  ]);

  return (
    <AppLayout>
      <PageHeader title="Admin dashboard" description="Operational overview for OKY administrators." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="TOTAL USERS" value={String(users)} tone="sky" />
        <StatCard label="ACTIVE USERS" value={String(users)} />
        <StatCard label="PENDING KYC" value={String(pendingKyc)} />
        <StatCard label="PENDING WITHDRAWALS" value={String(pendingWithdrawals)} />
        <StatCard label="TOTAL SIMULATED BALANCES" value={`$${Number(balances._sum.amount ?? 0).toFixed(2)}`} />
        <StatCard label="SIMULATED VOLUME" value={`$${Number(volume._sum.total ?? 0).toFixed(2)}`} />
      </div>
    </AppLayout>
  );
}
