import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getMarketData, formatMoney } from '@/lib/market';

export default async function PortfolioPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const [holdings, market] = await Promise.all([prisma.holding.findMany({ where: { userId: user.id } }), getMarketData()]);

  return (
    <AppLayout>
      <PageHeader title="SIMULATED PORTFOLIO" description="Your asset positions and portfolio valuation." />

      <div className="panel overflow-hidden">
        <div className="grid grid-cols-[1.2fr_1fr_1.1fr_1.1fr_1.1fr] gap-3 border-b border-slate-800 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-slate-400">
          <span>Asset</span>
          <span>Quantity</span>
          <span>Price</span>
          <span>Avg Cost</span>
          <span>Value</span>
        </div>

        {holdings.length === 0 ? (
          <div className="p-6 text-sm text-slate-400">No holdings yet. Explore the market and start a simulated trade.</div>
        ) : holdings.map((holding) => {
          const marketPrice = market?.find((m) => m.symbol === holding.assetSymbol)?.current_price ?? 0;
          const value = Number(holding.quantity) * marketPrice;
          return (
            <div key={holding.id} className="grid grid-cols-[1.2fr_1fr_1.1fr_1.1fr_1.1fr] gap-3 border-b border-slate-800 px-4 py-4 text-sm text-slate-200 last:border-none">
              <div>
                <div className="font-semibold text-white">{holding.assetSymbol}</div>
              </div>
              <div>{Number(holding.quantity).toFixed(4)}</div>
              <div>{formatMoney(marketPrice)}</div>
              <div>{holding.averagePrice ? formatMoney(holding.averagePrice) : '$0.00'}</div>
              <div>{formatMoney(value)}</div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
