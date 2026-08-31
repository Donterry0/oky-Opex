import Link from 'next/link';
import { AppLayout } from '@/components/site-shell';

export default function ForgotPasswordPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-md pt-8">
        <div className="panel p-6">
          <div className="label-chip mb-4">PASSWORD RECOVERY</div>
          <h1 className="text-2xl font-bold text-white">Reset your password</h1>
          <p className="mt-2 text-sm text-slate-400">This is a guided recovery flow for OKY accounts in the simulator.</p>

          <form className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Email</label>
              <input type="email" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-sky-500 focus:outline-none" />
            </div>
            <button type="button" className="btn-primary w-full">Send reset link</button>
          </form>

          <div className="mt-6 text-sm text-slate-400">
            Back to <Link href="/login" className="text-sky-300">login</Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
