import { NextRequest, NextResponse } from 'next/server';
import { signToken, verifyToken } from '@/lib/auth';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // Check credentials
    const validUsername = process.env.ADMIN_USERNAME || 'shin';
    const validPassword = process.env.ADMIN_PASSWORD || '123456';
    
    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }
    
    const token = await signToken({ role: 'admin', username });
    
    const response = NextResponse.json({ 
      message: 'Logged in successfully',
      user: { username, role: 'admin' }
    });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const token = (await cookieStore).get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json({ authenticated: false });
    }
    
    const payload = await verifyToken(token);
    
    if (!payload) {
      return NextResponse.json({ authenticated: false });
    }
    
    return NextResponse.json({ 
      authenticated: true,
      user: payload
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.delete('admin_token');
    return response;
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
