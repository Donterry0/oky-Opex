import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppLayout } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { registerAction } from '@/app/actions';

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) redirect('/dashboard');

  return (
    <AppLayout>
      <div className="mx-auto max-w-md pt-8">
        <div className="panel p-6">
          <div className="label-chip mb-4">CREATE ACCOUNT</div>
          <h1 className="text-2xl font-bold text-white">Create your OKY account</h1>
          <p className="mt-2 text-sm text-slate-400">This environment is built for testing trading workflows in a simulated setting.</p>

          <form action={registerAction} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Full name</label>
              <input name="name" required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-sky-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Email</label>
              <input name="email" type="email" required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-sky-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Password</label>
              <input name="password" type="password" minLength={8} required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-sky-500 focus:outline-none" />
            </div>
            <button className="btn-primary w-full">Create account</button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account? <Link href="/login" className="text-sky-300">Login</Link>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
