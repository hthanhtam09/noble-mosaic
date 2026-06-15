import mongoose from "mongoose";

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  generalDescription?: string;
  shortDescription?: string;
  coverImage: string;
  galleryImages: string[];
  amazonLink: string;
  asin?: string;
  reviewId?: number;
  dimensions?: string;
  printLength?: string;
  aPlusContent: (
    | string
    | {
        url: string;
        size: "970x600" | "970x300";
      }
    | {
        type: "fullWidth" | "twoColumn" | "featureHighlight" | "lifestyle";
        title?: string;
        content?: string;
        image?: string;
        images?: string[];
        items?: { title: string; description: string; icon?: string }[];
      }
  )[];
  rating?: number;
  reviewCount?: number;
  price?: string;
  featured?: boolean;
  isComingSoon?: boolean;
  showRating: boolean;
  editions?: {
    name: string;
    description?: string;
    link: string;
    asin?: string;
    price?: string;
    coverImage?: string;
    aPlusContent?: any[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    generalDescription: { type: String },
    shortDescription: { type: String },
    coverImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    amazonLink: { type: String, required: true },
    asin: { type: String },
    reviewId: { type: Number, unique: true, sparse: true },
    dimensions: { type: String },
    printLength: { type: String },
    aPlusContent: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],
    rating: { type: Number },
    reviewCount: { type: Number },
    price: { type: String },
    featured: { type: Boolean, default: false },
    isComingSoon: { type: Boolean, default: false },
    showRating: { type: Boolean, default: true },
    editions: [
      {
        name: { type: String, required: true },
        description: { type: String },
        link: { type: String, required: true },
        asin: { type: String },
        price: { type: String },
        coverImage: { type: String },
        aPlusContent: [{ type: mongoose.Schema.Types.Mixed }],
      },
    ],
  },
  { timestamps: true },
);



// For Next.js hot reloading: delete the model to force registration with updated schema
if (process.env.NODE_ENV === "development" && mongoose.models.Product) {
  delete (mongoose.models as any).Product;
}

export const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
