import mongoose from 'mongoose';

export interface ISecretImage {
  _id: string;
  secretBook: mongoose.Types.ObjectId | string;
  colorImageUrl: string;
  uncolorImageUrl: string;
  originalImageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SecretImageSchema = new mongoose.Schema<ISecretImage>(
  {
    secretBook: { type: mongoose.Schema.Types.ObjectId, ref: 'SecretBook', required: true },
    colorImageUrl: { type: String, required: true },
    uncolorImageUrl: { type: String, required: true },
    originalImageUrl: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

SecretImageSchema.index({ secretBook: 1, order: 1 });
SecretImageSchema.index({ isActive: 1 });

// Delete the model if it already exists to prevent Next.js HMR from retaining the old schema
if (mongoose.models.SecretImage) {
  delete mongoose.models.SecretImage;
}
export const SecretImage = mongoose.model<ISecretImage>('SecretImage', SecretImageSchema);
