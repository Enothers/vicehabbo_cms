import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
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
    } catch (e: any) {
      return NextResponse.json({ error: 'Token verification failed' }, { status: 401 });
    }

    // Récupère l'id depuis l'URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const userId = pathSegments[pathSegments.length - 1];

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in URL' }, { status: 400 });
    }

    const pool = getPool();
    const [badgeRows] = await pool.query(
      'SELECT badge_code, slot_id FROM users_badges WHERE user_id = ? AND slot_id != 0',
      [userId]
    );

    return NextResponse.json({ badgeRows });
  } catch (error: any) {
    console.error(`Error in GET /api/users/getBadgesId/[id]:`, {
      errorMessage: error.message,
      errorStack: error.stack
    });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
