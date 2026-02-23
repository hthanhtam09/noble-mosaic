import mongoose from 'mongoose';

export interface IGiftLink {
  _id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GiftLinkSchema = new mongoose.Schema<IGiftLink>(
  {
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String, required: true },
    thumbnail: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

GiftLinkSchema.index({ order: 1 });
GiftLinkSchema.index({ isActive: 1 });

export const GiftLink =
  mongoose.models.GiftLink ||
  mongoose.model<IGiftLink>('GiftLink', GiftLinkSchema);
