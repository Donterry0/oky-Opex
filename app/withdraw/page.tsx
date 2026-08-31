import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { submitWithdrawalAction } from '@/app/actions';

export default async function WithdrawPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  return (
    <AppLayout>
      <PageHeader title="Simulated Withdrawal" description="Submit a withdrawal request for administrator review." />

      <div className="mx-auto max-w-xl panel p-6">
        <div className="label-chip mb-4">SIMULATED WITHDRAWAL</div>
        <p className="mb-5 text-sm text-slate-300">Your simulated withdrawal request has been submitted and is awaiting administrator review.</p>

        <form action={submitWithdrawalAction} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Asset</label>
            <select name="asset" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white">
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="SOL">SOL</option>
              <option value="USDT">USDT</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Amount</label>
            <input name="amount" type="number" step="0.01" min="0.01" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Destination address/details</label>
            <textarea name="destination" rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Withdrawal PIN</label>
            <input name="pin" type="password" inputMode="numeric" maxLength={6} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs uppercase tracking-[0.2em] text-amber-200">
            SIMULATED TRANSACTION — NO REAL FUNDS ARE TRANSFERRED.
          </div>
          <button className="btn-primary w-full">Submit withdrawal request</button>
        </form>
      </div>
    </AppLayout>
  );
}
