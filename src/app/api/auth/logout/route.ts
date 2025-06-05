import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
    const res = NextResponse.json({ message: 'Logged out' });
    res.headers.set('Set-Cookie', serialize('token', '', {
        httpOnly: true,
        path: '/',
        expires: new Date(0),
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    }));
    return (res);
}
