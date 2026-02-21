import mongoose from 'mongoose';

export interface IColoringFolder {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ColoringFolderSchema = new mongoose.Schema<IColoringFolder>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    thumbnail: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ColoringFolderSchema.index({ slug: 1 });
ColoringFolderSchema.index({ order: 1 });

export const ColoringFolder =
  mongoose.models.ColoringFolder ||
  mongoose.model<IColoringFolder>('ColoringFolder', ColoringFolderSchema);
