import mongoose, { Schema, Model, Types } from 'mongoose';

export type SecurityEvent =
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'password_changed'
  | 'account_locked'
  | 'token_revoked'
  | 'permission_changed';

export interface ISecurityLog {
  _id: Types.ObjectId;
  event: SecurityEvent;
  // Nullable: failed logins with an unknown email have no userId
  userId: Types.ObjectId | null;
  // Always captured, even when userId is null
  email: string;
  ip: string;
  userAgent: string;
  // Arbitrary context: { reason, attemptCount, changedRole, etc. }
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

const securityLogSchema = new Schema<ISecurityLog>(
  {
    event: {
      type: String,
      enum: {
        values: [
          'login_success',
          'login_failed',
          'logout',
          'password_changed',
          'account_locked',
          'token_revoked',
          'permission_changed',
        ],
        message: '"{VALUE}" is not a recognized security event',
      },
      required: [true, 'Security event type is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    email: {
      type: String,
      default: '',
      lowercase: true,
      trim: true,
    },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Brute-force detection: all failed logins from one IP in a time window
securityLogSchema.index({ ip: 1, event: 1, createdAt: -1 });
securityLogSchema.index({ userId: 1, createdAt: -1 });

const immutableError = (): never => {
  throw new Error('SecurityLog records are immutable and cannot be modified');
};
securityLogSchema.pre('updateOne', immutableError);
securityLogSchema.pre('updateMany', immutableError);
securityLogSchema.pre('findOneAndUpdate', immutableError);
securityLogSchema.pre('replaceOne', immutableError);

export const SecurityLog = (mongoose.models.SecurityLog ??
  mongoose.model<ISecurityLog>('SecurityLog', securityLogSchema)) as Model<ISecurityLog>;
