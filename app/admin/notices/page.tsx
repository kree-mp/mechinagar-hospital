'use client';

import { useState, useCallback, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { noticeCategorySchema, noticeSchema, type NoticeCategoryInput, type NoticeInput } from '@/lib/validations/cms';
import PageHeader from '../_components/ui/PageHeader';
import Modal from '../_components/ui/Modal';
import ConfirmDialog from '../_components/ui/ConfirmDialog';
import StatusBadge from '../_components/ui/StatusBadge';
import FileUpload from '../_components/ui/FileUpload';
import { Field, inputCls, selectCls, textareaCls } from '../_components/ui/Field';
import type { PublishStatus } from '@/lib/db/plugins/publishable.plugin';

interface NoticeCategory { _id: string; labelNp: string; labelEn: string; slug: string; order: number; noticeCount: number; }
interface Notice { _id: string; title: string; refNumber: string; body: string | null; category: string; status: PublishStatus; expiresAt: string | null; file: { url: string; publicId: string; format: string; bytes: number } | null; coverPhoto: { url: string; publicId: string; format: string; bytes: number } | null; }

async function fetchCategories(): Promise<NoticeCategory[]> {
  const res = await fetch('/api/cms/notice-categories');
  if (!res.ok) throw new Error('Failed');
  return (await res.json()).categories;
}

async function fetchNotices(categoryId: string): Promise<Notice[]> {
  const res = await fetch(`/api/cms/notices?category=${categoryId}`);
  if (!res.ok) throw new Error('Failed');
  return (await res.json()).notices;
}

// ── Category form ──────────────────────────────────────────────────────────────

const CategoryForm = memo(function CategoryForm({
  defaultValues, onSubmit, loading,
}: { defaultValues?: Partial<NoticeCategoryInput>; onSubmit: (d: NoticeCategoryInput) => void; loading: boolean; }) {
  const { register, handleSubmit, formState: { errors } } = useForm<NoticeCategoryInput>({
    resolver: zodResolver(noticeCategorySchema),
    defaultValues: { order: 0, ...defaultValues },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nepali Label" required error={errors.labelNp?.message}><input {...register('labelNp')} className={inputCls} placeholder="नेपाली नाम" /></Field>
        <Field label="English Label" required error={errors.labelEn?.message}><input {...register('labelEn')} className={inputCls} placeholder="English name" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Slug" error={errors.slug?.message}><input {...register('slug')} className={inputCls} placeholder="auto-generated" /></Field>
        <Field label="Order" error={errors.order?.message}><input {...register('order', { valueAsNumber: true })} type="number" className={inputCls} /></Field>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5">
          {loading && <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
          Save
        </button>
      </div>
    </form>
  );
});

// ── Notice form ────────────────────────────────────────────────────────────────

const NoticeForm = memo(function NoticeForm({
  categoryId, defaultValues, onSubmit, loading,
}: { categoryId: string; defaultValues?: Partial<NoticeInput>; onSubmit: (d: NoticeInput) => void; loading: boolean; }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<NoticeInput>({
    resolver: zodResolver(noticeSchema),
    defaultValues: { category: categoryId, status: 'draft', refNumber: '', body: null, file: null, coverPhoto: null, expiresAt: null, ...defaultValues },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Title" required error={errors.title?.message}>
        <input {...register('title')} className={inputCls} placeholder="Notice title" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Reference Number" error={errors.refNumber?.message}>
          <input {...register('refNumber')} className={inputCls} placeholder="Ref. no." />
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <select {...register('status')} className={selectCls}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
      </div>
      <Field label="Body (optional)" error={errors.body?.message}>
        <textarea {...register('body')} rows={3} className={textareaCls} placeholder="Notice body…" />
      </Field>
      <Field label="Expires At (optional)">
        <input {...register('expiresAt')} type="datetime-local" className={inputCls} />
      </Field>
      <Field label="Cover Photo (optional)">
        <Controller
          control={control}
          name="coverPhoto"
          render={({ field }) => (
            <FileUpload
              value={field.value ?? null}
              onChange={field.onChange}
              accept="image/*"
              folder="mechinagar-notices"
              label="Upload cover photo"
            />
          )}
        />
      </Field>
      <Field label="Attachment (PDF)">
        <Controller
          control={control}
          name="file"
          render={({ field }) => (
            <FileUpload
              value={field.value ?? null}
              onChange={field.onChange}
              accept="application/pdf"
              folder="mechinagar-notices"
              label="Upload PDF attachment"
            />
          )}
        />
      </Field>
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5">
          {loading && <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
          Save
        </button>
      </div>
    </form>
  );
});

// ── Category accordion row ─────────────────────────────────────────────────────

const CategoryRow = memo(function CategoryRow({
  cat, onEdit, onDelete,
}: { cat: NoticeCategory; onEdit: (c: NoticeCategory) => void; onDelete: (c: NoticeCategory) => void; }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editNotice, setEditNotice] = useState<Notice | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<Notice | null>(null);

  const { data: notices = [], isLoading } = useQuery({
    queryKey: ['notices', cat._id],
    queryFn: () => fetchNotices(cat._id),
    enabled: open,
  });

  const createNotice = useMutation({
    mutationFn: (data: NoticeInput) =>
      fetch('/api/cms/notices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => {
        if (!r.ok) throw new Error('Failed'); return r.json();
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notices', cat._id] }); qc.invalidateQueries({ queryKey: ['notice-categories'] }); setAdding(false); },
  });

  const updateNotice = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NoticeInput> }) =>
      fetch(`/api/cms/notices/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => {
        if (!r.ok) throw new Error('Failed'); return r.json();
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notices', cat._id] }); setEditNotice(null); },
  });

  const removeNotice = useMutation({
    mutationFn: (id: string) => fetch(`/api/cms/notices/${id}`, { method: 'DELETE' }).then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notices', cat._id] }); qc.invalidateQueries({ queryKey: ['notice-categories'] }); setDeleteNotice(null); },
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 flex-1 text-left">
          <svg className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${open ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          <div>
            <span className="text-sm font-medium text-gray-900">{cat.labelNp}</span>
            <span className="text-xs text-gray-400 ml-2">{cat.labelEn}</span>
          </div>
          <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cat.noticeCount}</span>
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => { setOpen(true); setAdding(true); }} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Notice
          </button>
          <button onClick={() => onEdit(cat)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
          </button>
          <button onClick={() => onDelete(cat)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100">
          {adding && (
            <div className="px-4 py-4 bg-blue-50/50 border-b border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">New Notice</p>
                <button onClick={() => setAdding(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <NoticeForm categoryId={cat._id} onSubmit={(d) => createNotice.mutate(d)} loading={createNotice.isPending} />
            </div>
          )}

          {isLoading ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">Loading…</div>
          ) : notices.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">No notices yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notices.map((n) => (
                <div key={n._id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
                  {n.coverPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={n.coverPhoto.url} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V10.5zm3.75 0h.008v.008h-.008V10.5z" /></svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {n.refNumber && <span className="text-xs text-gray-400">{n.refNumber}</span>}
                      {n.coverPhoto && <span className="text-xs text-green-500 flex items-center gap-0.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V10.5zm3.75 0h.008v.008h-.008V10.5z" /></svg>Cover</span>}
                      {n.file && <span className="text-xs text-blue-500 flex items-center gap-0.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>PDF</span>}
                    </div>
                  </div>
                  <StatusBadge status={n.status} />
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setEditNotice(n)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                    </button>
                    <button onClick={() => setDeleteNotice(n)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal open={!!editNotice} onClose={() => setEditNotice(null)} title="Edit Notice" size="lg">
        {editNotice && (
          <NoticeForm
            categoryId={editNotice.category}
            defaultValues={editNotice}
            onSubmit={(d) => updateNotice.mutate({ id: editNotice._id, data: d })}
            loading={updateNotice.isPending}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteNotice}
        onClose={() => setDeleteNotice(null)}
        onConfirm={() => deleteNotice && removeNotice.mutate(deleteNotice._id)}
        message={`Delete "${deleteNotice?.title}"?`}
        loading={removeNotice.isPending}
      />
    </div>
  );
});

// ── Page ───────────────────────────────────────────────────────────────────────

export default function NoticesPage() {
  const qc = useQueryClient();
  const [catModal, setCatModal] = useState<{ mode: 'add' | 'edit'; data?: NoticeCategory } | null>(null);
  const [deleteCat, setDeleteCat] = useState<NoticeCategory | null>(null);

  const { data: categories = [], isLoading, error } = useQuery({ queryKey: ['notice-categories'], queryFn: fetchCategories });

  const createCategory = useMutation({
    mutationFn: (data: NoticeCategoryInput) =>
      fetch('/api/cms/notice-categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notice-categories'] }); setCatModal(null); },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NoticeCategoryInput> }) =>
      fetch(`/api/cms/notice-categories/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notice-categories'] }); setCatModal(null); },
  });

  const removeCategory = useMutation({
    mutationFn: (id: string) => fetch(`/api/cms/notice-categories/${id}`, { method: 'DELETE' }).then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notice-categories'] }); setDeleteCat(null); },
  });

  const handleCatSubmit = useCallback((data: NoticeCategoryInput) => {
    if (catModal?.mode === 'edit' && catModal.data) updateCategory.mutate({ id: catModal.data._id, data });
    else createCategory.mutate(data);
  }, [catModal, createCategory, updateCategory]);

  return (
    <div className="p-6 max-w-3xl">
      <PageHeader
        title="Notices"
        description="Manage notice categories and notices"
        action={
          <button onClick={() => setCatModal({ mode: 'add' })} className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Category
          </button>
        }
      />

      {error && <p className="text-sm text-red-500 mb-4">Failed to load categories</p>}

      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />)}</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">No categories yet. Add one to get started.</div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <CategoryRow key={cat._id} cat={cat} onEdit={(c) => setCatModal({ mode: 'edit', data: c })} onDelete={setDeleteCat} />
          ))}
        </div>
      )}

      <Modal open={!!catModal} onClose={() => setCatModal(null)} title={catModal?.mode === 'edit' ? 'Edit Category' : 'Add Category'}>
        <CategoryForm defaultValues={catModal?.data} onSubmit={handleCatSubmit} loading={createCategory.isPending || updateCategory.isPending} />
      </Modal>

      <ConfirmDialog
        open={!!deleteCat}
        onClose={() => setDeleteCat(null)}
        onConfirm={() => deleteCat && removeCategory.mutate(deleteCat._id)}
        message={`Delete category "${deleteCat?.labelNp}"?`}
        loading={removeCategory.isPending}
      />
    </div>
  );
}
