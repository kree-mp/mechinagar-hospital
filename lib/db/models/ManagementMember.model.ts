import mongoose, { Schema, Model, Types } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields, SoftDeleteMethods } from '../plugins/softDelete.plugin';
import { auditPlugin, AuditFields } from '../plugins/audit.plugin';
import { publishablePlugin, PublishableFields } from '../plugins/publishable.plugin';
import { cloudinarySchema, CloudinaryFile } from '../schemas/cloudinary.schema';

// Roles where only ONE active member may exist at any time
export type SingletonRole = 'chief' | 'president' | 'vp';
export type ManagementRole = SingletonRole | 'member';

export interface IManagementMember extends SoftDeleteFields, AuditFields, PublishableFields {
  _id: Types.ObjectId;
  nameNp: string;
  post: string;
  role: ManagementRole;
  photo: CloudinaryFile | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IManagementMemberMethods extends SoftDeleteMethods {}

const SINGLETON_ROLES: SingletonRole[] = ['chief', 'president', 'vp'];

const managementMemberSchema = new Schema<
  IManagementMember,
  Model<IManagementMember, object, IManagementMemberMethods>,
  IManagementMemberMethods
>(
  {
    nameNp: {
      type: String,
      required: [true, 'Member name (Nepali) is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    post: {
      type: String,
      required: [true, 'Post/designation is required'],
      trim: true,
      maxlength: [150, 'Post cannot exceed 150 characters'],
    },
    role: {
      type: String,
      enum: {
        values: ['chief', 'president', 'vp', 'member'] as ManagementRole[],
        message: '"{VALUE}" is not a valid management role',
      },
      required: [true, 'Role is required'],
      index: true,
    },
    photo: { type: cloudinarySchema, default: null },
    // order only meaningful for regular members
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

managementMemberSchema.index({ role: 1, order: 1 });

// Enforce at most one active chief, president, and vp at any time.
managementMemberSchema.pre('save', async function () {
  if (!this.isModified('role')) return;
  if (!SINGLETON_ROLES.includes(this.role as SingletonRole)) return;

  const ManagementMemberModel = mongoose.model('ManagementMember');
  const conflict = await ManagementMemberModel.findOne({
    role: this.role,
    _id: { $ne: this._id },
    deletedAt: null,
  });

  if (conflict) {
    throw new Error(
      `A member with role "${this.role}" already exists. ` +
      `Soft-delete or reassign the existing record before assigning a new one.`
    );
  }
});

managementMemberSchema.plugin(softDeletePlugin);
managementMemberSchema.plugin(auditPlugin);
managementMemberSchema.plugin(publishablePlugin);

export const ManagementMember = (mongoose.models.ManagementMember ??
  mongoose.model<IManagementMember>(
    'ManagementMember',
    managementMemberSchema
  )) as Model<IManagementMember, object, IManagementMemberMethods>;
