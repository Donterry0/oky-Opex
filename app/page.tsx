import Link from 'next/link';
import { ArrowRight, ShieldCheck, BarChart3, Wallet2, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/site-shell';

export default function Page() {
  return (
    <AppLayout>
      <section className="grid gap-8 pb-12 pt-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <div className="label-chip mb-5">SIMULATED TRADING</div>
          <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl">
            OKY provides a professional simulated digital asset trading environment.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">
            Simple. Fast. Digital Asset Trading. Explore market data, test strategies, and review account workflows in a modern exchange-style simulator built for testing.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className="btn-primary">
              Create account <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link href="/markets" className="btn-secondary">View markets</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-400">
            <span>• Simulated balances only</span>
            <span>• Simulated trades only</span>
            <span>• No real cryptocurrency withdrawals</span>
          </div>
        </div>

        <div className="panel p-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>MARKET OVERVIEW</span>
              <span className="text-emerald-400">▲ +2.14%</span>
            </div>
            <div className="mt-6 space-y-4">
              {[
                ['BTC', '$64,255.14', '+1.34%'],
                ['ETH', '$3,416.21', '+2.86%'],
                ['SOL', '$163.10', '+5.41%'],
              ].map(([symbol, price, change]) => (
                <div key={symbol} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-3 py-3">
                  <div>
                    <div className="font-semibold text-white">{symbol}</div>
                    <div className="text-xs text-slate-400">{symbol === 'BTC' ? 'Bitcoin' : symbol === 'ETH' ? 'Ethereum' : 'Solana'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{price}</div>
                    <div className="text-xs text-emerald-400">{change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 py-10 md:grid-cols-3">
        {[
          { icon: BarChart3, title: 'Live pricing', text: 'Current public market data refreshes for major assets.' },
          { icon: Wallet2, title: 'Portfolio tracking', text: 'Track simulated holdings, balances, and P/L without real money.' },
          { icon: ShieldCheck, title: 'Protected workflow', text: 'Authentication, security setup, and admin controls are built for testing.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="panel p-5">
            <div className="mb-4 inline-flex rounded-xl bg-sky-500/10 p-3 text-sky-300"><Icon size={20} /></div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-slate-300">{text}</p>
          </div>
        ))}
      </section>

      <section className="panel p-6">
        <div className="mb-5 flex items-center gap-3 text-sky-300"><Sparkles size={18} /> Platform highlights</div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {['Registration and login', 'Trading dashboard metrics', 'Simulated buys and sells', 'Admin balance controls'].map((item) => (
            <div key={item} className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-200">{item}</div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
