'use client';

import { useState, useCallback, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffCategorySchema, staffSchema, type StaffCategoryInput, type StaffInput } from '@/lib/validations/cms';
import PageHeader from '../_components/ui/PageHeader';
import Modal from '../_components/ui/Modal';
import ConfirmDialog from '../_components/ui/ConfirmDialog';
import StatusBadge from '../_components/ui/StatusBadge';
import FileUpload from '../_components/ui/FileUpload';
import { Field, inputCls, selectCls } from '../_components/ui/Field';
import type { PublishStatus } from '@/lib/db/plugins/publishable.plugin';

// ── Types ──────────────────────────────────────────────────────────────────────

interface StaffCategory {
  _id: string;
  labelNp: string;
  labelEn: string;
  slug: string;
  order: number;
  staffCount: number;
}

interface StaffRecord {
  _id: string;
  nameNp: string;
  post: string;
  category: string;
  order: number;
  status: PublishStatus;
  photo: { url: string; publicId: string; format: string; bytes: number } | null;
}

// ── API helpers ────────────────────────────────────────────────────────────────

async function fetchCategories(): Promise<StaffCategory[]> {
  const res = await fetch('/api/cms/staff-categories');
  if (!res.ok) throw new Error('Failed to load categories');
  return (await res.json()).categories;
}

async function fetchStaff(categoryId: string): Promise<StaffRecord[]> {
  const res = await fetch(`/api/cms/staff?category=${categoryId}`);
  if (!res.ok) throw new Error('Failed to load staff');
  return (await res.json()).staff;
}

// ── Category form ──────────────────────────────────────────────────────────────

const CategoryForm = memo(function CategoryForm({
  defaultValues,
  onSubmit,
  loading,
}: {
  defaultValues?: Partial<StaffCategoryInput>;
  onSubmit: (data: StaffCategoryInput) => void;
  loading: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<StaffCategoryInput>({
    resolver: zodResolver(staffCategorySchema),
    defaultValues: { order: 0, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nepali Label" required error={errors.labelNp?.message}>
          <input {...register('labelNp')} className={inputCls} placeholder="नेपाली नाम" />
        </Field>
        <Field label="English Label" required error={errors.labelEn?.message}>
          <input {...register('labelEn')} className={inputCls} placeholder="English name" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Slug" error={errors.slug?.message}>
          <input {...register('slug')} className={inputCls} placeholder="auto-generated" />
        </Field>
        <Field label="Order" error={errors.order?.message}>
          <input {...register('order', { valueAsNumber: true })} type="number" className={inputCls} />
        </Field>
      </div>
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

// ── Staff form ─────────────────────────────────────────────────────────────────

const StaffForm = memo(function StaffForm({
  categoryId,
  defaultValues,
  onSubmit,
  loading,
}: {
  categoryId: string;
  defaultValues?: Partial<StaffInput>;
  onSubmit: (data: StaffInput) => void;
  loading: boolean;
}) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<StaffInput>({
    resolver: zodResolver(staffSchema),
    defaultValues: { category: categoryId, order: 0, status: 'draft', photo: null, ...defaultValues },
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
      <div className="grid grid-cols-2 gap-3">
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
              folder="mechinagar-staff"
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

// ── Category row (accordion) ───────────────────────────────────────────────────

const CategoryRow = memo(function CategoryRow({
  cat,
  onEdit,
  onDelete,
}: {
  cat: StaffCategory;
  onEdit: (cat: StaffCategory) => void;
  onDelete: (cat: StaffCategory) => void;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [addingStaff, setAddingStaff] = useState(false);
  const [editStaff, setEditStaff] = useState<StaffRecord | null>(null);
  const [deleteStaff, setDeleteStaff] = useState<StaffRecord | null>(null);

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staff', cat._id],
    queryFn: () => fetchStaff(cat._id),
    enabled: open,
  });

  const createStaff = useMutation({
    mutationFn: (data: StaffInput) =>
      fetch('/api/cms/staff', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff', cat._id] });
      qc.invalidateQueries({ queryKey: ['staff-categories'] });
      setAddingStaff(false);
    },
  });

  const updateStaff = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StaffInput> }) =>
      fetch(`/api/cms/staff/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff', cat._id] });
      setEditStaff(null);
    },
  });

  const removeStaff = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/cms/staff/${id}`, { method: 'DELETE' }).then((r) => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff', cat._id] });
      qc.invalidateQueries({ queryKey: ['staff-categories'] });
      setDeleteStaff(null);
    },
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Category header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 flex-1 text-left"
        >
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${open ? 'rotate-90' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <div>
            <span className="text-sm font-medium text-gray-900">{cat.labelNp}</span>
            <span className="text-xs text-gray-400 ml-2">{cat.labelEn}</span>
          </div>
          <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cat.staffCount}</span>
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => { setOpen(true); setAddingStaff(true); }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Staff
          </button>
          <button onClick={() => onEdit(cat)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
          </button>
          <button onClick={() => onDelete(cat)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-gray-100">
          {/* Inline add form */}
          {addingStaff && (
            <div className="px-4 py-4 bg-blue-50/50 border-b border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">New Staff Member</p>
                <button onClick={() => setAddingStaff(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <StaffForm
                categoryId={cat._id}
                onSubmit={(data) => createStaff.mutate(data)}
                loading={createStaff.isPending}
              />
            </div>
          )}

          {/* Staff list */}
          {isLoading ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">Loading…</div>
          ) : staff.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">No staff members yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {staff.map((s) => (
                <div key={s._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
                  {s.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.photo.url} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-gray-500">{s.nameNp.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{s.nameNp}</p>
                    <p className="text-xs text-gray-500">{s.post}</p>
                  </div>
                  <StatusBadge status={s.status} />
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setEditStaff(s)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                    </button>
                    <button onClick={() => setDeleteStaff(s)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit staff modal */}
      <Modal open={!!editStaff} onClose={() => setEditStaff(null)} title="Edit Staff Member">
        {editStaff && (
          <StaffForm
            categoryId={editStaff.category}
            defaultValues={editStaff}
            onSubmit={(data) => updateStaff.mutate({ id: editStaff._id, data })}
            loading={updateStaff.isPending}
          />
        )}
      </Modal>

      {/* Delete staff confirm */}
      <ConfirmDialog
        open={!!deleteStaff}
        onClose={() => setDeleteStaff(null)}
        onConfirm={() => deleteStaff && removeStaff.mutate(deleteStaff._id)}
        message={`Delete "${deleteStaff?.nameNp}"? This action cannot be undone.`}
        loading={removeStaff.isPending}
      />
    </div>
  );
});

// ── Page ───────────────────────────────────────────────────────────────────────

export default function StaffPage() {
  const qc = useQueryClient();
  const [catModal, setCatModal] = useState<{ mode: 'add' | 'edit'; data?: StaffCategory } | null>(null);
  const [deleteCat, setDeleteCat] = useState<StaffCategory | null>(null);

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['staff-categories'],
    queryFn: fetchCategories,
  });

  const createCategory = useMutation({
    mutationFn: (data: StaffCategoryInput) =>
      fetch('/api/cms/staff-categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff-categories'] });
      setCatModal(null);
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StaffCategoryInput> }) =>
      fetch(`/api/cms/staff-categories/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff-categories'] });
      setCatModal(null);
    },
  });

  const removeCategory = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/cms/staff-categories/${id}`, { method: 'DELETE' }).then((r) => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['staff-categories'] });
      setDeleteCat(null);
    },
  });

  const handleCatSubmit = useCallback(
    (data: StaffCategoryInput) => {
      if (catModal?.mode === 'edit' && catModal.data) {
        updateCategory.mutate({ id: catModal.data._id, data });
      } else {
        createCategory.mutate(data);
      }
    },
    [catModal, createCategory, updateCategory]
  );

  return (
    <div className="p-6 max-w-3xl">
      <PageHeader
        title="Staff"
        description="Manage staff categories and members"
        action={
          <button
            onClick={() => setCatModal({ mode: 'add' })}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Category
          </button>
        }
      />

      {error && <p className="text-sm text-red-500 mb-4">Failed to load categories</p>}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">
          No categories yet. Add one to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <CategoryRow
              key={cat._id}
              cat={cat}
              onEdit={(c) => setCatModal({ mode: 'edit', data: c })}
              onDelete={setDeleteCat}
            />
          ))}
        </div>
      )}

      {/* Category modal */}
      <Modal
        open={!!catModal}
        onClose={() => setCatModal(null)}
        title={catModal?.mode === 'edit' ? 'Edit Category' : 'Add Category'}
      >
        <CategoryForm
          defaultValues={catModal?.data}
          onSubmit={handleCatSubmit}
          loading={createCategory.isPending || updateCategory.isPending}
        />
      </Modal>

      {/* Delete category confirm */}
      <ConfirmDialog
        open={!!deleteCat}
        onClose={() => setDeleteCat(null)}
        onConfirm={() => deleteCat && removeCategory.mutate(deleteCat._id)}
        message={`Delete category "${deleteCat?.labelNp}"? All staff in this category must be reassigned first.`}
        loading={removeCategory.isPending}
      />
    </div>
  );
}
