import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function GET() {
  try {
    const pool = getPool();

    // OPTION 1 : Sans tri
    const [articles] = await pool.query('SELECT id, author, look, banner, title, content FROM vicehabbo_articles');

    // OPTION 2 (si tu as ajouté `created_at`) :
    // const [articles] = await pool.query('SELECT id, title, content, author FROM vicehabbo_articles ORDER BY created_at DESC');

    return NextResponse.json(articles);
  } catch (error: any) {
    console.error('Erreur API /api/articles:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
