import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
    try {
        const pool = getPool();
        const [rows] = await pool.query(
            `SELECT id, author, look, banner, title, content 
            FROM vicehabbo_articles 
            ORDER BY id DESC`
        );
        return (NextResponse.json(rows));
    } catch (error) {
        return (NextResponse.json({ error: 'Erreur serveur' }, { status: 500 }));
    }
}