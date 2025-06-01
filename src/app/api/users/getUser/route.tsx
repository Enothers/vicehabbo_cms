import { NextResponse } from 'next/server';
import { getPool } from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let payload;
    try {
      payload = await verifyToken(token);
    } catch (verifyError) {
      return NextResponse.json({ error: 'Token verification failed' }, { status: 401 });
    }

    if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    const userId = (payload as any).userId;
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

    if ((rows as any).length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = (rows as any)[0];
    delete user.password;

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}