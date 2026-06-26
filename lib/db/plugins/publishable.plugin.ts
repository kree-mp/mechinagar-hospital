import { Schema, Types } from 'mongoose';

export type PublishStatus = 'draft' | 'published' | 'archived';

export interface PublishableFields {
  status: PublishStatus;
  publishedAt: Date | null;
  publishedBy: Types.ObjectId | null;
  scheduledAt: Date | null;
}

export function publishablePlugin(schema: Schema): void {
  schema.add({
    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'archived'],
        message: '"{VALUE}" is not a valid status. Use draft, published, or archived.',
      },
      default: 'draft',
      index: true,
    },
    publishedAt: { type: Date, default: null },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    // optional: set a future date — a cron job flips status → published at this time
    scheduledAt: { type: Date, default: null },
  });

  // Auto-stamp publishedAt the first time a document transitions to published
  schema.pre('save', function (this: Record<string, unknown> & { isModified: (f: string) => boolean }) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
      this.publishedAt = new Date();
    }
  });
}
