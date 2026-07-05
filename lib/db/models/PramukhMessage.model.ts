import mongoose, { Schema, Model, Types } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields, SoftDeleteMethods } from '../plugins/softDelete.plugin';
import { auditPlugin, AuditFields } from '../plugins/audit.plugin';
import { publishablePlugin, PublishableFields } from '../plugins/publishable.plugin';
import { cloudinarySchema, CloudinaryFile } from '../schemas/cloudinary.schema';

// Exactly one active message per role — enforced below
export type PramukhRole = 'nagar_pramukh' | 'hospital_pramukh';

export interface IPramukhMessage extends SoftDeleteFields, AuditFields, PublishableFields {
  _id: Types.ObjectId;
  role: PramukhRole;
  name: string;
  post: string;
  message: string;
  photo: CloudinaryFile | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPramukhMessageMethods extends SoftDeleteMethods {}

const PRAMUKH_ROLES: PramukhRole[] = ['nagar_pramukh', 'hospital_pramukh'];

const pramukhMessageSchema = new Schema<
  IPramukhMessage,
  Model<IPramukhMessage, object, IPramukhMessageMethods>,
  IPramukhMessageMethods
>(
  {
    role: {
      type: String,
      enum: {
        values: PRAMUKH_ROLES,
        message: '"{VALUE}" is not a valid pramukh role',
      },
      required: [true, 'Role is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    post: {
      type: String,
      required: [true, 'Post/designation is required'],
      trim: true,
      maxlength: [200, 'Post cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [4000, 'Message cannot exceed 4000 characters'],
    },
    photo: { type: cloudinarySchema, default: null },
  },
  { timestamps: true }
);

// Only one active message may exist per role at any time
pramukhMessageSchema.pre('save', async function () {
  if (!this.isModified('role')) return;

  const PramukhMessageModel = mongoose.model('PramukhMessage');
  const conflict = await PramukhMessageModel.findOne({
    role: this.role,
    _id: { $ne: this._id },
    deletedAt: null,
  });

  if (conflict) {
    throw new Error(
      `A message for role "${this.role}" already exists. ` +
      `Soft-delete or edit the existing record before assigning a new one.`
    );
  }
});

pramukhMessageSchema.plugin(softDeletePlugin);
pramukhMessageSchema.plugin(auditPlugin);
pramukhMessageSchema.plugin(publishablePlugin);

export const PramukhMessage = (mongoose.models.PramukhMessage ??
  mongoose.model<IPramukhMessage>(
    'PramukhMessage',
    pramukhMessageSchema
  )) as Model<IPramukhMessage, object, IPramukhMessageMethods>;
