import { redirect } from 'next/navigation';
import { AppLayout, PageHeader, StatCard } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getMarketData, formatMoney } from '@/lib/market';

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const [balance, holdings, transactions, market] = await Promise.all([
    prisma.demoBalance.findUnique({ where: { userId: user.id } }),
    prisma.holding.findMany({ where: { userId: user.id } }),
    prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 }),
    getMarketData(),
  ]);

  const totalHoldingsValue = holdings.reduce((sum, item) => {
    const asset = market?.find((m) => m.symbol === item.assetSymbol);
    return sum + (Number(item.quantity) * (asset?.current_price ?? 0));
  }, 0);

  const totalPortfolio = (Number(balance?.amount ?? 0) + totalHoldingsValue);

  return (
    <AppLayout>
      <PageHeader title="Dashboard" description="Your trading workspace." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="SIMULATED PORTFOLIO" value={`${formatMoney(totalPortfolio)} SIM`} tone="sky" />
        <StatCard label="AVAILABLE BALANCE" value={`${formatMoney(Number(balance?.amount ?? 0))} SIM`} />
        <StatCard label="BUYING POWER" value={`${formatMoney(Number(balance?.amount ?? 0))} SIM`} />
        <StatCard label="TODAY'S SIMULATED P/L" value="$0.00 SIM" tone="green" />
        <div className="panel p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">WATCHLIST</div>
          <div className="mt-3 text-xl font-bold text-white">{(await prisma.watchlist.count({ where: { userId: user.id } }))}</div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Popular assets</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">LIVE</span>
          </div>
          <div className="space-y-3">
            {(market ?? []).slice(0, 5).map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3">
                <div>
                  <div className="font-semibold text-white">{asset.symbol}</div>
                  <div className="text-xs text-slate-400">{asset.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-white">{formatMoney(asset.current_price)}</div>
                  <div className={asset.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'}>{asset.price_change_percentage_24h.toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-lg font-semibold text-white">Recent simulated transactions</h2>
          <div className="mt-4 space-y-3">
            {transactions.length === 0 ? <p className="text-sm text-slate-400">No simulated transactions yet.</p> : transactions.map((tx) => (
              <div key={tx.id} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-white">{tx.type}</span>
                  <span className="text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-2 text-xs text-slate-400">{tx.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
