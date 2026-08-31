import Link from 'next/link';
import { AppLayout } from '@/components/site-shell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          ['Dashboard', '/admin'],
          ['Users', '/admin/users'],
          ['KYC', '/admin/kyc'],
          ['Balance Management', '/admin/balances'],
          ['Transactions', '/admin/transactions'],
          ['Withdrawals', '/admin/withdrawals'],
          ['Assets', '/admin/assets'],
          ['Settings', '/admin/settings'],
          ['Audit Logs', '/admin/audit'],
        ].map(([label, href]) => (
          <Link key={href} href={href as string} className="btn-secondary text-xs uppercase tracking-[0.18em]">{label}</Link>
        ))}
      </div>
      {children}
    </AppLayout>
  );
}
