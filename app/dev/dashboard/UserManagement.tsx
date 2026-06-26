'use client';

import { useCallback, useEffect, useReducer, useState } from 'react';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  isActive: boolean;
  blacklisted: boolean;
  failedLoginAttempts: number;
  lockedUntil: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

type State = {
  users: AdminUser[];
  loading: boolean;
  actionLoading: string | null;
  showCreate: boolean;
  createForm: { name: string; email: string; password: string; role: 'admin' | 'editor' };
  createError: string;
  createLoading: boolean;
  tempPassword: string | null;
  deleteConfirm: string | null;
};

type Action =
  | { type: 'SET_USERS'; users: AdminUser[] }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ACTION_LOADING'; id: string | null }
  | { type: 'UPDATE_USER'; user: AdminUser }
  | { type: 'REMOVE_USER'; id: string }
  | { type: 'TOGGLE_CREATE' }
  | { type: 'SET_CREATE_FIELD'; field: keyof State['createForm']; value: string }
  | { type: 'SET_CREATE_ERROR'; error: string }
  | { type: 'SET_CREATE_LOADING'; loading: boolean }
  | { type: 'ADD_USER'; user: AdminUser }
  | { type: 'SET_TEMP_PW'; pw: string | null }
  | { type: 'SET_DELETE_CONFIRM'; id: string | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USERS': return { ...state, users: action.users, loading: false };
    case 'SET_LOADING': return { ...state, loading: action.loading };
    case 'SET_ACTION_LOADING': return { ...state, actionLoading: action.id };
    case 'UPDATE_USER': return { ...state, users: state.users.map(u => u._id === action.user._id ? action.user : u), actionLoading: null };
    case 'REMOVE_USER': return { ...state, users: state.users.filter(u => u._id !== action.id), actionLoading: null, deleteConfirm: null };
    case 'TOGGLE_CREATE': return { ...state, showCreate: !state.showCreate, createError: '', createForm: { name: '', email: '', password: '', role: 'admin' } };
    case 'SET_CREATE_FIELD': return { ...state, createForm: { ...state.createForm, [action.field]: action.value } };
    case 'SET_CREATE_ERROR': return { ...state, createError: action.error, createLoading: false };
    case 'SET_CREATE_LOADING': return { ...state, createLoading: action.loading };
    case 'ADD_USER': return { ...state, users: [action.user, ...state.users], showCreate: false, createLoading: false };
    case 'SET_TEMP_PW': return { ...state, tempPassword: action.pw, actionLoading: null };
    case 'SET_DELETE_CONFIRM': return { ...state, deleteConfirm: action.id };
    default: return state;
  }
}

const initialState: State = {
  users: [], loading: true, actionLoading: null,
  showCreate: false,
  createForm: { name: '', email: '', password: '', role: 'admin' },
  createError: '', createLoading: false,
  tempPassword: null, deleteConfirm: null,
};

function userStatus(u: AdminUser): { label: string; cls: string } {
  if (u.blacklisted) return { label: 'Blacklisted', cls: 'bg-red-50 text-red-700 border-red-200' };
  if (!u.isActive) return { label: 'Disabled', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
  if (u.lockedUntil && new Date(u.lockedUntil) > new Date()) return { label: 'Locked', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
  return { label: 'Active', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const inputCls = 'w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition';

export default function UserManagement() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [fetchError, setFetchError] = useState('');

  const fetchUsers = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      dispatch({ type: 'SET_USERS', users: data.users });
    } catch (e) {
      setFetchError((e as Error).message);
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const patch = useCallback(async (id: string, body: object) => {
    dispatch({ type: 'SET_ACTION_LOADING', id });
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) dispatch({ type: 'UPDATE_USER', user: data.user });
    else dispatch({ type: 'SET_ACTION_LOADING', id: null });
  }, []);

  const resetPassword = useCallback(async (id: string) => {
    dispatch({ type: 'SET_ACTION_LOADING', id });
    const res = await fetch(`/api/admin/users/${id}/reset-password`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) dispatch({ type: 'SET_TEMP_PW', pw: data.tempPassword });
    else dispatch({ type: 'SET_ACTION_LOADING', id: null });
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    dispatch({ type: 'SET_ACTION_LOADING', id });
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) dispatch({ type: 'REMOVE_USER', id });
    else dispatch({ type: 'SET_ACTION_LOADING', id: null });
  }, []);

  const handleCreate = useCallback(async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_CREATE_ERROR', error: '' });
    dispatch({ type: 'SET_CREATE_LOADING', loading: true });
    const { name, email, password, role } = state.createForm;
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (res.ok) dispatch({ type: 'ADD_USER', user: data.user });
    else dispatch({ type: 'SET_CREATE_ERROR', error: data.error ?? 'Failed to create user' });
  }, [state.createForm]);

  const isLocked = (u: AdminUser) => !!u.lockedUntil && new Date(u.lockedUntil) > new Date();

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Admin Users</h2>
          <p className="text-gray-400 text-sm">{state.users.length} user{state.users.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_CREATE' })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New User
        </button>
      </div>

      {/* Create form */}
      {state.showCreate && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Create admin user</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full name</label>
              <input
                value={state.createForm.name}
                onChange={e => dispatch({ type: 'SET_CREATE_FIELD', field: 'name', value: e.target.value })}
                placeholder="Dr. Jane Doe"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={state.createForm.email}
                onChange={e => dispatch({ type: 'SET_CREATE_FIELD', field: 'email', value: e.target.value })}
                placeholder="jane@hospital.com"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                value={state.createForm.password}
                onChange={e => dispatch({ type: 'SET_CREATE_FIELD', field: 'password', value: e.target.value })}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
              <select
                value={state.createForm.role}
                onChange={e => dispatch({ type: 'SET_CREATE_FIELD', field: 'role', value: e.target.value })}
                className={inputCls}
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
            </div>

            {state.createError && (
              <p className="sm:col-span-2 text-red-600 text-xs">{state.createError}</p>
            )}

            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => dispatch({ type: 'TOGGLE_CREATE' })}
                className="px-4 py-2 rounded-lg text-gray-500 hover:text-gray-800 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={state.createLoading}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                {state.createLoading ? 'Creating…' : 'Create user'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {state.loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Loading…</div>
      ) : fetchError ? (
        <div className="text-red-500 text-sm text-center py-8">{fetchError}</div>
      ) : state.users.length === 0 ? (
        <div className="text-gray-400 text-sm text-center py-12">No admin users yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {['Name', 'Role', 'Status', 'Last login', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {state.users.map(user => {
                const status = userStatus(user);
                const busy = state.actionLoading === user._id;
                const locked = isLocked(user);

                return (
                  <tr key={user._id} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-gray-400 text-xs">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                        user.role === 'admin'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${status.cls}`}>
                        {status.label}
                      </span>
                      {locked && (
                        <p className="text-yellow-600 text-xs mt-0.5">
                          until {fmtDate(user.lockedUntil)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{fmtDate(user.lastLoginAt)}</td>
                    <td className="px-4 py-3 text-gray-500">{fmtDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {!user.blacklisted && (
                          <ActionBtn
                            onClick={() => patch(user._id, { isActive: !user.isActive })}
                            disabled={busy}
                            variant={user.isActive ? 'warn' : 'success'}
                            label={user.isActive ? 'Disable' : 'Enable'}
                          />
                        )}

                        {locked && (
                          <ActionBtn
                            onClick={() => patch(user._id, { unlock: true })}
                            disabled={busy}
                            variant="neutral"
                            label="Unlock"
                          />
                        )}

                        <ActionBtn
                          onClick={() => patch(user._id, { blacklisted: !user.blacklisted })}
                          disabled={busy}
                          variant={user.blacklisted ? 'success' : 'danger'}
                          label={user.blacklisted ? 'Unblacklist' : 'Blacklist'}
                        />

                        <ActionBtn
                          onClick={() => resetPassword(user._id)}
                          disabled={busy}
                          variant="neutral"
                          label="Reset PW"
                        />

                        {state.deleteConfirm === user._id ? (
                          <>
                            <ActionBtn
                              onClick={() => deleteUser(user._id)}
                              disabled={busy}
                              variant="danger"
                              label="Confirm"
                            />
                            <ActionBtn
                              onClick={() => dispatch({ type: 'SET_DELETE_CONFIRM', id: null })}
                              disabled={busy}
                              variant="neutral"
                              label="Cancel"
                            />
                          </>
                        ) : (
                          <ActionBtn
                            onClick={() => dispatch({ type: 'SET_DELETE_CONFIRM', id: user._id })}
                            disabled={busy}
                            variant="ghost-danger"
                            label="Delete"
                          />
                        )}

                        {busy && (
                          <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {state.tempPassword && (
        <Modal title="Password Reset" onClose={() => dispatch({ type: 'SET_TEMP_PW', pw: null })}>
          <p className="text-gray-500 text-sm mb-4">
            Share this temporary password with the user. It will not be shown again.
          </p>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <code className="text-emerald-600 font-mono text-sm flex-1 break-all">{state.tempPassword}</code>
            <button
              onClick={() => navigator.clipboard.writeText(state.tempPassword!)}
              className="text-gray-400 hover:text-gray-700 transition-colors shrink-0"
              title="Copy"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

type BtnVariant = 'success' | 'warn' | 'danger' | 'ghost-danger' | 'neutral';

function ActionBtn({ onClick, disabled, variant, label }: {
  onClick: () => void;
  disabled: boolean;
  variant: BtnVariant;
  label: string;
}) {
  const cls: Record<BtnVariant, string> = {
    success: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
    warn: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200',
    'ghost-danger': 'bg-transparent hover:bg-red-50 text-gray-400 hover:text-red-600 border-transparent',
    neutral: 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-200',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${cls[variant]}`}
    >
      {label}
    </button>
  );
}

function Modal({ title, children, onClose }: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
