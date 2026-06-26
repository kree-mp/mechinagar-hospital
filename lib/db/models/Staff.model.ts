import mongoose, { Schema, Model, Types } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields, SoftDeleteMethods } from '../plugins/softDelete.plugin';
import { auditPlugin, AuditFields } from '../plugins/audit.plugin';
import { publishablePlugin, PublishableFields } from '../plugins/publishable.plugin';
import { cloudinarySchema, CloudinaryFile } from '../schemas/cloudinary.schema';

export interface IStaff extends SoftDeleteFields, AuditFields, PublishableFields {
  _id: Types.ObjectId;
  nameNp: string;
  post: string;
  category: Types.ObjectId;
  photo: CloudinaryFile | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStaffMethods extends SoftDeleteMethods {}

const staffSchema = new Schema<IStaff, Model<IStaff, object, IStaffMethods>, IStaffMethods>(
  {
    nameNp: {
      type: String,
      required: [true, 'Staff name (Nepali) is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    post: {
      type: String,
      required: [true, 'Post/designation is required'],
      trim: true,
      maxlength: [150, 'Post cannot exceed 150 characters'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'StaffCategory',
      required: [true, 'Staff category is required'],
      index: true,
    },
    photo: { type: cloudinarySchema, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

staffSchema.index({ category: 1, order: 1 });
staffSchema.index({ nameNp: 'text', post: 'text' });

// Validate that the referenced StaffCategory exists and is not soft-deleted
staffSchema.pre('save', async function () {
  if (this.isModified('category')) {
    const exists = await mongoose.model('StaffCategory').exists({
      _id: this.category,
      deletedAt: null,
    });
    if (!exists) throw new Error('Referenced StaffCategory does not exist or has been deleted');
  }
});

staffSchema.plugin(softDeletePlugin);
staffSchema.plugin(auditPlugin);
staffSchema.plugin(publishablePlugin);

export const Staff = (mongoose.models.Staff ??
  mongoose.model<IStaff>('Staff', staffSchema)) as Model<IStaff, object, IStaffMethods>;
