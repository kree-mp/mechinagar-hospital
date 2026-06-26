import mongoose, { Schema, Model, Types } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields, SoftDeleteMethods } from '../plugins/softDelete.plugin';
import { auditPlugin, AuditFields } from '../plugins/audit.plugin';
import { publishablePlugin, PublishableFields } from '../plugins/publishable.plugin';
import { cloudinarySchema, CloudinaryFile } from '../schemas/cloudinary.schema';

export interface INewsEvent extends SoftDeleteFields, AuditFields, PublishableFields {
  _id: Types.ObjectId;
  title: string;
  // URL-safe slug for /news/[slug] routing; auto-generated if omitted
  slug: string;
  excerpt: string;
  // Rich text / MDX body — stored as string, rendered by the frontend
  body: string | null;
  coverImage: CloudinaryFile | null;
  // Badge label shown on cards e.g. "स्वास्थ्य समाचार", "कार्यक्रम"
  label: string;
  isEvent: boolean;
  // Required when isEvent is true
  eventDate: Date | null;
  // SEO overrides — fallback to title/excerpt when blank
  seoTitle: string;
  seoDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INewsEventMethods extends SoftDeleteMethods {}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const newsEventSchema = new Schema<
  INewsEvent,
  Model<INewsEvent, object, INewsEventMethods>,
  INewsEventMethods
>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers, and hyphens'],
      maxlength: [300, 'Slug cannot exceed 300 characters'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    body: { type: String, default: null },
    coverImage: { type: cloudinarySchema, default: null },
    label: {
      type: String,
      default: '',
      trim: true,
      maxlength: [80, 'Label cannot exceed 80 characters'],
    },
    isEvent: { type: Boolean, default: false, index: true },
    eventDate: { type: Date, default: null },
    seoTitle: { type: String, default: '', trim: true, maxlength: [150, 'SEO title cannot exceed 150 characters'] },
    seoDescription: { type: String, default: '', trim: true, maxlength: [300, 'SEO description cannot exceed 300 characters'] },
  },
  { timestamps: true }
);

newsEventSchema.index({ isEvent: 1, createdAt: -1 });
newsEventSchema.index({ title: 'text', excerpt: 'text' });

// Auto-generate slug if not provided (English title → slug, fallback to timestamp)
newsEventSchema.pre('save', function () {
  if (this.isNew && !this.slug) {
    const base = toSlug(this.title);
    // Append timestamp suffix to guarantee uniqueness even with identical titles
    this.slug = base ? `${base}-${Date.now()}` : `post-${Date.now()}`;
  }
});

// Events must have an eventDate
newsEventSchema.pre('save', function () {
  if (this.isModified('isEvent') && this.isEvent && !this.eventDate) {
    throw new Error('eventDate is required when isEvent is true');
  }
});

newsEventSchema.plugin(softDeletePlugin);
newsEventSchema.plugin(auditPlugin);
newsEventSchema.plugin(publishablePlugin);

export const NewsEvent = (mongoose.models.NewsEvent ??
  mongoose.model<INewsEvent>('NewsEvent', newsEventSchema)) as Model<INewsEvent, object, INewsEventMethods>;
