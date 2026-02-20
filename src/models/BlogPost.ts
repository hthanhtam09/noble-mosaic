import mongoose from 'mongoose';

export interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new mongoose.Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: { type: String, default: 'General' },
    tags: [{ type: String }],
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

BlogPostSchema.index({ slug: 1 });
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ published: 1 });

export const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
