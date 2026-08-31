import Link from 'next/link';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getAssetBySymbol, formatMoney, formatPercent } from '@/lib/market';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { buyOrSellAction } from '@/app/actions';

export default async function AssetPage({ params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase();
  const user = await getSessionUser();
  const asset = await getAssetBySymbol(symbol);
  const holding = user ? await prisma.holding.findUnique({ where: { userId_assetSymbol: { userId: user.id, assetSymbol: symbol } } }) : null;

  if (!asset) {
    return (
      <AppLayout>
        <div className="panel p-6 text-slate-200">Market data unavailable for {symbol}.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader title={`${asset.symbol} • ${asset.name}`} description="Live pricing and simulated trading details for this asset." action={<Link href="/markets" className="btn-secondary">Back to markets</Link>} />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div><div className="text-xs uppercase tracking-[0.2em] text-slate-400">Price</div><div className="mt-2 text-2xl font-bold text-white">{formatMoney(asset.current_price)}</div></div>
            <div><div className="text-xs uppercase tracking-[0.2em] text-slate-400">24h %</div><div className={`mt-2 text-2xl font-bold ${asset.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatPercent(asset.price_change_percentage_24h)}</div></div>
            <div><div className="text-xs uppercase tracking-[0.2em] text-slate-400">24h High</div><div className="mt-2 text-lg font-semibold text-white">{formatMoney(asset.high_24h)}</div></div>
            <div><div className="text-xs uppercase tracking-[0.2em] text-slate-400">24h Low</div><div className="mt-2 text-lg font-semibold text-white">{formatMoney(asset.low_24h)}</div></div>
          </div>

          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-400">Price chart</div>
            <div className="h-52 rounded-xl bg-gradient-to-b from-sky-500/10 to-slate-900 p-4">
              <div className="flex h-full items-end gap-2">
                {[36, 42, 38, 61, 55, 74, 70, 96, 82, 100, 90, 101].map((bar, index) => (
                  <div key={index} className="flex-1 rounded-t-xl bg-gradient-to-t from-sky-400 to-sky-200" style={{ height: `${bar}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="panel p-5">
          <div className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">Simulated positions</div>
          <div className="text-2xl font-bold text-white">{holding ? `${holding.quantity} ${symbol}` : '0.0000 ' + symbol}</div>
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Current live price</div>
              <div className="mt-2 font-semibold text-white">{formatMoney(asset.current_price)}</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Volume</div>
              <div className="mt-2 font-semibold text-white">{formatMoney(asset.total_volume)}</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Market cap</div>
              <div className="mt-2 font-semibold text-white">{formatMoney(asset.market_cap)}</div>
            </div>
          </div>

          {user ? (
            <form action={buyOrSellAction} className="mt-6 space-y-4">
              <input type="hidden" name="symbol" value={symbol} />
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-slate-400">Quantity</label>
                <input name="quantity" type="number" min="0.0001" step="0.0001" defaultValue="0.1" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="submit" name="side" value="BUY" className="btn-primary">Buy</button>
                <button type="submit" name="side" value="SELL" className="btn-secondary">Sell</button>
              </div>
            </form>
          ) : (
            <Link href="/login" className="mt-6 block btn-primary text-center">Login to trade</Link>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
