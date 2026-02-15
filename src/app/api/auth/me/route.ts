import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload?.username) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, username: payload.username });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
