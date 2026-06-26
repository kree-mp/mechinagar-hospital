import mongoose, { Schema, Model, Types } from 'mongoose';
import { softDeletePlugin, SoftDeleteFields, SoftDeleteMethods } from '../plugins/softDelete.plugin';
import { auditPlugin, AuditFields } from '../plugins/audit.plugin';
import { publishablePlugin, PublishableFields } from '../plugins/publishable.plugin';
import { cloudinarySchema, CloudinaryFile } from '../schemas/cloudinary.schema';

export interface IDownload extends SoftDeleteFields, AuditFields, PublishableFields {
  _id: Types.ObjectId;
  titleNp: string;
  titleEn: string;
  category: Types.ObjectId;
  file: CloudinaryFile;
  // Nepali fiscal year e.g. "२०८०/८१" — display only, not parsed
  fiscalYear: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDownloadMethods extends SoftDeleteMethods {}

const downloadSchema = new Schema<IDownload, Model<IDownload, object, IDownloadMethods>, IDownloadMethods>(
  {
    titleNp: {
      type: String,
      required: [true, 'Nepali title is required'],
      trim: true,
      maxlength: [250, 'Nepali title cannot exceed 250 characters'],
    },
    titleEn: {
      type: String,
      default: '',
      trim: true,
      maxlength: [250, 'English title cannot exceed 250 characters'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'DownloadCategory',
      required: [true, 'Download category is required'],
      index: true,
    },
    file: {
      type: cloudinarySchema,
      required: [true, 'File is required'],
    },
    fiscalYear: {
      type: String,
      default: '',
      trim: true,
      maxlength: [20, 'Fiscal year string cannot exceed 20 characters'],
    },
  },
  { timestamps: true }
);

downloadSchema.index({ category: 1, createdAt: -1 });
downloadSchema.index({ fiscalYear: 1 });

downloadSchema.pre('save', async function () {
  if (this.isModified('category')) {
    const exists = await mongoose.model('DownloadCategory').exists({
      _id: this.category,
      deletedAt: null,
    });
    if (!exists) throw new Error('Referenced DownloadCategory does not exist or has been deleted');
  }
});

downloadSchema.plugin(softDeletePlugin);
downloadSchema.plugin(auditPlugin);
downloadSchema.plugin(publishablePlugin);

export const Download = (mongoose.models.Download ??
  mongoose.model<IDownload>('Download', downloadSchema)) as Model<IDownload, object, IDownloadMethods>;
