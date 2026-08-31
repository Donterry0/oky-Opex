import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function TransactionsPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  return (
    <AppLayout>
      <PageHeader title="Transaction history" description="Simulated buys, sells, balance adjustments, KYC events, and withdrawals." />

      <div className="panel overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.3fr] gap-3 border-b border-slate-800 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-slate-400">
          <span>Type</span>
          <span>Asset</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Description</span>
        </div>

        {transactions.map((tx) => (
          <div key={tx.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_1.3fr] gap-3 border-b border-slate-800 px-4 py-4 text-sm text-slate-200 last:border-none">
            <span>{tx.type}</span>
            <span>{tx.asset ?? 'N/A'}</span>
            <span>{tx.amount}</span>
            <span>{tx.status}</span>
            <span>{tx.description}</span>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
