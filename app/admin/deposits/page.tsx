import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateDepositStatusAction } from '@/app/actions';

export default async function AdminDepositsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');

  const deposits = await prisma.deposit.findMany({
    include: { user: true },
    orderBy: { requestedAt: 'desc' },
  });

  return (
    <AppLayout>
      <PageHeader title="Deposits" description="Review crypto wallet deposit requests. Approving credits the user's balance." />

      <div className="panel overflow-hidden">
        {deposits.length === 0 ? (
          <div className="p-6 text-sm text-slate-400">No deposit requests have been submitted yet.</div>
        ) : (
          deposits.map((item) => (
            <div key={item.id} className="border-b border-slate-800 p-4 last:border-none">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-white">{item.user?.name ?? item.user?.email}</div>
                  <div className="text-xs text-slate-400">
                    {item.assetSymbol} • {item.amount} • from {item.walletAddress}
                    {item.txReference ? ` • tx: ${item.txReference}` : ''}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{new Date(item.requestedAt).toLocaleString()}</div>
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-amber-200">{item.status}</div>
              </div>
              {item.status === 'PENDING' ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  <form action={updateDepositStatusAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="status" value="APPROVED" />
                    <button className="btn-primary">Approve &amp; credit balance</button>
                  </form>
                  <form action={updateDepositStatusAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="status" value="REJECTED" />
                    <button className="btn-secondary">Reject</button>
                  </form>
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}
