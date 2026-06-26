import mongoose, { Schema, Model, Types } from 'mongoose';

export type ActivityAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'restore'
  | 'publish'
  | 'unpublish'
  | 'archive'
  | 'upload'
  | 'schedule';

export interface IActivityLog {
  _id: Types.ObjectId;
  actor: Types.ObjectId;
  action: ActivityAction;
  collection: string;
  documentId: Types.ObjectId;
  // Denormalized snapshot — remains readable even if the document is later hard-deleted
  documentTitle: string;
  // Only changed fields: { fieldName: { from: unknown; to: unknown } }
  diff: Record<string, { from: unknown; to: unknown }> | null;
  ip: string;
  userAgent: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Actor (user) is required'],
      index: true,
    },
    action: {
      type: String,
      enum: {
        values: ['create', 'update', 'delete', 'restore', 'publish', 'unpublish', 'archive', 'upload', 'schedule'],
        message: '"{VALUE}" is not a recognized activity action',
      },
      required: [true, 'Action is required'],
    },
    collection: {
      type: String,
      required: [true, 'Collection name is required'],
      trim: true,
    },
    documentId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Document ID is required'],
    },
    documentTitle: {
      type: String,
      default: '',
      trim: true,
    },
    diff: {
      type: Schema.Types.Mixed,
      default: null,
    },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  {
    // Only createdAt — logs are append-only and never mutated
    timestamps: { createdAt: true, updatedAt: false },
  }
);

activityLogSchema.index({ actor: 1, createdAt: -1 });
activityLogSchema.index({ collection: 1, documentId: 1, createdAt: -1 });

// Immutability guard — throw if anyone tries to update a log entry
const immutableError = (): never => {
  throw new Error('ActivityLog records are immutable and cannot be modified');
};
activityLogSchema.pre('updateOne', immutableError);
activityLogSchema.pre('updateMany', immutableError);
activityLogSchema.pre('findOneAndUpdate', immutableError);
activityLogSchema.pre('replaceOne', immutableError);

export const ActivityLog = (mongoose.models.ActivityLog ??
  mongoose.model<IActivityLog>('ActivityLog', activityLogSchema)) as Model<IActivityLog>;
