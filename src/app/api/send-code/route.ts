import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { VerificationToken } from '@/models/VerificationToken';
import { sendVerificationCode } from '@/lib/mail';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Generate a 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Upsert token
    await VerificationToken.findOneAndUpdate(
      { email: email.toLowerCase() },
      { code, expiresAt, used: false },
      { upsert: true, new: true }
    );

    // Send the email
    await sendVerificationCode(email, code);

    return NextResponse.json({ message: 'Code sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json({ error: 'Failed to send code' }, { status: 500 });
  }
}
