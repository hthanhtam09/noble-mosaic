import mongoose from 'mongoose';

export interface ISecretBook {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  secretKey?: string;
  amazonUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SecretBookSchema = new mongoose.Schema<ISecretBook>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    coverImage: { type: String, required: true },
    secretKey: { type: String, maxlength: 6 },
    amazonUrl: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

SecretBookSchema.index({ slug: 1 });
SecretBookSchema.index({ isActive: 1 });

export const SecretBook =
  mongoose.models.SecretBook ||
  mongoose.model<ISecretBook>('SecretBook', SecretBookSchema);
