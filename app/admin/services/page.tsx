'use client';

import { useState, useCallback, memo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  serviceCategorySchema,
  serviceSchema,
  type ServiceCategoryInput,
  type ServiceInput,
} from '@/lib/validations/cms';
import PageHeader from '../_components/ui/PageHeader';
import Modal from '../_components/ui/Modal';
import ConfirmDialog from '../_components/ui/ConfirmDialog';
import StatusBadge from '../_components/ui/StatusBadge';
import { Field, inputCls, selectCls, textareaCls } from '../_components/ui/Field';
import type { PublishStatus } from '@/lib/db/plugins/publishable.plugin';

interface Category {
  _id: string;
  nameNp: string;
  nameEn: string;
  badge: string;
  availability: string | null;
  availabilityEn: string | null;
  desc: string | null;
  descEn: string | null;
  inDepartments: boolean;
  order: number;
  status: PublishStatus;
  serviceCount: number;
}

interface Offer {
  _id: string;
  titleNp: string;
  titleEn: string;
  category: string;
  order: number;
  status: PublishStatus;
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/cms/service-categories');
  if (!res.ok) throw new Error('Failed');
  return (await res.json()).categories;
}

async function fetchOffers(categoryId: string): Promise<Offer[]> {
  const res = await fetch(`/api/cms/services${categoryId ? `?category=${categoryId}` : ''}`);
  if (!res.ok) throw new Error('Failed');
  return (await res.json()).services;
}

async function post(url: string, method: string, body?: unknown): Promise<Response> {
  return fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
}

// ── Category form ─────────────────────────────────────────────────────────────

const CategoryForm = memo(function CategoryForm({
  defaultValues,
  onSubmit,
  loading,
}: {
  defaultValues?: Partial<ServiceCategoryInput>;
  onSubmit: (d: ServiceCategoryInput) => void;
  loading: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<ServiceCategoryInput>({
    resolver: zodResolver(serviceCategorySchema),
    defaultValues: { nameNp: '', nameEn: '', badge: '', availability: null, availabilityEn: null, desc: null, descEn: null, inDepartments: true, order: 0, status: 'draft', ...defaultValues },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name (Nepali)" required error={errors.nameNp?.message}>
          <input {...register('nameNp')} className={inputCls} placeholder="e.g. आकस्मिक सेवा" />
        </Field>
        <Field label="Name (English)" required error={errors.nameEn?.message}>
          <input {...register('nameEn')} className={inputCls} placeholder="e.g. Emergency" />
        </Field>
      </div>
      <Field label="Badge (EN short label)" error={errors.badge?.message}>
        <input {...register('badge')} className={inputCls} placeholder="e.g. EMERGENCY / OPD" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Availability (optional)">
          <input {...register('availability')} className={inputCls} placeholder="e.g. २४ घण्टा" />
        </Field>
        <Field label="Availability (EN)">
          <input {...register('availabilityEn')} className={inputCls} placeholder="e.g. 24 hours" />
        </Field>
      </div>
      <Field label="Description (Nepali)">
        <textarea {...register('desc')} rows={2} className={textareaCls} placeholder="विवरण" />
      </Field>
      <Field label="Description (English)">
        <textarea {...register('descEn')} rows={2} className={textareaCls} placeholder="Description" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Show in 'Available Health Services'">
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 cursor-pointer">
            <input type="checkbox" {...register('inDepartments')} className="w-4 h-4" />
            <span className="text-sm text-gray-700">Yes</span>
          </label>
        </Field>
        <Field label="Order" error={errors.order?.message}>
          <input {...register('order', { valueAsNumber: true })} type="number" className={inputCls} />
        </Field>
      </div>
      <Field label="Status" error={errors.status?.message}>
        <select {...register('status')} className={selectCls}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
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

// ── Offer form ────────────────────────────────────────────────────────────────

const OfferForm = memo(function OfferForm({
  categories,
  defaultValues,
  onSubmit,
  onCreateCategory,
  loading,
}: {
  categories: Category[];
  defaultValues?: Partial<ServiceInput>;
  onSubmit: (d: ServiceInput) => void;
  onCreateCategory: (d: ServiceCategoryInput) => Promise<Category>;
  loading: boolean;
}) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { titleNp: '', titleEn: '', category: categories[0]?._id ?? '', order: 0, status: 'draft', ...defaultValues },
  });
  const [newCatOpen, setNewCatOpen] = useState(false);
  const [creatingCat, setCreatingCat] = useState(false);
  const newCatForm = useForm<ServiceCategoryInput>({
    resolver: zodResolver(serviceCategorySchema),
    defaultValues: { nameNp: '', nameEn: '', badge: '', availability: null, availabilityEn: null, desc: null, descEn: null, inDepartments: true, order: 0, status: 'draft' },
  });
  const handleNewCatSubmit = newCatForm.handleSubmit(async (data) => {
    setCreatingCat(true);
    try {
      const created = await onCreateCategory(data);
      setValue('category', created._id);
      setNewCatOpen(false);
      newCatForm.reset();
    } finally {
      setCreatingCat(false);
    }
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Title (Nepali)" required error={errors.titleNp?.message}>
          <input {...register('titleNp')} className={inputCls} placeholder="e.g. प्राथमिक उपचार" />
        </Field>
        <Field label="Title (English)" required error={errors.titleEn?.message}>
          <input {...register('titleEn')} className={inputCls} placeholder="e.g. First aid" />
        </Field>
      </div>
      <Field label="Category" required error={errors.category?.message}>
        <div className="flex items-start gap-2">
          <select {...register('category')} className={selectCls}>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.nameNp}</option>
            ))}
          </select>
          <button type="button" onClick={() => setNewCatOpen((o) => !o)} className="shrink-0 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1">
            <IconPlus /> New Category
          </button>
        </div>
      </Field>
      {newCatOpen && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-700">Create a new category and use it for this offer</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name (Nepali)" required error={newCatForm.formState.errors.nameNp?.message}>
              <input {...newCatForm.register('nameNp')} className={inputCls} placeholder="e.g. आकस्मिक सेवा" />
            </Field>
            <Field label="Name (English)" required error={newCatForm.formState.errors.nameEn?.message}>
              <input {...newCatForm.register('nameEn')} className={inputCls} placeholder="e.g. Emergency" />
            </Field>
          </div>
          <Field label="Badge (EN short label)" error={newCatForm.formState.errors.badge?.message}>
            <input {...newCatForm.register('badge')} className={inputCls} placeholder="e.g. EMERGENCY / OPD" />
          </Field>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setNewCatOpen(false)} className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button type="button" onClick={() => handleNewCatSubmit()} disabled={creatingCat} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5">
              {creatingCat && <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
              Create &amp; Select
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Order" error={errors.order?.message}>
          <input {...register('order', { valueAsNumber: true })} type="number" className={inputCls} />
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <select {...register('status')} className={selectCls}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
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

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
);
const IconEdit = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
);
const IconTrash = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
);

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ServicesAdminPage() {
  const qc = useQueryClient();
  const [catModal, setCatModal] = useState<{ mode: 'add' | 'edit'; data?: Category } | null>(null);
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);
  const [offerFilter, setOfferFilter] = useState('');
  const [offerModal, setOfferModal] = useState<{ mode: 'add' | 'edit'; data?: Offer } | null>(null);
  const [deleteOffer, setDeleteOffer] = useState<Offer | null>(null);

  const { data: categories = [], isLoading } = useQuery({ queryKey: ['service-categories'], queryFn: fetchCategories });
  const { data: offers = [] } = useQuery({ queryKey: ['services', offerFilter], queryFn: () => fetchOffers(offerFilter) });

  const catLabel = (id: string) => categories.find((c) => c._id === id)?.nameNp ?? '—';

  const createCategory = useMutation({
    mutationFn: async (data: ServiceCategoryInput) => {
      const res = await post('/api/cms/service-categories', 'POST', data);
      if (!res.ok) throw new Error('Failed');
      return (await res.json()).category as Category;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['service-categories'] }); setCatModal(null); },
  });
  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceCategoryInput> }) => post(`/api/cms/service-categories/${id}`, 'PATCH', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['service-categories'] }); qc.invalidateQueries({ queryKey: ['services'] }); setCatModal(null); },
  });
  const removeCategory = useMutation({
    mutationFn: (id: string) => post(`/api/cms/service-categories/${id}`, 'DELETE'),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['service-categories'] }); qc.invalidateQueries({ queryKey: ['services'] }); setDeleteCat(null); },
  });

  const createOffer = useMutation({
    mutationFn: (data: ServiceInput) => post('/api/cms/services', 'POST', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['services'] }); qc.invalidateQueries({ queryKey: ['service-categories'] }); setOfferModal(null); },
  });
  const updateOffer = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceInput> }) => post(`/api/cms/services/${id}`, 'PATCH', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['services'] }); setOfferModal(null); },
  });
  const removeOffer = useMutation({
    mutationFn: (id: string) => post(`/api/cms/services/${id}`, 'DELETE'),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['services'] }); qc.invalidateQueries({ queryKey: ['service-categories'] }); setDeleteOffer(null); },
  });

  const handleCatSubmit = useCallback((data: ServiceCategoryInput) => {
    if (catModal?.mode === 'edit' && catModal.data) updateCategory.mutate({ id: catModal.data._id, data });
    else createCategory.mutate(data);
  }, [catModal, createCategory, updateCategory]);

  const handleOfferSubmit = useCallback((data: ServiceInput) => {
    if (offerModal?.mode === 'edit' && offerModal.data) updateOffer.mutate({ id: offerModal.data._id, data });
    else createOffer.mutate(data);
  }, [offerModal, createOffer, updateOffer]);

  return (
    <div className="p-6 max-w-4xl">
      <PageHeader title="Services" description="Manage service categories and the offers under each" />

      {/* Section 1: Categories */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Service Categories</h2>
            <p className="text-xs text-gray-500">OPD, Emergency, IPD … Manage the top-level categories.</p>
          </div>
          <button onClick={() => setCatModal({ mode: 'add' })} className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <IconPlus /> Add Category
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />)}</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400 rounded-xl border border-gray-200">No categories yet. Add one to get started.</div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-50 overflow-hidden">
            {categories.map((c) => (
              <div key={c._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{c.nameNp}</p>
                    <span className="text-xs text-gray-400">{c.badge}</span>
                    {!c.inDepartments && (
                      <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">hidden in departments</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {c.nameEn} · {c.serviceCount} offers
                  </p>
                </div>
                <StatusBadge status={c.status} />
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setCatModal({ mode: 'edit', data: c })} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"><IconEdit /></button>
                  <button onClick={() => setDeleteCat(c)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><IconTrash /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: Offers */}
      <section>
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Services / Offers</h2>
            <p className="text-xs text-gray-500">The individual services shown under each category.</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={offerFilter} onChange={(e) => setOfferFilter(e.target.value)} className={selectCls + ' !w-auto'}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.nameNp}</option>
              ))}
            </select>
            <button onClick={() => setOfferModal({ mode: 'add' })} className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <IconPlus /> Add Offer
            </button>
          </div>
        </div>

        {offers.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400 rounded-xl border border-gray-200">No offers yet. Add one to get started.</div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-50 overflow-hidden">
            {offers.map((s) => (
              <div key={s._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{s.titleNp}</p>
                  <p className="text-xs text-gray-500 truncate">{s.titleEn} · {catLabel(s.category)}</p>
                </div>
                <StatusBadge status={s.status} />
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setOfferModal({ mode: 'edit', data: s })} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"><IconEdit /></button>
                  <button onClick={() => setDeleteOffer(s)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><IconTrash /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      <Modal open={!!catModal} onClose={() => setCatModal(null)} title={catModal?.mode === 'edit' ? 'Edit Category' : 'Add Category'} size="lg">
        <CategoryForm defaultValues={catModal?.data} onSubmit={handleCatSubmit} loading={createCategory.isPending || updateCategory.isPending} />
      </Modal>
      <Modal open={!!offerModal} onClose={() => setOfferModal(null)} title={offerModal?.mode === 'edit' ? 'Edit Offer' : 'Add Offer'}>
        <OfferForm categories={categories} defaultValues={offerModal?.data} onSubmit={handleOfferSubmit} loading={createOffer.isPending || updateOffer.isPending} onCreateCategory={createCategory.mutateAsync} />
      </Modal>

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={!!deleteCat}
        onClose={() => setDeleteCat(null)}
        onConfirm={() => deleteCat && removeCategory.mutate(deleteCat._id)}
        message={`Delete category "${deleteCat?.nameNp}"?`}
        loading={removeCategory.isPending}
      />
      <ConfirmDialog
        open={!!deleteOffer}
        onClose={() => setDeleteOffer(null)}
        onConfirm={() => deleteOffer && removeOffer.mutate(deleteOffer._id)}
        message={`Delete offer "${deleteOffer?.titleNp}"?`}
        loading={removeOffer.isPending}
      />
    </div>
  );
}