import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminTransactionsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');

  const transactions = await prisma.transaction.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' }, take: 50 });

  return (
    <AppLayout>
      <PageHeader title="Transactions" description="View simulated trades, withdrawals, and balance adjustments across the platform." />

      <div className="panel overflow-hidden">
        <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr_2fr] gap-3 border-b border-slate-800 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-slate-400">
          <span>User</span>
          <span>Type</span>
          <span>Asset</span>
          <span>Status</span>
          <span>Description</span>
        </div>
        {transactions.map((tx) => (
          <div key={tx.id} className="grid grid-cols-[1.1fr_1fr_1fr_1fr_2fr] gap-3 border-b border-slate-800 px-4 py-4 text-sm text-slate-200 last:border-none">
            <span>{tx.user.name ?? tx.user.email}</span>
            <span>{tx.type}</span>
            <span>{tx.asset ?? 'N/A'}</span>
            <span>{tx.status}</span>
            <span>{tx.description}</span>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
