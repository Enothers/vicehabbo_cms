import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPool } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    let payload: any;
    try {
        payload = await verifyToken(token);
    } catch {
        return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
    }

    const userId = payload?.userId;
    if (!userId) {
        return NextResponse.json({ error: 'Payload de token invalide' }, { status: 401 });
    }

    try {
        const pool = getPool();

        const [rows] = await pool.query(
            `
            SELECT u.id, u.username, u.look
            FROM messenger_friendships mf
            JOIN users u ON u.id = mf.user_two_id
            WHERE mf.user_one_id = ?
            `,
            [userId]
        );

        const friends = (rows as any[]).map(friend => ({
            id: friend.id,
            name: friend.username,
            avatar: `https://imager.vicehabbo.eu/?figure=${friend.look}&size=l&direction=2&head_direction=2`,
        }));

        return NextResponse.json(friends);
    } catch (error) {
        console.error("Erreur serveur :", error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
