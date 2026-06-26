'use client';

import { useState, useCallback, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsEventSchema, type NewsEventInput } from '@/lib/validations/cms';
import PageHeader from '../_components/ui/PageHeader';
import Modal from '../_components/ui/Modal';
import ConfirmDialog from '../_components/ui/ConfirmDialog';
import StatusBadge from '../_components/ui/StatusBadge';
import FileUpload from '../_components/ui/FileUpload';
import { Field, inputCls, selectCls, textareaCls } from '../_components/ui/Field';
import type { PublishStatus } from '@/lib/db/plugins/publishable.plugin';

interface NewsEventItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string | null;
  label: string;
  isEvent: boolean;
  eventDate: string | null;
  status: PublishStatus;
  coverImage: { url: string; publicId: string; format: string; bytes: number } | null;
  seoTitle: string;
  seoDescription: string;
}

async function fetchItems(): Promise<NewsEventItem[]> {
  const res = await fetch('/api/cms/news-events');
  if (!res.ok) throw new Error('Failed');
  return (await res.json()).items;
}

// ── News / Event form ──────────────────────────────────────────────────────────

const ItemForm = memo(function ItemForm({
  defaultValues, onSubmit, loading,
}: { defaultValues?: Partial<NewsEventInput>; onSubmit: (d: NewsEventInput) => void; loading: boolean; }) {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<NewsEventInput>({
    resolver: zodResolver(newsEventSchema),
    defaultValues: { status: 'draft', isEvent: false, body: null, coverImage: null, label: '', eventDate: null, seoTitle: '', seoDescription: '', ...defaultValues },
  });

  const isEvent = watch('isEvent');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Title" required error={errors.title?.message}>
        <input {...register('title')} className={inputCls} placeholder="Title" />
      </Field>
      <Field label="Excerpt" required error={errors.excerpt?.message}>
        <textarea {...register('excerpt')} rows={2} className={textareaCls} placeholder="Short excerpt (max 500 chars)" />
      </Field>
      <Field label="Body" error={errors.body?.message}>
        <textarea {...register('body')} rows={5} className={textareaCls} placeholder="Full content (optional)" />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Label / Badge" error={errors.label?.message}>
          <input {...register('label')} className={inputCls} placeholder="e.g. समाचार" />
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <select {...register('status')} className={selectCls}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field label="Type">
          <label className="flex items-center gap-2 h-9 cursor-pointer">
            <input {...register('isEvent')} type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm text-gray-700">Is Event</span>
          </label>
        </Field>
      </div>
      {isEvent && (
        <Field label="Event Date" required error={errors.eventDate?.message}>
          <input {...register('eventDate')} type="datetime-local" className={inputCls} />
        </Field>
      )}
      <Field label="Cover Image (optional)">
        <Controller
          control={control}
          name="coverImage"
          render={({ field }) => (
            <FileUpload
              value={field.value ?? null}
              onChange={field.onChange}
              accept="image/*"
              folder="mechinagar-news"
              label="Upload cover image"
            />
          )}
        />
      </Field>

      {/* SEO collapsible (always rendered, simple) */}
      <details className="group">
        <summary className="text-xs font-medium text-gray-500 cursor-pointer list-none flex items-center gap-1 select-none">
          <svg className="w-3.5 h-3.5 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          SEO overrides (optional)
        </summary>
        <div className="mt-3 space-y-3 pl-4 border-l border-gray-100">
          <Field label="SEO Title" error={errors.seoTitle?.message}>
            <input {...register('seoTitle')} className={inputCls} placeholder="Overrides title (max 150)" />
          </Field>
          <Field label="SEO Description" error={errors.seoDescription?.message}>
            <textarea {...register('seoDescription')} rows={2} className={textareaCls} placeholder="Overrides excerpt (max 300)" />
          </Field>
        </div>
      </details>

      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5">
          {loading && <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
          Save
        </button>
      </div>
    </form>
  );
});

// ── Page ───────────────────────────────────────────────────────────────────────

export default function NewsEventsPage() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; data?: NewsEventItem } | null>(null);
  const [deleteItem, setDeleteItem] = useState<NewsEventItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'news' | 'events'>('all');

  const { data: allItems = [], isLoading, error } = useQuery({
    queryKey: ['news-events'],
    queryFn: fetchItems,
  });

  const items = allItems.filter((i) => {
    if (filter === 'news') return !i.isEvent;
    if (filter === 'events') return i.isEvent;
    return true;
  });

  const createItem = useMutation({
    mutationFn: (data: NewsEventInput) =>
      fetch('/api/cms/news-events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => {
        if (!r.ok) return r.json().then((d) => Promise.reject(new Error(d.error ?? 'Failed')));
        return r.json();
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['news-events'] }); setModal(null); },
  });

  const updateItem = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewsEventInput> }) =>
      fetch(`/api/cms/news-events/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => {
        if (!r.ok) return r.json().then((d) => Promise.reject(new Error(d.error ?? 'Failed')));
        return r.json();
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['news-events'] }); setModal(null); },
  });

  const removeItem = useMutation({
    mutationFn: (id: string) => fetch(`/api/cms/news-events/${id}`, { method: 'DELETE' }).then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['news-events'] }); setDeleteItem(null); },
  });

  const handleSubmit = useCallback((data: NewsEventInput) => {
    if (modal?.mode === 'edit' && modal.data) updateItem.mutate({ id: modal.data._id, data });
    else createItem.mutate(data);
  }, [modal, createItem, updateItem]);

  const mutationError = createItem.error?.message ?? updateItem.error?.message;

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader
        title="News & Events"
        description="Manage news articles and event announcements"
        action={
          <button onClick={() => setModal({ mode: 'add' })} className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Post
          </button>
        }
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-5 p-1 bg-gray-100 rounded-lg w-fit">
        {(['all', 'news', 'events'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-500 mb-4">Failed to load</p>}

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-sm text-gray-400">No {filter === 'all' ? 'posts' : filter} yet.</div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-50 overflow-hidden">
          {items.map((item) => (
            <div key={item._id} className="flex items-start gap-3 px-4 py-4 hover:bg-gray-50/60 transition-colors">
              {item.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.coverImage.url} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />
              ) : (
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border shrink-0 ${item.isEvent ? 'bg-purple-50 border-purple-100' : 'bg-gray-100 border-gray-200'}`}>
                  {item.isEvent ? (
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg>
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {item.isEvent && (
                    <span className="text-xs font-medium text-purple-600 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded">Event</span>
                  )}
                  {item.label && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{item.label}</span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{item.excerpt}</p>
                {item.isEvent && item.eventDate && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(item.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={item.status} />
                <div className="flex items-center gap-1">
                  <button onClick={() => setModal({ mode: 'edit', data: item })} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                  </button>
                  <button onClick={() => setDeleteItem(item)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Edit Post' : 'Add Post'} size="lg">
        {mutationError && (
          <p className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{mutationError}</p>
        )}
        <ItemForm
          defaultValues={modal?.data}
          onSubmit={handleSubmit}
          loading={createItem.isPending || updateItem.isPending}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => deleteItem && removeItem.mutate(deleteItem._id)}
        message={`Delete "${deleteItem?.title}"? This action cannot be undone.`}
        loading={removeItem.isPending}
      />
    </div>
  );
}
