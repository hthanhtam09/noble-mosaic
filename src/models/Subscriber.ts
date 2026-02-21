import mongoose from 'mongoose';

export interface ISubscriber {
  _id: string;
  email: string;
  source: string;
  downloadedPages: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberSchema = new mongoose.Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true },
    source: { type: String, default: 'gift' },
    downloadedPages: [{ type: String }],
  },
  { timestamps: true }
);

SubscriberSchema.index({ email: 1 });
SubscriberSchema.index({ createdAt: -1 });

export const Subscriber = mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);
