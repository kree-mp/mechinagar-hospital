import mongoose, { Schema, Model, Types } from "mongoose";
import {
  softDeletePlugin,
  SoftDeleteFields,
  SoftDeleteMethods,
} from "../plugins/softDelete.plugin";
import { auditPlugin, AuditFields } from "../plugins/audit.plugin";
import {
  publishablePlugin,
  PublishableFields,
} from "../plugins/publishable.plugin";
import { cloudinarySchema, CloudinaryFile } from "../schemas/cloudinary.schema";

export interface INotice
  extends SoftDeleteFields, AuditFields, PublishableFields {
  _id: Types.ObjectId;
  title: string;
  refNumber: string;
  body: string | null;
  category: Types.ObjectId;
  file: CloudinaryFile | null;
  coverPhoto: CloudinaryFile | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // virtual
  isNew: boolean;
}

export interface INoticeMethods extends SoftDeleteMethods {}

const NOTICE_NEW_WINDOW_DAYS = 30;

const noticeSchema = new Schema<
  INotice,
  Model<INotice, object, INoticeMethods>,
  INoticeMethods
>(
  {
    title: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
      maxlength: [300, "Title cannot exceed 300 characters"],
    },
    refNumber: {
      type: String,
      default: "",
      trim: true,
      maxlength: [100, "Reference number cannot exceed 100 characters"],
    },
    body: {
      type: String,
      default: null,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "NoticeCategory",
      required: [true, "Notice category is required"],
      index: true,
    },
    file: { type: cloudinarySchema, default: null },
    coverPhoto: { type: cloudinarySchema, default: null },
    // After this date the notice is considered expired; a cron job sets status → archived
    expiresAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

noticeSchema.index({ category: 1, createdAt: -1 });
noticeSchema.index({ expiresAt: 1 }, { sparse: true });

// isNew is derived — no manual flag needed
noticeSchema.virtual("isNew").get(function () {
  if (!this.publishedAt) return false;
  const cutoff = new Date(
    Date.now() - NOTICE_NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  );
  return this.publishedAt > cutoff;
});

// Validate that the referenced category exists
noticeSchema.pre("save", async function () {
  if (this.isModified("category")) {
    const exists = await mongoose.model("NoticeCategory").exists({
      _id: this.category,
      deletedAt: null,
    });
    if (!exists)
      throw new Error(
        "Referenced NoticeCategory does not exist or has been deleted",
      );
  }
});

// expiresAt must be in the future at creation time
noticeSchema.pre("save", function () {
  if (this.isNew && this.expiresAt && this.expiresAt <= new Date()) {
    throw new Error("expiresAt must be a future date");
  }
});

noticeSchema.plugin(softDeletePlugin);
noticeSchema.plugin(auditPlugin);
noticeSchema.plugin(publishablePlugin);

export const Notice = (mongoose.models.Notice ??
  mongoose.model<INotice>("Notice", noticeSchema)) as Model<INotice, object, INoticeMethods>;
