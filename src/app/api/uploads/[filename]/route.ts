import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request: NextRequest) {
  // Extraire le filename depuis l'URL
  const { pathname } = new URL(request.url);
  const parts = pathname.split('/'); // ['','api','uploads','filename']
  const filename = parts[parts.length - 1];

  if (!filename) {
    return NextResponse.json({ error: 'Nom de fichier manquant' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'uploads', filename);

  try {
    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(filename).toLowerCase();

    const mimeTypes: Record<string, string> = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.m4a': 'audio/mp4',
      '.flac': 'audio/flac',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
  }
}
