import mongoose, { Schema, Model, Types } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields, SoftDeleteMethods } from '../plugins/softDelete.plugin';
import { auditPlugin, AuditFields } from '../plugins/audit.plugin';

export interface IDownloadCategory extends SoftDeleteFields, AuditFields {
  _id: Types.ObjectId;
  slug: string;
  labelNp: string;
  labelEn: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDownloadCategoryMethods extends SoftDeleteMethods {}

const downloadCategorySchema = new Schema<
  IDownloadCategory,
  Model<IDownloadCategory, object, IDownloadCategoryMethods>,
  IDownloadCategoryMethods
>(
  {
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers, and hyphens'],
      maxlength: [60, 'Slug cannot exceed 60 characters'],
    },
    labelNp: {
      type: String,
      required: [true, 'Nepali label is required'],
      trim: true,
      maxlength: [100, 'Nepali label cannot exceed 100 characters'],
    },
    labelEn: {
      type: String,
      required: [true, 'English label is required'],
      trim: true,
      maxlength: [100, 'English label cannot exceed 100 characters'],
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

downloadCategorySchema.index({ order: 1 });

downloadCategorySchema.pre('save', function () {
  if (this.isNew && !this.slug && this.labelEn) {
    this.slug = this.labelEn
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }
});

downloadCategorySchema.plugin(softDeletePlugin);
downloadCategorySchema.plugin(auditPlugin);

export const DownloadCategory = (mongoose.models.DownloadCategory ??
  mongoose.model<IDownloadCategory>(
    'DownloadCategory',
    downloadCategorySchema
  )) as Model<IDownloadCategory, object, IDownloadCategoryMethods>;
