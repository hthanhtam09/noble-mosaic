import mongoose from 'mongoose';

export interface IVerificationToken {
  email: string;
  code: string;
  expiresAt: Date;
  used: boolean;
}

const VerificationTokenSchema = new mongoose.Schema<IVerificationToken>(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

VerificationTokenSchema.index({ email: 1 });

export const VerificationToken = mongoose.models.VerificationToken || mongoose.model<IVerificationToken>('VerificationToken', VerificationTokenSchema);
