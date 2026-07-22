'use client';

import { useState, useCallback, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  galleryCategorySchema,
  galleryItemSchema,
  type GalleryCategoryInput,
  type GalleryItemInput,
} from '@/lib/validations/cms';
import PageHeader from '../_components/ui/PageHeader';
import Modal from '../_components/ui/Modal';
import ConfirmDialog from '../_components/ui/ConfirmDialog';
import StatusBadge from '../_components/ui/StatusBadge';
import FileUpload from '../_components/ui/FileUpload';
import { Field, inputCls, selectCls } from '../_components/ui/Field';
import type { PublishStatus } from '@/lib/db/plugins/publishable.plugin';
import type { CloudinaryFileInput } from '@/lib/validations/cms';
import { extractYoutubeId, youtubeThumbnailUrl } from '@/lib/utils/youtube';

// ── Types ──────────────────────────────────────────────────────────────────────

interface GalleryCategory {
  _id: string;
  labelNp: string;
  labelEn: string;
  slug: string;
  order: number;
  itemCount: number;
}

interface GalleryItemRecord {
  _id: string;
  category: string;
  labelNp: string;
  labelEn: string;
  media: CloudinaryFileInput | null;
  thumbnail: CloudinaryFileInput | null;
  isVideo: boolean;
  isYoutube: boolean;
  youtubeId: string | null;
  col: string;
  row: string;
  order: number;
  status: PublishStatus;
}

// ── API helpers ────────────────────────────────────────────────────────────────

async function fetchCategories(): Promise<GalleryCategory[]> {
  const res = await fetch('/api/cms/gallery-categories');
  if (!res.ok) throw new Error('Failed to load categories');
  return (await res.json()).categories;
}

async function fetchItems(categoryId: string): Promise<GalleryItemRecord[]> {
  const res = await fetch(`/api/cms/gallery-items?category=${categoryId}`);
  if (!res.ok) throw new Error('Failed to load items');
  return (await res.json()).items;
}

const SPAN_OPTIONS = ['span 1', 'span 2', 'span 3'];

// ── Category form ──────────────────────────────────────────────────────────────

const CategoryForm = memo(function CategoryForm({
  defaultValues,
  onSubmit,
  loading,
}: {
  defaultValues?: Partial<GalleryCategoryInput>;
  onSubmit: (data: GalleryCategoryInput) => void;
  loading: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<GalleryCategoryInput>({
    resolver: zodResolver(galleryCategorySchema),
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

// ── Gallery item form ──────────────────────────────────────────────────────────

const GalleryItemForm = memo(function GalleryItemForm({
  categoryId,
  defaultValues,
  onSubmit,
  loading,
}: {
  categoryId: string;
  defaultValues?: Partial<GalleryItemInput>;
  onSubmit: (data: GalleryItemInput) => void;
  loading: boolean;
}) {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<GalleryItemInput>({
    resolver: zodResolver(galleryItemSchema),
    defaultValues: {
      category: categoryId,
      order: 0,
      status: 'draft',
      isVideo: false,
      isYoutube: false,
      youtubeId: null,
      col: 'span 1',
      row: 'span 1',
      media: null,
      thumbnail: null,
      ...defaultValues,
    },
  });

  const isVideo = useWatch({ control, name: 'isVideo' });
  const isYoutube = useWatch({ control, name: 'isYoutube' });
  const youtubeId = useWatch({ control, name: 'youtubeId' });

  const [youtubeInput, setYoutubeInput] = useState(
    defaultValues?.youtubeId ? `https://youtu.be/${defaultValues.youtubeId}` : ''
  );
  const [youtubeInputTouched, setYoutubeInputTouched] = useState(false);

  const handleYoutubeInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setYoutubeInput(value);
      setYoutubeInputTouched(true);
      setValue('youtubeId', extractYoutubeId(value), { shouldValidate: true });
    },
    [setValue]
  );

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

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isVideo"
          {...register('isVideo', {
            onChange: (e) => {
              if (!e.target.checked) {
                setValue('thumbnail', null);
                setValue('isYoutube', false);
                setValue('youtubeId', null);
                setYoutubeInput('');
              }
            },
          })}
          className="w-4 h-4 rounded border-gray-300 text-blue-600"
        />
        <label htmlFor="isVideo" className="text-sm font-medium text-gray-700">Video item</label>
      </div>

      {isVideo && (
        <div className="flex items-center gap-2 pl-6">
          <input
            type="checkbox"
            id="isYoutube"
            {...register('isYoutube', {
              onChange: (e) => {
                setValue('media', null);
                setValue('thumbnail', null);
                if (!e.target.checked) {
                  setValue('youtubeId', null);
                  setYoutubeInput('');
                }
              },
            })}
            className="w-4 h-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="isYoutube" className="text-sm font-medium text-gray-700">Embed from YouTube</label>
        </div>
      )}

      {isYoutube ? (
        <Field
          label="YouTube link"
          required
          error={youtubeInputTouched ? errors.youtubeId?.message : undefined}
        >
          <input
            value={youtubeInput}
            onChange={handleYoutubeInputChange}
            className={inputCls}
            placeholder="Paste a YouTube link or embed code"
          />
          {youtubeId && (
            <div className="mt-2 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={youtubeThumbnailUrl(youtubeId)}
                alt=""
                className="w-20 h-12 rounded object-cover border border-gray-200"
              />
              <span className="text-xs text-gray-400">Video ID: {youtubeId}</span>
            </div>
          )}
        </Field>
      ) : (
        <>
          <Field label="Media" required error={errors.media?.message}>
            <Controller
              control={control}
              name="media"
              render={({ field }) => (
                <FileUpload
                  value={field.value ?? null}
                  onChange={field.onChange}
                  accept={isVideo ? 'video/*' : 'image/*'}
                  folder="mechinagar-gallery"
                  label={isVideo ? 'Upload video' : 'Upload image'}
                />
              )}
            />
          </Field>

          {isVideo && (
            <Field label="Thumbnail" required error={errors.thumbnail?.message}>
              <Controller
                control={control}
                name="thumbnail"
                render={({ field }) => (
                  <FileUpload
                    value={field.value ?? null}
                    onChange={field.onChange}
                    accept="image/*"
                    folder="mechinagar-gallery-thumbs"
                    label="Upload thumbnail image"
                  />
                )}
              />
            </Field>
          )}
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label="Col Span" error={errors.col?.message}>
          <select {...register('col')} className={selectCls}>
            {SPAN_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Row Span" error={errors.row?.message}>
          <select {...register('row')} className={selectCls}>
            {SPAN_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
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
  cat: GalleryCategory;
  onEdit: (cat: GalleryCategory) => void;
  onDelete: (cat: GalleryCategory) => void;
}) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [editItem, setEditItem] = useState<GalleryItemRecord | null>(null);
  const [deleteItem, setDeleteItem] = useState<GalleryItemRecord | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['gallery-items', cat._id],
    queryFn: () => fetchItems(cat._id),
    enabled: open,
  });

  const createItem = useMutation({
    mutationFn: (data: GalleryItemInput) =>
      fetch('/api/cms/gallery-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gallery-items', cat._id] });
      qc.invalidateQueries({ queryKey: ['gallery-categories'] });
      setAddingItem(false);
    },
  });

  const updateItem = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GalleryItemInput> }) =>
      fetch(`/api/cms/gallery-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gallery-items', cat._id] });
      setEditItem(null);
    },
  });

  const removeItem = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/cms/gallery-items/${id}`, { method: 'DELETE' })
        .then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gallery-items', cat._id] });
      qc.invalidateQueries({ queryKey: ['gallery-categories'] });
      setDeleteItem(null);
    },
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
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
          <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cat.itemCount}</span>
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => { setOpen(true); setAddingItem(true); }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add Item
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
          {addingItem && (
            <div className="px-4 py-4 bg-blue-50/50 border-b border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">New Gallery Item</p>
                <button onClick={() => setAddingItem(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <GalleryItemForm
                categoryId={cat._id}
                onSubmit={(data) => createItem.mutate(data)}
                loading={createItem.isPending}
              />
            </div>
          )}

          {isLoading ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">Loading…</div>
          ) : items.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">No items yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {items.map((item) => {
                const thumbUrl = item.isYoutube && item.youtubeId
                  ? youtubeThumbnailUrl(item.youtubeId)
                  : item.isVideo
                    ? item.thumbnail?.url
                    : item.media?.url;
                return (
                  <div key={item._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
                    <div className="w-14 h-10 rounded overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                      {thumbUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.labelNp}</p>
                      <p className="text-xs text-gray-400">{item.labelEn} · {item.col} / {item.row}{item.isYoutube ? ' · YouTube' : item.isVideo ? ' · video' : ''}</p>
                    </div>
                    <StatusBadge status={item.status} />
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => setEditItem(item)} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                      </button>
                      <button onClick={() => setDeleteItem(item)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Gallery Item">
        {editItem && (
          <GalleryItemForm
            categoryId={editItem.category}
            defaultValues={editItem}
            onSubmit={(data) => updateItem.mutate({ id: editItem._id, data })}
            loading={updateItem.isPending}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => deleteItem && removeItem.mutate(deleteItem._id)}
        message={`Delete "${deleteItem?.labelNp}"? This action cannot be undone.`}
        loading={removeItem.isPending}
      />
    </div>
  );
});

// ── Page ───────────────────────────────────────────────────────────────────────

export default function GalleryPage() {
  const qc = useQueryClient();
  const [catModal, setCatModal] = useState<{ mode: 'add' | 'edit'; data?: GalleryCategory } | null>(null);
  const [deleteCat, setDeleteCat] = useState<GalleryCategory | null>(null);

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['gallery-categories'],
    queryFn: fetchCategories,
  });

  const createCategory = useMutation({
    mutationFn: (data: GalleryCategoryInput) =>
      fetch('/api/cms/gallery-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gallery-categories'] });
      setCatModal(null);
    },
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GalleryCategoryInput> }) =>
      fetch(`/api/cms/gallery-categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gallery-categories'] });
      setCatModal(null);
    },
  });

  const removeCategory = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/cms/gallery-categories/${id}`, { method: 'DELETE' })
        .then((r) => { if (!r.ok) throw new Error('Failed'); return r.json(); }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gallery-categories'] });
      setDeleteCat(null);
    },
  });

  const handleCatSubmit = useCallback(
    (data: GalleryCategoryInput) => {
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
        title="Gallery"
        description="Manage gallery categories and photos"
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

      <ConfirmDialog
        open={!!deleteCat}
        onClose={() => setDeleteCat(null)}
        onConfirm={() => deleteCat && removeCategory.mutate(deleteCat._id)}
        message={`Delete category "${deleteCat?.labelNp}"? All items in this category will also be removed.`}
        loading={removeCategory.isPending}
      />
    </div>
  );
}
