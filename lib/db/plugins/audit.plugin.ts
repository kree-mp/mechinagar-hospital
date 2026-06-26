import { Schema, Types } from 'mongoose';

export interface AuditFields {
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId | null;
}

export function auditPlugin(schema: Schema): void {
  schema.add({
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'createdBy is required'],
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  });
}
