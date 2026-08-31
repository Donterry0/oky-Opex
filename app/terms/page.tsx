import { AppLayout } from '@/components/site-shell';

export default function TermsPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl py-10">
        <div className="panel p-6">
          <div className="label-chip mb-4">TERMS</div>
          <h1 className="text-3xl font-bold text-white">Terms and conditions</h1>
          <div className="mt-6 space-y-4 text-sm text-slate-300">
            <p>OKY is a simulated trading environment for testing and educational use only.</p>
            <p>Balances, trades, withdrawals, and portfolio values displayed in OKY are not real financial assets and have no monetary value.</p>
            <p>No real cryptocurrency is transferred, and no real blockchain transaction is executed on the platform.</p>
            <p>Use of the platform is for educational, testing, and product evaluation purposes only.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
