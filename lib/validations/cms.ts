import { z } from 'zod';

const slug = z.string().min(1).max(60).regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers, and hyphens');
const labelNp = z.string().min(1, 'Nepali label is required').max(100);
const labelEn = z.string().min(1, 'English label is required').max(100);
const status = z.enum(['draft', 'published', 'archived']);
const nullableDatetime = z.union([
  z.null(),
  z.literal('').transform((): null => null),
  z.string().datetime({ offset: true }),
]);

const cloudinaryFile = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  format: z.string().min(1),
  bytes: z.number().min(0),
  width: z.number().optional(),
  height: z.number().optional(),
});

// ── Staff ──────────────────────────────────────────────────────────────────────

export const staffCategorySchema = z.object({
  slug: slug.optional(),
  labelNp,
  labelEn,
  order: z.number().int(),
});

export const staffSchema = z.object({
  nameNp: z.string().min(1, 'Name is required').max(150),
  post: z.string().min(1, 'Post is required').max(150),
  category: z.string().min(1, 'Category is required'),
  order: z.number().int(),
  status,
  photo: cloudinaryFile.nullable(),
});

export const staffPatchSchema = staffSchema.partial();

// ── Management ─────────────────────────────────────────────────────────────────

export const managementSchema = z.object({
  nameNp: z.string().min(1, 'Name is required').max(150),
  post: z.string().min(1, 'Post is required').max(150),
  role: z.enum(['chief', 'president', 'vp', 'member']),
  order: z.number().int(),
  status,
  photo: cloudinaryFile.nullable(),
});

export const managementPatchSchema = managementSchema.partial();

// ── Pramukh Messages ───────────────────────────────────────────────────────────

export const pramukhMessageSchema = z.object({
  role: z.enum(['nagar_pramukh', 'hospital_pramukh']),
  name: z.string().min(1, 'Name is required').max(150),
  post: z.string().min(1, 'Post is required').max(200),
  message: z.string().min(1, 'Message is required').max(4000),
  status,
  photo: cloudinaryFile,
});

export const pramukhMessagePatchSchema = pramukhMessageSchema.partial();

// ── Notices ────────────────────────────────────────────────────────────────────

export const noticeCategorySchema = z.object({
  slug: slug.optional(),
  labelNp,
  labelEn,
  order: z.number().int(),
});

export const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  refNumber: z.string().max(100),
  body: z.string().nullable(),
  category: z.string().min(1, 'Category is required'),
  file: cloudinaryFile.nullable(),
  expiresAt: nullableDatetime,
  status,
});

export const noticePatchSchema = noticeSchema.partial();

// ── Downloads ──────────────────────────────────────────────────────────────────

export const downloadCategorySchema = z.object({
  slug: slug.optional(),
  labelNp,
  labelEn,
  order: z.number().int(),
});

export const downloadSchema = z.object({
  titleNp: z.string().min(1, 'Nepali title is required').max(250),
  titleEn: z.string().max(250),
  category: z.string().min(1, 'Category is required'),
  file: cloudinaryFile,
  fiscalYear: z.string().max(20),
  status,
});

export const downloadPatchSchema = downloadSchema.partial();

// ── News & Events ──────────────────────────────────────────────────────────────

export const newsEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  slug: z.string().max(300).optional(),
  excerpt: z.string().min(1, 'Excerpt is required').max(500),
  body: z.string().nullable(),
  coverImage: cloudinaryFile.nullable(),
  label: z.string().max(80),
  isEvent: z.boolean(),
  eventDate: nullableDatetime,
  seoTitle: z.string().max(150),
  seoDescription: z.string().max(300),
  status,
});

export const newsEventPatchSchema = newsEventSchema.partial();

// ── Types ──────────────────────────────────────────────────────────────────────

// ── Gallery ────────────────────────────────────────────────────────────────────

export const galleryCategorySchema = z.object({
  slug: slug.optional(),
  labelNp,
  labelEn,
  order: z.number().int(),
});

export const galleryItemSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  labelNp: z.string().min(1, 'Nepali label is required').max(150),
  labelEn: z.string().min(1, 'English label is required').max(150),
  media: cloudinaryFile,
  thumbnail: cloudinaryFile.nullable(),
  isVideo: z.boolean(),
  col: z.string().max(20),
  row: z.string().max(20),
  order: z.number().int(),
  status,
}).refine((d) => !d.isVideo || d.thumbnail !== null, {
  message: 'Thumbnail is required for video items',
  path: ['thumbnail'],
});

export const galleryItemPatchSchema = z.object({
  category: z.string().min(1).optional(),
  labelNp: z.string().min(1).max(150).optional(),
  labelEn: z.string().min(1).max(150).optional(),
  media: cloudinaryFile.optional(),
  thumbnail: cloudinaryFile.nullable().optional(),
  isVideo: z.boolean().optional(),
  col: z.string().max(20).optional(),
  row: z.string().max(20).optional(),
  order: z.number().int().optional(),
  status: status.optional(),
});

// ── Types ──────────────────────────────────────────────────────────────────────

export type StaffCategoryInput = z.infer<typeof staffCategorySchema>;
export type StaffInput = z.infer<typeof staffSchema>;
export type ManagementInput = z.infer<typeof managementSchema>;
export type PramukhMessageInput = z.infer<typeof pramukhMessageSchema>;
export type NoticeCategoryInput = z.infer<typeof noticeCategorySchema>;
export type NoticeInput = z.infer<typeof noticeSchema>;
export type DownloadCategoryInput = z.infer<typeof downloadCategorySchema>;
export type DownloadInput = z.infer<typeof downloadSchema>;
export type NewsEventInput = z.infer<typeof newsEventSchema>;
export type GalleryCategoryInput = z.infer<typeof galleryCategorySchema>;
export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
export type CloudinaryFileInput = z.infer<typeof cloudinaryFile>;
