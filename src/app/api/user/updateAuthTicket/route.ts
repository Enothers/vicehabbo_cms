import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const authTicket = body.auth_ticket;

    let payload;
    try {
      payload = await verifyToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = (payload as any).userId;
    const pool = getPool();

    await pool.query('UPDATE users SET auth_ticket = ? WHERE id = ?', [authTicket, userId]);

    return NextResponse.json({ success: true, auth_ticket: authTicket });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
