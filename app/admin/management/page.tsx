'use client';

import { useState, useCallback, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { managementSchema, type ManagementInput } from '@/lib/validations/cms';
import PageHeader from '../_components/ui/PageHeader';
import Modal from '../_components/ui/Modal';
import ConfirmDialog from '../_components/ui/ConfirmDialog';
import StatusBadge from '../_components/ui/StatusBadge';
import FileUpload from '../_components/ui/FileUpload';
import { Field, inputCls, selectCls } from '../_components/ui/Field';
import type { PublishStatus } from '@/lib/db/plugins/publishable.plugin';

type ManagementRole = 'chief' | 'president' | 'vp' | 'member';

interface Member {
  _id: string;
  nameNp: string;
  post: string;
  role: ManagementRole;
  order: number;
  status: PublishStatus;
  photo: { url: string; publicId: string; format: string; bytes: number } | null;
}

const ROLE_LABELS: Record<ManagementRole, string> = {
  chief: 'शाखा प्रमुख',
  president: 'अध्यक्ष',
  vp: 'उपाध्यक्ष',
  member: 'सदस्य',
};

const ROLE_ORDER: ManagementRole[] = ['chief', 'president', 'vp', 'member'];

async function fetchMembers(): Promise<Member[]> {
  const res = await fetch('/api/cms/management');
  if (!res.ok) throw new Error('Failed to load members');
  return (await res.json()).members;
}

// ── Member form ────────────────────────────────────────────────────────────────

const MemberForm = memo(function MemberForm({
  defaultValues,
  onSubmit,
  loading,
}: {
  defaultValues?: Partial<ManagementInput>;
  onSubmit: (data: ManagementInput) => void;
  loading: boolean;
}) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<ManagementInput>({
    resolver: zodResolver(managementSchema),
    defaultValues: { role: 'member', order: 0, status: 'draft', photo: null, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name (Nepali)" required error={errors.nameNp?.message}>
          <input {...register('nameNp')} className={inputCls} placeholder="नाम" />
        </Field>
        <Field label="Post / Designation" required error={errors.post?.message}>
          <input {...register('post')} className={inputCls} placeholder="पद" />
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Role" required error={errors.role?.message}>
          <select {...register('role')} className={selectCls}>
            {ROLE_ORDER.map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <select {...register('status')} className={selectCls}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field label="Order" error={errors.order?.message}>
          <input {...register('order', { valueAsNumber: true })} type="number" className={inputCls} />
        </Field>
      </div>
      <Field label="Photo (optional)">
        <Controller
          control={control}
          name="photo"
          render={({ field }) => (
            <FileUpload
              value={field.value ?? null}
              onChange={field.onChange}
              accept="image/*"
              folder="mechinagar-management"
              label="Upload photo"
            />
          )}
        />
      </Field>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {loading && <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
          Save
        </button>
      </div>
    </form>
  );
});

// ── Role group section ─────────────────────────────────────────────────────────

const RoleGroup = memo(function RoleGroup({
  role,
  members,
  onEdit,
  onDelete,
}: {
  role: ManagementRole;
  members: Member[];
  onEdit: (m: Member) => void;
  onDelete: (m: Member) => void;
}) {
  if (members.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{ROLE_LABELS[role]}</span>
        {(role === 'chief' || role === 'president' || role === 'vp') && (
          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Singleton</span>
        )}
      </div>
      <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-50">
        {members.map((m) => (
          <div key={m._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
            {m.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.photo.url} alt="" className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                <span className="text-xs font-medium text-gray-500">{m.nameNp.charAt(0)}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{m.nameNp}</p>
              <p className="text-xs text-gray-500">{m.post}</p>
            </div>
            <StatusBadge status={m.status} />
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => onEdit(m)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
              </button>
              <button onClick={() => onDelete(m)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ManagementPage() {
  const qc = useQueryClient();
  const [memberModal, setMemberModal] = useState<{ mode: 'add' | 'edit'; data?: Member } | null>(null);
  const [deleteMember, setDeleteMember] = useState<Member | null>(null);

  const { data: members = [], isLoading, error } = useQuery({
    queryKey: ['management'],
    queryFn: fetchMembers,
  });

  const createMember = useMutation({
    mutationFn: (data: ManagementInput) =>
      fetch('/api/cms/management', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => {
        if (!r.ok) return r.json().then((d) => Promise.reject(new Error(d.error ?? 'Failed')));
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['management'] });
      setMemberModal(null);
    },
  });

  const updateMember = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ManagementInput> }) =>
      fetch(`/api/cms/management/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => {
        if (!r.ok) return r.json().then((d) => Promise.reject(new Error(d.error ?? 'Failed')));
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['management'] });
      setMemberModal(null);
    },
  });

  const removeMember = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/cms/management/${id}`, { method: 'DELETE' }).then((r) => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['management'] });
      setDeleteMember(null);
    },
  });

  const handleSubmit = useCallback(
    (data: ManagementInput) => {
      if (memberModal?.mode === 'edit' && memberModal.data) {
        updateMember.mutate({ id: memberModal.data._id, data });
      } else {
        createMember.mutate(data);
      }
    },
    [memberModal, createMember, updateMember]
  );

  const grouped = ROLE_ORDER.reduce<Record<ManagementRole, Member[]>>(
    (acc, role) => {
      acc[role] = members.filter((m) => m.role === role);
      return acc;
    },
    { chief: [], president: [], vp: [], member: [] }
  );

  const mutationError = createMember.error?.message ?? updateMember.error?.message;

  return (
    <div className="p-6 max-w-3xl">
      <PageHeader
        title="Management Team"
        description="Manage committee members by role"
        action={
          <button
            onClick={() => setMemberModal({ mode: 'add' })}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Member
          </button>
        }
      />

      {error && <p className="text-sm text-red-500 mb-4">Failed to load members</p>}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : (
        <>
          {ROLE_ORDER.map((role) => (
            <RoleGroup
              key={role}
              role={role}
              members={grouped[role]}
              onEdit={(m) => setMemberModal({ mode: 'edit', data: m })}
              onDelete={setDeleteMember}
            />
          ))}
          {members.length === 0 && (
            <div className="text-center py-16 text-sm text-gray-400">
              No members yet. Add one to get started.
            </div>
          )}
        </>
      )}

      <Modal
        open={!!memberModal}
        onClose={() => setMemberModal(null)}
        title={memberModal?.mode === 'edit' ? 'Edit Member' : 'Add Member'}
      >
        {mutationError && (
          <p className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{mutationError}</p>
        )}
        <MemberForm
          defaultValues={memberModal?.data}
          onSubmit={handleSubmit}
          loading={createMember.isPending || updateMember.isPending}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteMember}
        onClose={() => setDeleteMember(null)}
        onConfirm={() => deleteMember && removeMember.mutate(deleteMember._id)}
        message={`Delete "${deleteMember?.nameNp}"? This action cannot be undone.`}
        loading={removeMember.isPending}
      />
    </div>
  );
}
