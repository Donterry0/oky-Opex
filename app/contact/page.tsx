import Link from 'next/link';
import { AppLayout } from '@/components/site-shell';
import { getAppSettings } from '@/lib/settings';
import { submitInquiryAction } from '@/app/actions';

export default async function ContactPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const settings = await getAppSettings();

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl py-10">
        <div className="label-chip mb-4">CONTACT US</div>
        <h1 className="text-3xl font-bold text-white">Get in touch</h1>
        <p className="mt-3 text-sm text-slate-300">
          Have a question about our services? Send us a message and our team will respond as soon as possible.
        </p>

        {searchParams?.status === 'sent' ? (
          <div className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-300">
            Thanks for reaching out! We&apos;ve received your message and will get back to you shortly.
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-[1.3fr_1fr]">
          <div className="panel p-6">
            <form action={submitInquiryAction} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Full name</label>
                <input name="name" required minLength={2} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Email</label>
                <input type="email" name="email" required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Phone (optional)</label>
                <input name="phone" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Subject</label>
                <input name="subject" required minLength={2} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">Message</label>
                <textarea name="message" required minLength={10} rows={5} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white" />
              </div>
              <button type="submit" className="btn-primary">Send message</button>
            </form>
          </div>

          <div className="panel p-6 text-sm text-slate-300">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</div>
              <a href={`mailto:${settings.supportEmail}`} className="mt-2 block font-semibold text-sky-300">{settings.supportEmail}</a>
            </div>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Phone</div>
              <div className="mt-2 font-semibold text-white">{settings.supportPhone}</div>
            </div>
            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Hours</div>
              <div className="mt-2">{settings.supportHours}</div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              You can also visit our <Link href="/support" className="text-sky-300 hover:underline">support page</Link> for more resources.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
