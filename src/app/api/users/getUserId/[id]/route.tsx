import { NextResponse } from 'next/server';
import { getPool } from '../../../../../lib/db';
import { verifyToken } from '../../../../../lib/auth';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
      await verifyToken(token);
    } catch (e) {
      return NextResponse.json({ error: 'Token verification failed' }, { status: 401 });
    }

    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const userId = pathSegments[pathSegments.length - 1];

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in params' }, { status: 400 });
    }

    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

    if ((rows as any).length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const bruteUser = (rows as any)[0];
    const user = {
      id: bruteUser.id,
      username: bruteUser.username,
      account_created: bruteUser.account_created,
      motto: bruteUser.motto,
      look: bruteUser.look,
      credits: bruteUser.credits,
      pixels: bruteUser.pixels,
      points: bruteUser.points,
      online: bruteUser.online,
    };

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error(`Error in GET /api/users/getUserId/[id]:`, {
      errorMessage: error.message,
      errorStack: error.stack,
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
