import mongoose from 'mongoose';

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  theme?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  coverImage: string;
  galleryImages: string[];
  amazonLink: string;
  bulletPoints: string[];
  aPlusContent: {
    type: 'fullWidth' | 'twoColumn' | 'featureHighlight' | 'lifestyle';
    title?: string;
    content?: string;
    image?: string;
    images?: string[];
    items?: { title: string; description: string; icon?: string }[];
  }[];
  rating?: number;
  reviewCount?: number;
  price?: string;
  featured?: boolean;
  editions?: {
    name: string;
    link: string;
    price?: string;
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
    theme: { type: String, default: 'General' },
    difficulty: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    coverImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    amazonLink: { type: String, required: true },
    bulletPoints: [{ type: String }],
    aPlusContent: [{
      type: { type: String, required: true },
      title: { type: String },
      content: { type: String },
      image: { type: String },
      images: [{ type: String }],
      items: [{
        title: { type: String },
        description: { type: String },
        icon: { type: String }
      }]
    }],
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    price: { type: String },
    featured: { type: Boolean, default: false },
    editions: [{
      name: { type: String, required: true },
      link: { type: String, required: true },
      price: { type: String }
    }],
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ theme: 1 });
ProductSchema.index({ difficulty: 1 });
ProductSchema.index({ featured: 1 });

// For Next.js hot reloading: delete the model to force registration with updated schema
if (process.env.NODE_ENV === 'development' && mongoose.models.Product) {
  delete (mongoose.models as any).Product;
}

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
