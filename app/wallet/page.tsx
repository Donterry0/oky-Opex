import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/market';

export default async function WalletPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const [balance, transactions, holdings] = await Promise.all([
    prisma.demoBalance.findUnique({ where: { userId: user.id } }),
    prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.holding.findMany({ where: { userId: user.id } }),
  ]);

  return (
    <AppLayout>
      <PageHeader
        title="Wallet"
        description="Simulated cash balance, crypto holdings, and transaction history."
        action={
          <div className="flex gap-3">
            <Link href="/deposit" className="btn-primary">Deposit from wallet</Link>
            <Link href="/withdraw" className="btn-secondary">Withdraw</Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">SIMULATED CASH BALANCE</div>
          <div className="mt-4 text-3xl font-bold text-white">{formatMoney(Number(balance?.amount ?? 0))} SIM</div>
        </div>

        <div className="panel p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">SIMULATED CRYPTO HOLDINGS</div>
          <div className="mt-4 text-3xl font-bold text-white">{holdings.length}</div>
        </div>
      </div>

      <div className="mt-8 panel p-5">
        <h2 className="text-lg font-semibold text-white">Transaction history</h2>
        <div className="mt-4 space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3 text-sm">
              <div>
                <div className="font-medium text-white">{tx.type}</div>
                <div className="text-xs text-slate-400">{tx.description}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-white">{tx.asset}</div>
                <div className="text-xs text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
