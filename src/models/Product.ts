import mongoose from 'mongoose';

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  coverImage: string;
  galleryImages: string[];
  amazonLink: string;
  aPlusContent: (string | {
    type: 'fullWidth' | 'twoColumn' | 'featureHighlight' | 'lifestyle';
    title?: string;
    content?: string;
    image?: string;
    images?: string[];
    items?: { title: string; description: string; icon?: string }[];
  })[];
  rating?: number;
  reviewCount?: number;
  price?: string;
  featured?: boolean;
  showRating: boolean;
  editions?: {
    name: string;
    link: string;
    price?: string;
    coverImage?: string;
    aPlusContent?: (string | any)[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    coverImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    amazonLink: { type: String, required: true },
    aPlusContent: [{
      type: mongoose.Schema.Types.Mixed
    }],
    rating: { type: Number },
    reviewCount: { type: Number },
    price: { type: String },
    featured: { type: Boolean, default: false },
    showRating: { type: Boolean, default: true },
    editions: [{
      name: { type: String, required: true },
      link: { type: String, required: true },
      price: { type: String },
      coverImage: { type: String },
      aPlusContent: [{ type: mongoose.Schema.Types.Mixed }]
    }],
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });

// For Next.js hot reloading: delete the model to force registration with updated schema
if (process.env.NODE_ENV === 'development' && mongoose.models.Product) {
  delete (mongoose.models as any).Product;
}

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
