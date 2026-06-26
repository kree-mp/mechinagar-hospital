import { Schema } from 'mongoose';

export interface CloudinaryFile {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

export const cloudinarySchema = new Schema<CloudinaryFile>(
  {
    url: { type: String, required: [true, 'Cloudinary URL is required'] },
    publicId: { type: String, required: [true, 'Cloudinary public ID is required'] },
    format: { type: String, required: [true, 'File format is required'] },
    bytes: {
      type: Number,
      required: [true, 'File size in bytes is required'],
      min: [0, 'File size cannot be negative'],
    },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
  },
  { _id: false }
);
