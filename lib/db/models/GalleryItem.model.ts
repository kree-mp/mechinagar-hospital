import mongoose, { Schema, Model, Types } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields, SoftDeleteMethods } from '../plugins/softDelete.plugin';
import { auditPlugin, AuditFields } from '../plugins/audit.plugin';
import { publishablePlugin, PublishableFields } from '../plugins/publishable.plugin';
import { cloudinarySchema, CloudinaryFile } from '../schemas/cloudinary.schema';

export interface IGalleryItem extends SoftDeleteFields, AuditFields, PublishableFields {
  _id: Types.ObjectId;
  category: Types.ObjectId;
  labelNp: string;
  labelEn: string;
  // Full media asset — image or video
  media: CloudinaryFile;
  // Separate thumbnail for video entries; null for images
  thumbnail: CloudinaryFile | null;
  isVideo: boolean;
  // CSS grid layout hints — admin controls these in the CMS
  col: string;
  row: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGalleryItemMethods extends SoftDeleteMethods {}

const galleryItemSchema = new Schema<
  IGalleryItem,
  Model<IGalleryItem, object, IGalleryItemMethods>,
  IGalleryItemMethods
>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'GalleryCategory',
      required: [true, 'Gallery category is required'],
      index: true,
    },
    labelNp: {
      type: String,
      required: [true, 'Nepali label is required'],
      trim: true,
      maxlength: [150, 'Nepali label cannot exceed 150 characters'],
    },
    labelEn: {
      type: String,
      required: [true, 'English label is required'],
      trim: true,
      maxlength: [150, 'English label cannot exceed 150 characters'],
    },
    media: {
      type: cloudinarySchema,
      required: [true, 'Media file is required'],
    },
    thumbnail: { type: cloudinarySchema, default: null },
    isVideo: { type: Boolean, default: false },
    // CSS grid column span e.g. "span 2" — kept as-is for the frontend
    col: {
      type: String,
      default: 'span 1',
      trim: true,
      maxlength: [20, 'col value cannot exceed 20 characters'],
    },
    // CSS grid row span e.g. "span 2"
    row: {
      type: String,
      default: 'span 1',
      trim: true,
      maxlength: [20, 'row value cannot exceed 20 characters'],
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

galleryItemSchema.index({ category: 1, order: 1 });

// Video items should have a thumbnail; warn by requiring it
galleryItemSchema.pre('save', function () {
  if (this.isModified('isVideo') && this.isVideo && !this.thumbnail) {
    throw new Error('thumbnail is required for video gallery items');
  }
});

// Validate that the referenced category exists
galleryItemSchema.pre('save', async function () {
  if (this.isModified('category')) {
    const exists = await mongoose.model('GalleryCategory').exists({
      _id: this.category,
      deletedAt: null,
    });
    if (!exists) throw new Error('Referenced GalleryCategory does not exist or has been deleted');
  }
});

galleryItemSchema.plugin(softDeletePlugin);
galleryItemSchema.plugin(auditPlugin);
galleryItemSchema.plugin(publishablePlugin);

export const GalleryItem = (mongoose.models.GalleryItem ??
  mongoose.model<IGalleryItem>('GalleryItem', galleryItemSchema)) as Model<IGalleryItem, object, IGalleryItemMethods>;
