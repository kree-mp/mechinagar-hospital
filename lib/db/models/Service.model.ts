import mongoose, { Schema, Model, Types } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields, SoftDeleteMethods } from '../plugins/softDelete.plugin';
import { auditPlugin, AuditFields } from '../plugins/audit.plugin';
import { publishablePlugin, PublishableFields } from '../plugins/publishable.plugin';

export interface IService extends SoftDeleteFields, AuditFields, PublishableFields {
  _id: Types.ObjectId;
  titleNp: string;
  titleEn: string;
  category: Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IServiceMethods extends SoftDeleteMethods {}

const serviceSchema = new Schema<IService, Model<IService, object, IServiceMethods>, IServiceMethods>(
  {
    titleNp: {
      type: String,
      required: [true, 'Service title (Nepali) is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    titleEn: {
      type: String,
      required: [true, 'Service title (English) is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      required: [true, 'Service category is required'],
      index: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

serviceSchema.index({ category: 1, order: 1 });

// Validate that the referenced ServiceCategory exists and is not soft-deleted
serviceSchema.pre('save', async function () {
  if (this.isModified('category')) {
    const exists = await mongoose.model('ServiceCategory').exists({
      _id: this.category,
      deletedAt: null,
    });
    if (!exists) throw new Error('Referenced ServiceCategory does not exist or has been deleted');
  }
});

serviceSchema.plugin(softDeletePlugin);
serviceSchema.plugin(auditPlugin);
serviceSchema.plugin(publishablePlugin);

export const Service = (mongoose.models.Service ??
  mongoose.model<IService>('Service', serviceSchema)) as Model<IService, object, IServiceMethods>;
