import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminAssetsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');

  const assets = await prisma.asset.findMany();

  return (
    <AppLayout>
      <PageHeader title="Assets" description="Manage market asset metadata for the trading simulator." />

      <div className="panel overflow-hidden">
        {assets.length === 0 ? (
          <div className="p-6 text-sm text-slate-400">No asset records yet.</div>
        ) : assets.map((asset) => (
          <div key={asset.id} className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-3 border-b border-slate-800 px-4 py-4 text-sm text-slate-200 last:border-none">
            <div>{asset.symbol}</div>
            <div>{asset.name}</div>
            <div>{asset.priceUsd ?? '—'}</div>
            <div>{asset.change24h ?? '—'}</div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
