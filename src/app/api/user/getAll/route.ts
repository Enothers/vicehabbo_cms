import { getPool } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    try {
        await verifyToken(token);
        const pool = getPool();
        const [rows] = await pool.query("SELECT id, username, look, rank, online, rank_info FROM users WHERE rank >= 8");
        return NextResponse.json({ users: rows });
    } catch (err) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
