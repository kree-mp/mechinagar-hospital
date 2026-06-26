import { Schema, Query, Types } from 'mongoose';

export interface SoftDeleteFields {
  deletedAt: Date | null;
  deletedBy: Types.ObjectId | null;
}

export interface SoftDeleteMethods {
  softDelete(deletedBy: Types.ObjectId | string): Promise<this>;
  restore(): Promise<this>;
  isDeleted(): boolean;
}

export function softDeletePlugin(schema: Schema): void {
  schema.add({
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  });

  schema.index({ deletedAt: 1 });

  // Automatically exclude soft-deleted documents from all reads unless opted out
  const applyFilter = function (this: Query<unknown, unknown>): void {
    if (!this.getOptions().includeSoftDeleted) {
      this.where({ deletedAt: null });
    }
  };

  schema.pre('find', applyFilter);
  schema.pre('findOne', applyFilter);
  schema.pre('findOneAndUpdate', applyFilter);
  schema.pre('findOneAndDelete', applyFilter);
  schema.pre('countDocuments', applyFilter);

  schema.methods.softDelete = async function (
    this: SoftDeleteFields & { save(): Promise<unknown> },
    deletedBy: Types.ObjectId | string
  ): Promise<unknown> {
    this.deletedAt = new Date();
    this.deletedBy = deletedBy as Types.ObjectId;
    return this.save();
  };

  schema.methods.restore = async function (
    this: SoftDeleteFields & { save(): Promise<unknown> }
  ): Promise<unknown> {
    this.deletedAt = null;
    this.deletedBy = null;
    return this.save();
  };

  schema.methods.isDeleted = function (this: SoftDeleteFields): boolean {
    return this.deletedAt !== null;
  };
}
