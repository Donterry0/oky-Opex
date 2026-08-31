import Link from 'next/link';
import { BarChart3, Briefcase, Wallet, House, Search, Shield } from 'lucide-react';
import { getSessionUser } from '@/lib/auth';
import { logoutAction } from '@/app/actions';

export function SystemNotice() {
  return (
    <div className="demo-banner">SIMULATED ENVIRONMENT — Balances, trades and withdrawals are test-only and have no real monetary value.</div>
  );
}

export async function Header() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/90 bg-slate-950/80 backdrop-blur">
      <SystemNotice />
      <div className="container-shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-400/50 bg-sky-500/10 text-sm font-black text-sky-300">O</div>
          <div>
            <div className="text-lg font-black tracking-tight text-white">OKY</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Exchange Simulator</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/markets" className="transition hover:text-white">Markets</Link>
          <Link href="/dashboard" className="transition hover:text-white">Dashboard</Link>
          <Link href="/portfolio" className="transition hover:text-white">Portfolio</Link>
          <Link href="/about" className="transition hover:text-white">About</Link>
          <Link href="/contact" className="transition hover:text-white">Contact</Link>
          <Link href="/support" className="transition hover:text-white">Support</Link>
          {user?.role === 'ADMIN' ? <Link href="/admin" className="transition hover:text-white">Admin</Link> : null}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-secondary">Account</Link>
              {user.role === 'ADMIN' ? <Link href="/admin" className="btn-secondary">Admin</Link> : null}
              <form action={logoutAction}>
                <button className="btn-primary">Logout</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">Login</Link>
              <Link href="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function MobileNav({ active }: { active?: string }) {
  const items = [
    { href: '/dashboard', label: 'Home', icon: House },
    { href: '/markets', label: 'Markets', icon: BarChart3 },
    { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { href: '/wallet', label: 'Wallet', icon: Wallet },
    { href: '/security', label: 'Security', icon: Shield },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-950/95 md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-2 px-2 py-2">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center rounded-xl px-2 py-2 text-[10px] ${active === href ? 'bg-sky-500/10 text-sky-300' : 'text-slate-400'}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">{title}</h1>
        {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'green' | 'red' | 'sky' }) {
  const toneClasses = {
    default: 'border-slate-800 bg-slate-900/80',
    green: 'border-emerald-500/40 bg-emerald-500/10',
    red: 'border-red-500/40 bg-red-500/10',
    sky: 'border-sky-500/40 bg-sky-500/10',
  };

  return (
    <div className={`panel p-4 ${toneClasses[tone]}`}>
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-3 text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

export function AssetRow({ symbol, name, price, change }: { symbol: string; name: string; price: string; change: string }) {
  return (
    <div className="grid grid-cols-[1.2fr_1fr_1fr] items-center gap-3 rounded-xl border border-slate-800 px-3 py-3 text-sm text-slate-200">
      <div>
        <div className="font-semibold text-white">{symbol}</div>
        <div className="text-xs text-slate-400">{name}</div>
      </div>
      <div>{price}</div>
      <div className={Number(change.replace('%','').replace('+','')) >= 0 ? 'text-emerald-400' : 'text-red-400'}>{change}</div>
    </div>
  );
}

export function SearchField({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">
      <Search size={16} className="text-slate-500" />
      <input aria-label="Search" placeholder={placeholder} className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none" />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90">
      <div className="container-shell flex flex-col gap-4 py-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <div>© 2026 OKY • Simulated trading environment</div>
        <div className="flex items-center gap-4">
          <Link href="/about" className="transition hover:text-white">About</Link>
          <Link href="/contact" className="transition hover:text-white">Contact</Link>
          <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
          <Link href="/terms" className="transition hover:text-white">Terms</Link>
          <Link href="/support" className="transition hover:text-white">Support</Link>
        </div>
      </div>
    </footer>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <div className="container-shell pb-24 pt-8 md:pb-12">{children}</div>
      <Footer />
      <MobileNav />
    </div>
  );
}
