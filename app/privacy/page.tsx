import { AppLayout } from '@/components/site-shell';

export default function PrivacyPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl py-10">
        <div className="panel p-6">
          <div className="label-chip mb-4">PRIVACY</div>
          <h1 className="text-3xl font-bold text-white">Privacy notice</h1>
          <div className="mt-6 space-y-4 text-sm text-slate-300">
            <p>OKY is a testing environment and does not provide regulated financial services.</p>
            <p>We store the minimum information required to support account security, KYC review, and trading interface testing.</p>
            <p>Uploaded documents and identity information are protected and not intended for public disclosure.</p>
            <p>Account balances and trades are simulated and have no real-world value.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
