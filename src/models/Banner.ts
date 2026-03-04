import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBanner extends Document {
  title?: string;
  subtitle?: string;
  image?: string; // Legacy
  imagePc: string;
  imageTablet: string;
  imageMobile: string;
  link: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    image: { type: String }, // Legacy
    imagePc: { type: String, required: true },
    imageTablet: { type: String, required: true },
    imageMobile: { type: String, required: true },
    link: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Add index for ordering
BannerSchema.index({ order: 1 });

const Banner: Model<IBanner> = mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);

export default Banner;
