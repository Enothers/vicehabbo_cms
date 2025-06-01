import { NextResponse } from 'next/server';
import { getPool } from '../../../../lib/db';
import { comparePassword, signToken } from '../../../../lib/auth';
import { serialize } from 'cookie';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Merci de remplir les champs vides.' }, { status: 400 });
  }

  const pool = getPool();

  const [rows] = await pool.query('SELECT id, password FROM users WHERE username = ?', [username]);

  if ((rows as any).length === 0) {
    return NextResponse.json({ error: 'Les identifiants sont incorrects.' }, { status: 401 });
  }

  const user = (rows as any)[0];
  const valid = await comparePassword(password, user.password);

  if (!valid) {
    return NextResponse.json({ error: 'Les identifiants sont incorrects.' }, { status: 401 });
  }

  const token = signToken(user.id);

  const res = NextResponse.json({ success: true });
  res.headers.set('Set-Cookie', serialize('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  }));

  return res;
}
