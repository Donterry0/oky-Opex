import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { getAppSettings, saveAppSettings } from '@/lib/settings';

export default async function AdminSettingsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');

  const settings = await getAppSettings();

  return (
    <AppLayout>
      <PageHeader title="Settings" description="Configure application support details and platform settings." />
      <div className="panel p-6 text-slate-300">
        <form action={async (formData: FormData) => {
          'use server';
          await saveAppSettings({
            supportEmail: String(formData.get('supportEmail') ?? ''),
            supportPhone: String(formData.get('supportPhone') ?? ''),
            supportHours: String(formData.get('supportHours') ?? ''),
            supportAddress: String(formData.get('supportAddress') ?? ''),
          });
        }} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Support email</label>
            <input name="supportEmail" defaultValue={settings.supportEmail} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Support phone</label>
            <input name="supportPhone" defaultValue={settings.supportPhone} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Support hours</label>
            <input name="supportHours" defaultValue={settings.supportHours} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Support address</label>
            <textarea name="supportAddress" rows={3} defaultValue={settings.supportAddress} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
          </div>
          <button className="btn-primary" type="submit">Save support settings</button>
        </form>
      </div>
    </AppLayout>
  );
}
