import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
    try {
        const pool = getPool();
        const [rows] = await pool.query(
            `SELECT id, name, users 
             FROM rooms 
             ORDER BY users DESC 
             LIMIT 10`
        );
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
