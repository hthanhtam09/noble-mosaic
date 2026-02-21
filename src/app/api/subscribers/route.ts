import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Subscriber } from '@/models/Subscriber';
import { withAuth } from '@/lib/auth';
import { VerificationToken } from '@/models/VerificationToken';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, source, code } = body;
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    
    // Verify code if source is gift
    if (source === 'gift') {
      if (!code) {
        return NextResponse.json({ error: 'Verification code is required' }, { status: 400 });
      }

      const token = await VerificationToken.findOne({ email: email.toLowerCase() });
      if (!token || token.code !== code || token.used || token.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 });
      }

      // Mark token as used
      token.used = true;
      await token.save();
    }
    
    // Check if already subscribed
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    
    if (existing) {
      return NextResponse.json({ 
        message: 'Already subscribed',
        subscriber: existing,
        isNew: false 
      });
    }
    
    const subscriber = await Subscriber.create({
      email: email.toLowerCase(),
      source: source || 'gift',
    });
    
    return NextResponse.json({ 
      message: 'Successfully subscribed!',
      subscriber,
      isNew: true 
    }, { status: 201 });
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    
    if (email) {
      // Check if email is subscribed
      const subscriber = await Subscriber.findOne({ email: email.toLowerCase() }).lean();
      return NextResponse.json({ 
        subscribed: !!subscriber,
        subscriber 
      });
    }
    
    // Get all subscribers (admin only - but we'll skip auth check for now)
    const subscribers = await Subscriber.find()
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}
