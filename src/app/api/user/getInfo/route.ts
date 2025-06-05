import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest)
{
    const token = request.cookies.get('token')?.value;
    if (!token)
        return (NextResponse.json({ error: 'Non authentifié' }, { status: 401 }));
    let payload: any;
    try {
        payload = await verifyToken(token);
    } catch {
        return (NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 }));
    }
    const userId = payload?.userId;
    if (!userId)
        return (NextResponse.json({ error: 'Payload de token invalide' }, { status: 401 }));
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        const user = (rows as any)[0];
        if (!user)
            return (NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 }));
        delete user.password;
        return (NextResponse.json({ user }));
    } catch (error) {
        return (NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }));
    }
}