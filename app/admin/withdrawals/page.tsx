import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateWithdrawalStatusAction } from '@/app/actions';

export default async function AdminWithdrawalsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');

  const withdrawals = await prisma.withdrawal.findMany({
    include: { user: true },
    orderBy: { requestedAt: 'desc' },
  });

  return (
    <AppLayout>
      <PageHeader title="Withdrawals" description="Review pending simulated withdrawal requests." />

      <div className="panel overflow-hidden">
        {withdrawals.map((item) => (
          <div key={item.id} className="border-b border-slate-800 p-4 last:border-none">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold text-white">{item.user?.name ?? item.user?.email}</div>
                <div className="text-xs text-slate-400">{item.assetSymbol} • {item.amount} • {item.destination}</div>
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-amber-200">{item.status}</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <form action={updateWithdrawalStatusAction}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="status" value="APPROVED" />
                <button className="btn-primary">Approve</button>
              </form>
              <form action={updateWithdrawalStatusAction}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="status" value="REJECTED" />
                <button className="btn-secondary">Reject</button>
              </form>
            </div>
            <div className="mt-3 text-xs uppercase tracking-[0.2em] text-amber-200">SIMULATED TRANSACTION — NO REAL FUNDS ARE TRANSFERRED.</div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
