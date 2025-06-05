import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { comparePassword, signToken } from "@/lib/auth";
import { serialize } from "cookie";

interface User {
    id: number;
    password: string;
}

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();
        if (!username?.trim() || !password?.trim())
            return (NextResponse.json({ error: 'Merci de remplir tous les champs.' }, { status: 400 }));
        const pool = getPool();
        const [rows] = await pool.query('SELECT id, password FROM users WHERE username = ?', [username.trim()]) as [User[], any];
        if (rows.length === 0)
            return (NextResponse.json({ error: 'Les identifiants sont incorrects.' }, { status: 401 }));
        const user = rows[0];
        const valid = await comparePassword(password, user.password);
        if (!valid)
            return (NextResponse.json({ error: 'Les identifiants sont incorrects.' }, { status: 401 }));
        const token = await signToken(String(user.id));
        const res = NextResponse.json({ success: true });
        res.headers.set(
            'Set-Cookie',
            serialize('token', token, {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
            })
        );
        return (res);
    }
    catch (error) {
        return (NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 }));
    }
}