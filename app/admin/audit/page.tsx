import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminAuditPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');

  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });

  return (
    <AppLayout>
      <PageHeader title="Audit logs" description="Review administrative actions and financial-state adjustments." />

      <div className="panel overflow-hidden">
        {logs.map((log) => (
          <div key={log.id} className="border-b border-slate-800 p-4 text-sm text-slate-300 last:border-none">
            <div className="font-medium text-white">{log.action}</div>
            <div className="mt-1 text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</div>
            <div className="mt-2">{log.details}</div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
