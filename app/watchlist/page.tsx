import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { toggleWatchlistAction } from '@/app/actions';
import { getMarketData, formatMoney, formatPercent } from '@/lib/market';

export default async function WatchlistPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const [watchlist, market] = await Promise.all([
    prisma.watchlist.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } }),
    getMarketData(),
  ]);

  return (
    <AppLayout>
      <PageHeader title="Watchlist" description="Track your favorite assets in real time." />

      <div className="panel p-5">
        <div className="mb-4 flex flex-wrap gap-3">
          {['BTC', 'ETH', 'SOL', 'XRP', 'ADA'].map((symbol) => (
            <form key={symbol} action={toggleWatchlistAction}>
              <input type="hidden" name="symbol" value={symbol} />
              <button className="btn-secondary">{watchlist.some((entry) => entry.assetSymbol === symbol) ? 'Remove' : 'Add'} {symbol}</button>
            </form>
          ))}
        </div>

        {watchlist.length === 0 ? (
          <p className="text-sm text-slate-400">No assets in your watchlist yet.</p>
        ) : (
          <div className="space-y-3">
            {watchlist.map((item) => {
              const asset = market?.find((m) => m.symbol === item.assetSymbol);
              if (!asset) return null;
              return (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3">
                  <div>
                    <div className="font-semibold text-white">{asset.symbol}</div>
                    <div className="text-xs text-slate-400">{asset.name}</div>
                  </div>
                  <div className="text-right">
                    <div>{formatMoney(asset.current_price)}</div>
                    <div className={asset.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'}>{formatPercent(asset.price_change_percentage_24h)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
