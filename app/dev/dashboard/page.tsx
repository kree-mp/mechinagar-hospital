import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import LogoutButton from './LogoutButton';
import UserManagement from './UserManagement';

export default async function Dashboard() {
  const session = await getSession();
  if (!session) redirect('/dev');

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-sm leading-none">Mechinagar Hospital</p>
              <p className="text-gray-400 text-xs mt-0.5">Superadmin Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-gray-800 text-sm font-medium">{session.email}</p>
              <span className="text-xs text-indigo-500 font-medium">{session.role}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage admin and editor accounts for the hospital CMS.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <UserManagement />
        </div>
      </main>
    </div>
  );
}
