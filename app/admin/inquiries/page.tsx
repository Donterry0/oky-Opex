import { redirect } from 'next/navigation';
import { AppLayout, PageHeader } from '@/components/site-shell';
import { getSessionUser } from '@/lib/auth';
import { listInquiries } from '@/lib/inquiries';
import { updateInquiryStatusAction, deleteInquiryAction } from '@/app/actions';

export default async function AdminInquiriesPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');

  const inquiries = await listInquiries();

  return (
    <AppLayout>
      <PageHeader title="Inquiries" description="Review and manage leads submitted through the contact form." />

      <div className="panel overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-6 text-sm text-slate-400">No inquiries have been submitted yet.</div>
        ) : (
          inquiries.map((inquiry) => (
            <div key={inquiry.id} className="border-b border-slate-800 p-4 text-sm text-slate-200 last:border-none">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{inquiry.subject}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    {inquiry.name} &lt;{inquiry.email}&gt;{inquiry.phone ? ` • ${inquiry.phone}` : ''}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{new Date(inquiry.createdAt).toLocaleString()}</div>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                  {inquiry.status}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-slate-300">{inquiry.message}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <form action={updateInquiryStatusAction} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={inquiry.id} />
                  <select name="status" defaultValue={inquiry.status} className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-white">
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                  <button type="submit" className="btn-secondary px-3 py-1.5 text-xs">Update</button>
                </form>
                <form action={deleteInquiryAction}>
                  <input type="hidden" name="id" value={inquiry.id} />
                  <button type="submit" className="btn-secondary px-3 py-1.5 text-xs text-red-300">Delete</button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}
