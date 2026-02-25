import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Contact } from '@/models/Contact';
import { withAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, message } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    
    const contact = await Contact.create({
      name,
      email,
      message,
    });
    
    return NextResponse.json({ 
      message: 'Thank you for contacting us! We will get back to you soon.',
      contact 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}

export const GET = withAuth(async (request: NextRequest) => {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const unread = searchParams.get('unread');
    
    const query: Record<string, unknown> = {};
    
    if (unread === 'true') {
      query.read = false;
    }
    
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
});
export const PATCH = withAuth(async (request: NextRequest) => {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id, read } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { read: !!read },
      { new: true }
    );
    
    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }
    
    return NextResponse.json({ contact });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
});
