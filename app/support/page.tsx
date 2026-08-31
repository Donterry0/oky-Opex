import { AppLayout } from '@/components/site-shell';
import { getAppSettings } from '@/lib/settings';

export default async function SupportPage() {
  const settings = await getAppSettings();

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl py-10">
        <div className="panel p-6">
          <div className="label-chip mb-4">SUPPORT</div>
          <h1 className="text-3xl font-bold text-white">Customer support</h1>
          <div className="mt-6 space-y-4 text-sm text-slate-300">
            <p>Use the simulator to test account registration, market dashboards, KYC flows, withdrawal review, and admin controls.</p>
            <p>For technical inquiries, contact the support team with your environment details and test case context.</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</div>
              <a href={`mailto:${settings.supportEmail}`} className="mt-2 block text-lg font-semibold text-sky-300">{settings.supportEmail}</a>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Phone</div>
              <div className="mt-2 text-lg font-semibold text-white">{settings.supportPhone}</div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Support hours</div>
            <div className="mt-2">{settings.supportHours}</div>
            <div className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">Address</div>
            <div className="mt-2">{settings.supportAddress}</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
