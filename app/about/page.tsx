import { ShieldCheck, BarChart3, Users } from 'lucide-react';
import { AppLayout } from '@/components/site-shell';

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl py-10">
        <div className="label-chip mb-4">ABOUT US</div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">About OKY</h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-300">
          OKY is a simulated digital asset brokerage built to help teams explore modern trading workflows in a safe,
          test-only environment. We provide realistic market data, portfolio tooling, and administrative controls
          without exposing anyone to real financial risk.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { icon: BarChart3, title: 'Our mission', text: 'Give teams a realistic sandbox to design, test, and demo brokerage products before going live.' },
            { icon: ShieldCheck, title: 'Our approach', text: 'Security-first design with authentication, KYC workflows, and audited administrative actions built in from day one.' },
            { icon: Users, title: 'Our team', text: 'A small group of engineers and product designers passionate about fintech tooling and developer experience.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="panel p-5">
              <div className="mb-4 inline-flex rounded-xl bg-sky-500/10 p-3 text-sky-300"><Icon size={20} /></div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-300">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 panel p-6">
          <h2 className="text-xl font-semibold text-white">What we offer</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>• Simulated brokerage account registration and secure login</li>
            <li>• Live-style market data across major digital assets</li>
            <li>• Portfolio, watchlist, and transaction tracking</li>
            <li>• KYC and withdrawal review workflows</li>
            <li>• A full admin panel for managing users, balances, and platform settings</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
