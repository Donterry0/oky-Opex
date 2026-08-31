import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppLayout } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { loginAction } from '@/app/actions';

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect('/dashboard');

  return (
    <AppLayout>
      <div className="mx-auto max-w-md pt-8">
        <div className="panel p-6">
          <div className="label-chip mb-4">SIGN IN</div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Use your OKY account to continue in the trading simulator.</p>

          <form action={loginAction} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Email</label>
              <input name="email" type="email" required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-sky-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Password</label>
              <input name="password" type="password" required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-sky-500 focus:outline-none" />
            </div>
            <button className="btn-primary w-full">Log in</button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link href="/forgot-password" className="text-sky-300">Forgot password?</Link>
            <Link href="/register" className="text-slate-300">Create account</Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
