import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { submitSecurityAction } from '@/app/actions';

export default async function SecurityPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  return (
    <AppLayout>
      <PageHeader title="Security" description="Manage account security, withdrawal PIN, and session settings." />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-lg font-semibold text-white">Change password</h2>
          <form action={submitSecurityAction} className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Current password</label>
              <input name="currentPassword" type="password" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">New password</label>
              <input name="newPassword" type="password" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
            </div>
            <button className="btn-primary w-full">Update password</button>
          </form>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-semibold text-white">Withdrawal PIN</h2>
          <form action={submitSecurityAction} className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Set or change withdrawal PIN</label>
              <input name="withdrawalPin" type="password" inputMode="numeric" maxLength={6} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
            </div>
            <button className="btn-primary w-full">Save PIN</button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
