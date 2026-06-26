import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import QueryProvider from '@/providers/QueryProvider';
import Sidebar from './_components/Sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/dev');

  return (
    <QueryProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar email={session.email} role={session.role} />
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </div>
    </QueryProvider>
  );
}
