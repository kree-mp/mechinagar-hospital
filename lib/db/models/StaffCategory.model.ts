import mongoose, { Schema, Model, Types } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields, SoftDeleteMethods } from '../plugins/softDelete.plugin';
import { auditPlugin, AuditFields } from '../plugins/audit.plugin';

export interface IStaffCategory extends SoftDeleteFields, AuditFields {
  _id: Types.ObjectId;
  slug: string;
  labelNp: string;
  labelEn: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStaffCategoryMethods extends SoftDeleteMethods {}

const staffCategorySchema = new Schema<IStaffCategory, Model<IStaffCategory, object, IStaffCategoryMethods>, IStaffCategoryMethods>(
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

staffCategorySchema.index({ order: 1 });

// Auto-generate slug from labelEn if not explicitly provided
staffCategorySchema.pre('save', function () {
  if (this.isNew && !this.slug && this.labelEn) {
    this.slug = this.labelEn
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }
});

staffCategorySchema.plugin(softDeletePlugin);
staffCategorySchema.plugin(auditPlugin);

export const StaffCategory = (mongoose.models.StaffCategory ??
  mongoose.model<IStaffCategory>('StaffCategory', staffCategorySchema)) as Model<IStaffCategory, object, IStaffCategoryMethods>;
