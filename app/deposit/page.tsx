import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { submitDepositAction } from '@/app/actions';

export default async function DepositPage({
  searchParams,
}: {
  searchParams: { status?: string; error?: string };
}) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  return (
    <AppLayout>
      <PageHeader title="Deposit from crypto wallet" description="Submit a crypto wallet deposit for administrator review. Approved deposits are credited to your balance." />

      <div className="mx-auto max-w-xl panel p-6">
        <div className="label-chip mb-4">CRYPTO WALLET DEPOSIT</div>

        {searchParams?.status === 'submitted' ? (
          <div className="mb-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-300">
            Your deposit request has been submitted and is awaiting administrator review. Your balance will be credited once approved.
          </div>
        ) : null}
        {searchParams?.error ? (
          <div className="mb-5 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
            {searchParams.error === 'invalid-deposit'
              ? 'Please provide a valid asset, amount, and wallet address.'
              : 'Something went wrong. Please try again.'}
          </div>
        ) : null}

        <p className="mb-5 text-sm text-slate-300">
          Send funds from your own crypto wallet, then submit the details below so an administrator can verify and credit your account.
        </p>

        <form action={submitDepositAction} className="space-y-4">
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
            <input name="amount" type="number" step="0.01" min="0.01" required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Your wallet address</label>
            <input name="walletAddress" required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Transaction hash / reference (optional)</label>
            <input name="txReference" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs uppercase tracking-[0.2em] text-amber-200">
            DEPOSITS ARE REVIEWED BY AN ADMINISTRATOR BEFORE YOUR BALANCE IS CREDITED.
          </div>
          <button className="btn-primary w-full">Submit deposit request</button>
        </form>
      </div>
    </AppLayout>
  );
}
