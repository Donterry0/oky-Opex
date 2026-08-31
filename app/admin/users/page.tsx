import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminUsersPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');

  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  const userBalances = await Promise.all(
    users.map(async (item) => ({
      userId: item.id,
      balance: await prisma.demoBalance.findUnique({ where: { userId: item.id } }),
    }))
  );

  return (
    <AppLayout>
      <PageHeader title="Users" description="Manage account status, KYC, and suspension states." />

      <div className="panel overflow-hidden">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr] gap-3 border-b border-slate-800 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-slate-400">
          <span>User</span>
          <span>KYC</span>
          <span>Balance</span>
          <span>Created</span>
          <span>Last Login</span>
          <span>Status</span>
        </div>
        {users.map((item) => {
          const balance = userBalances.find((entry) => entry.userId === item.id)?.balance;
          return (
            <div key={item.id} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr] gap-3 border-b border-slate-800 px-4 py-4 text-sm text-slate-200 last:border-none">
              <div>
                <div className="font-semibold text-white">{item.name ?? item.email}</div>
                <div className="text-xs text-slate-400">{item.email}</div>
              </div>
              <div>{item.kycStatus}</div>
              <div>$ {String(balance?.amount ?? 0)}</div>
              <div>{new Date(item.createdAt).toLocaleDateString()}</div>
              <div>{item.lastLogin ? new Date(item.lastLogin).toLocaleDateString() : 'Never'}</div>
              <div>{item.status}</div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
