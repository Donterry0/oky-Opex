import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminKycPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');

  const submissions = await prisma.kYCSubmission.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });

  return (
    <AppLayout>
      <PageHeader title="KYC review" description="Review identity submissions and approve or reject each simulated application." />

      <div className="panel overflow-hidden">
        {submissions.map((item) => (
          <div key={item.id} className="border-b border-slate-800 p-4 last:border-none">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold text-white">{item.user.name ?? item.user.email}</div>
                <div className="text-xs text-slate-400">{item.country} • {item.documentType}</div>
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-sky-300">{item.status}</div>
            </div>
            <div className="mt-3 text-sm text-slate-300">{item.fullName} • {item.dob}</div>
            <div className="mt-3 text-sm text-slate-400">{item.address}</div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
