import mongoose from 'mongoose';

export interface IContact {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new mongoose.Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ContactSchema.index({ read: 1 });
ContactSchema.index({ createdAt: -1 });

export const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
