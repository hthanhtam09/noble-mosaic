import mongoose from 'mongoose';

export interface IColoringPage {
  _id: string;
  title: string;
  imageUrl: string;
  publicId: string;
  folder: mongoose.Types.ObjectId | string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ColoringPageSchema = new mongoose.Schema<IColoringPage>(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'ColoringFolder', required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ColoringPageSchema.index({ folder: 1, order: 1 });

export const ColoringPage =
  mongoose.models.ColoringPage ||
  mongoose.model<IColoringPage>('ColoringPage', ColoringPageSchema);
