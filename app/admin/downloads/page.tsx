'use client';

import { useState, useCallback, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { downloadCategorySchema, downloadSchema, type DownloadCategoryInput, type DownloadInput } from '@/lib/validations/cms';
import PageHeader from '../_components/ui/PageHeader';
import Modal from '../_components/ui/Modal';
import ConfirmDialog from '../_components/ui/ConfirmDialog';
import StatusBadge from '../_components/ui/StatusBadge';
import FileUpload from '../_components/ui/FileUpload';
import { Field, inputCls, selectCls } from '../_components/ui/Field';
import type { PublishStatus } from '@/lib/db/plugins/publishable.plugin';

interface DownloadCategory { _id: string; labelNp: string; labelEn: string; slug: string; order: number; downloadCount: number; }
interface Download { _id: string; titleNp: string; titleEn: string; category: string; file: { url: string; publicId: string; format: string; bytes: number }; fiscalYear: string; status: PublishStatus; }

async function fetchCategories(): Promise<DownloadCategory[]> {
  const res = await fetch('/api/cms/download-categories');
  if (!res.ok) throw new Error('Failed');
  return (await res.json()).categories;
}

async function fetchDownloads(categoryId: string): Promise<Download[]> {
  const res = await fetch(`/api/cms/downloads?category=${categoryId}`);
  if (!res.ok) throw new Error('Failed');
  return (await res.json()).downloads;
}

// ── Category form ──────────────────────────────────────────────────────────────

const CategoryForm = memo(function CategoryForm({
  defaultValues, onSubmit, loading,
}: { defaultValues?: Partial<DownloadCategoryInput>; onSubmit: (d: DownloadCategoryInput) => void; loading: boolean; }) {
  const { register, handleSubmit, formState: { errors } } = useForm<DownloadCategoryInput>({
    resolver: zodResolver(downloadCategorySchema),
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

// ── Download form ──────────────────────────────────────────────────────────────

const DownloadForm = memo(function DownloadForm({
  categoryId, defaultValues, onSubmit, loading,
}: { categoryId: string; defaultValues?: Partial<DownloadInput>; onSubmit: (d: DownloadInput) => void; loading: boolean; }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<DownloadInput>({
    resolver: zodResolver(downloadSchema),
    defaultValues: { category: categoryId, status: 'draft', titleEn: '', fiscalYear: '', ...defaultValues },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Title (Nepali)" required error={errors.titleNp?.message}>
        <input {...register('titleNp')} className={inputCls} placeholder="नेपाली शीर्षक" />
      </Field>
      <Field label="Title (English)" error={errors.titleEn?.message}>
        <input {...register('titleEn')} className={inputCls} placeholder="English title (optional)" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Fiscal Year" error={errors.fiscalYear?.message}>
          <input {...register('fiscalYear')} className={inputCls} placeholder="e.g. २०८०/८१" />
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <select {...register('status')} className={selectCls}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
      </div>
      <Field label="File" required error={errors.file?.message as string}>
        <Controller
          control={control}
          name="file"
          render={({ field }) => (
            <FileUpload
              value={field.value ?? null}
              onChange={field.onChange}
              accept="application/pdf,.doc,.docx,.xls,.xlsx"
              folder="mechinagar-downloads"
              label="Upload file (PDF, Word, Excel)"
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
}: { cat: DownloadCategory; onEdit: (c: DownloadCategory) => void; onDelete: (c: DownloadCategory) => void; }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editDownload, setEditDownload] = useState<Download | null>(null);
  const [deleteDownload, setDeleteDownload] = useState<Download | null>(null);

  const { data: downloads = [], isLoading } = useQuery({
    queryKey: ['downloads', cat._id],
    queryFn: () => fetchDownloads(cat._id),
    enabled: open,
  });

  const createDownload = useMutation({
    mutationFn: (data: DownloadInput) =>
      fetch('/api/cms/downloads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['downloads', cat._id] }); qc.invalidateQueries({ queryKey: ['download-categories'] }); setAdding(false); },
  });

  const updateDownload = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DownloadInput> }) =>
      fetch(`/api/cms/downloads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['downloads', cat._id] }); setEditDownload(null); },
  });

  const removeDownload = useMutation({
    mutationFn: (id: string) => fetch(`/api/cms/downloads/${id}`, { method: 'DELETE' }).then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['downloads', cat._id] }); qc.invalidateQueries({ queryKey: ['download-categories'] }); setDeleteDownload(null); },
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
          <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cat.downloadCount}</span>
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => { setOpen(true); setAdding(true); }} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add File
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
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">New File</p>
                <button onClick={() => setAdding(false)} className="text-gray-400 hover:text-gray-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <DownloadForm categoryId={cat._id} onSubmit={(d) => createDownload.mutate(d)} loading={createDownload.isPending} />
            </div>
          )}

          {isLoading ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">Loading…</div>
          ) : downloads.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">No files yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {downloads.map((d) => (
                <div key={d._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
                  <div className="w-8 h-8 rounded bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{d.titleNp}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {d.titleEn && <span className="text-xs text-gray-400">{d.titleEn}</span>}
                      {d.fiscalYear && <span className="text-xs text-gray-400">• {d.fiscalYear}</span>}
                    </div>
                  </div>
                  <StatusBadge status={d.status} />
                  <div className="flex items-center gap-1 shrink-0">
                    <a href={d.file.url} target="_blank" rel="noreferrer" className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a>
                    <button onClick={() => setEditDownload(d)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                    </button>
                    <button onClick={() => setDeleteDownload(d)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal open={!!editDownload} onClose={() => setEditDownload(null)} title="Edit File" size="lg">
        {editDownload && (
          <DownloadForm
            categoryId={editDownload.category}
            defaultValues={editDownload}
            onSubmit={(d) => updateDownload.mutate({ id: editDownload._id, data: d })}
            loading={updateDownload.isPending}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteDownload}
        onClose={() => setDeleteDownload(null)}
        onConfirm={() => deleteDownload && removeDownload.mutate(deleteDownload._id)}
        message={`Delete "${deleteDownload?.titleNp}"?`}
        loading={removeDownload.isPending}
      />
    </div>
  );
});

// ── Page ───────────────────────────────────────────────────────────────────────

export default function DownloadsPage() {
  const qc = useQueryClient();
  const [catModal, setCatModal] = useState<{ mode: 'add' | 'edit'; data?: DownloadCategory } | null>(null);
  const [deleteCat, setDeleteCat] = useState<DownloadCategory | null>(null);

  const { data: categories = [], isLoading, error } = useQuery({ queryKey: ['download-categories'], queryFn: fetchCategories });

  const createCategory = useMutation({
    mutationFn: (data: DownloadCategoryInput) =>
      fetch('/api/cms/download-categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['download-categories'] }); setCatModal(null); },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DownloadCategoryInput> }) =>
      fetch(`/api/cms/download-categories/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['download-categories'] }); setCatModal(null); },
  });

  const removeCategory = useMutation({
    mutationFn: (id: string) => fetch(`/api/cms/download-categories/${id}`, { method: 'DELETE' }).then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['download-categories'] }); setDeleteCat(null); },
  });

  const handleCatSubmit = useCallback((data: DownloadCategoryInput) => {
    if (catModal?.mode === 'edit' && catModal.data) updateCategory.mutate({ id: catModal.data._id, data });
    else createCategory.mutate(data);
  }, [catModal, createCategory, updateCategory]);

  return (
    <div className="p-6 max-w-3xl">
      <PageHeader
        title="Downloads"
        description="Manage downloadable files by category"
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
