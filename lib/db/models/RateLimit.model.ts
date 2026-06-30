import mongoose, { Schema, Model, Types } from 'mongoose';

export interface IRateLimit {
  _id: Types.ObjectId;
  // Namespaced bucket, e.g. "login:203.0.113.4"
  key: string;
  count: number;
  // End of the current fixed window; doubles as the TTL expiry
  expiresAt: Date;
}

const rateLimitSchema = new Schema<IRateLimit>(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: false }
);

// TTL index: Mongo reaps expired buckets automatically (sweep runs ~every 60s)
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimit = (mongoose.models.RateLimit ??
  mongoose.model<IRateLimit>('RateLimit', rateLimitSchema)) as Model<IRateLimit>;
