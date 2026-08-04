import mongoose, { Schema, Model, Types } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields, SoftDeleteMethods } from '../plugins/softDelete.plugin';
import { auditPlugin, AuditFields } from '../plugins/audit.plugin';
import { publishablePlugin, PublishableFields } from '../plugins/publishable.plugin';

export interface IServiceCategory extends SoftDeleteFields, AuditFields, PublishableFields {
  _id: Types.ObjectId;
  nameNp: string;
  nameEn: string;
  badge: string;
  availability: string | null;
  availabilityEn: string | null;
  desc: string | null;
  descEn: string | null;
  inDepartments: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IServiceCategoryMethods extends SoftDeleteMethods {}

const serviceCategorySchema = new Schema<
  IServiceCategory,
  Model<IServiceCategory, object, IServiceCategoryMethods>,
  IServiceCategoryMethods
>(
  {
    nameNp: {
      type: String,
      required: [true, 'Service name (Nepali) is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    nameEn: {
      type: String,
      required: [true, 'Service name (English) is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    badge: {
      type: String,
      default: '',
      trim: true,
      maxlength: [40, 'Badge cannot exceed 40 characters'],
    },
    availability: { type: String, default: null, trim: true, maxlength: [80, 'Availability cannot exceed 80 characters'] },
    availabilityEn: { type: String, default: null, trim: true, maxlength: [80, 'Availability (EN) cannot exceed 80 characters'] },
    desc: { type: String, default: null, maxlength: [1000, 'Description cannot exceed 1000 characters'] },
    descEn: { type: String, default: null, maxlength: [1000, 'Description (EN) cannot exceed 1000 characters'] },
    inDepartments: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

serviceCategorySchema.index({ order: 1 });

serviceCategorySchema.plugin(softDeletePlugin);
serviceCategorySchema.plugin(auditPlugin);
serviceCategorySchema.plugin(publishablePlugin);

export const ServiceCategory = (mongoose.models.ServiceCategory ??
  mongoose.model<IServiceCategory>(
    'ServiceCategory',
    serviceCategorySchema
  )) as Model<IServiceCategory, object, IServiceCategoryMethods>;
