import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { adminBalanceAction } from '@/app/actions';

export default async function AdminBalancesPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');

  const users = await prisma.user.findMany({ include: { demoBalance: true } });

  return (
    <AppLayout>
      <PageHeader title="Balance management" description="Grant or remove simulated funds and record internal audit reasons." />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-5">
          <form action={adminBalanceAction} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">User email</label>
              <input name="email" type="email" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Amount</label>
              <input name="amount" type="number" step="0.01" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Internal reason</label>
              <textarea name="reason" rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
            </div>
            <button className="btn-primary w-full">Apply simulated balance adjustment</button>
          </form>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-semibold text-white">Current balances</h2>
          <div className="mt-4 space-y-3">
            {users.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <div className="font-medium text-white">{item.name ?? item.email}</div>
                <div className="text-xs text-slate-400">{item.email}</div>
                <div className="mt-2 text-sm text-sky-300">${Number(item.demoBalance?.amount ?? 0).toFixed(2)} SIM</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
