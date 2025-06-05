import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const username = decodeURIComponent(pathSegments[pathSegments.length - 1]);

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const pool = getPool();
    const [rows] = await pool.query('SELECT look FROM users WHERE username = ?', [username]);

    if ((rows as any).length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const look = (rows as any)[0].look;
    return NextResponse.json({ look });
  } catch (error: any) {
    console.error('Error in getLookByUsername:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
