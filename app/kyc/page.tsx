import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { submitKycAction } from '@/app/actions';

export default async function KycPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const latest = await prisma.kYCSubmission.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AppLayout>
      <PageHeader title="KYC" description="Submit identity information for the OKY review flow." />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <div className="label-chip mb-4">KYC STATUS: {user.kycStatus}</div>
          <form action={submitKycAction} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Full legal name</label>
              <input name="fullName" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Date of birth</label>
              <input name="dob" type="date" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Country</label>
              <input name="country" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Address</label>
              <textarea name="address" rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Identification document type</label>
              <select name="documentType" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white">
                <option value="PASSPORT">Passport</option>
                <option value="DRIVER_LICENSE">Driver License</option>
                <option value="ID_CARD">National ID</option>
              </select>
            </div>
            <button className="btn-primary w-full">Submit KYC</button>
          </form>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-semibold text-white">Latest submission</h2>
          {latest ? (
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div><span className="text-slate-400">Status:</span> {latest.status}</div>
              <div><span className="text-slate-400">Name:</span> {latest.fullName}</div>
              <div><span className="text-slate-400">Country:</span> {latest.country}</div>
              <div><span className="text-slate-400">Document:</span> {latest.documentType}</div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">No KYC submission yet.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
