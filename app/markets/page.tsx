import { AppLayout, PageHeader, SearchField } from '@/components/site-shell';
import { getMarketData, formatMoney, formatPercent } from '@/lib/market';

export default async function MarketsPage() {
  const market = await getMarketData();

  return (
    <AppLayout>
      <PageHeader title="Markets" description="Live digital asset prices for the current market feed." />

      {!market ? (
        <div className="panel p-6 text-slate-200">Market data unavailable. The external market feed is currently unavailable.</div>
      ) : (
        <div className="space-y-5">
          <SearchField placeholder="Search assets" />

          <div className="panel overflow-hidden">
            <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-3 border-b border-slate-800 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-slate-400 md:grid">
              <span>Asset</span>
              <span>Price</span>
              <span>24h</span>
              <span>High</span>
              <span>Low</span>
              <span>Volume</span>
              <span>Mkt Cap</span>
            </div>

            {market.map((asset) => (
              <div key={asset.symbol} className="grid gap-3 border-b border-slate-800 px-4 py-4 md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_1fr_1fr] md:items-center">
                <div>
                  <div className="font-semibold text-white">{asset.symbol}</div>
                  <div className="text-xs text-slate-400">{asset.name}</div>
                </div>
                <div className="text-sm text-slate-200">{formatMoney(asset.current_price)}</div>
                <div className={asset.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-red-400'}>{formatPercent(asset.price_change_percentage_24h)}</div>
                <div className="text-sm text-slate-200">{formatMoney(asset.high_24h)}</div>
                <div className="text-sm text-slate-200">{formatMoney(asset.low_24h)}</div>
                <div className="text-sm text-slate-200">{formatMoney(asset.total_volume)}</div>
                <div className="text-sm text-slate-200">{formatMoney(asset.market_cap)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
