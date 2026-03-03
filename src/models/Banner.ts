import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  imageUrl: string;
  publicId: string;
  link?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    link: { type: String, required: false, default: '' },
    order: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);
