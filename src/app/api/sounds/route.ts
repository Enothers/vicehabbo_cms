// src/app/api/sounds/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// !! LA LIGNE MAGIQUE À AJOUTER !!
// Force la route à être dynamique, s'exécutant à chaque requête.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Le chemin vers ton dossier d'uploads
    // 'public' est le dossier standard pour les fichiers statiques dans Next.js
    const uploadsDirectory = path.join(process.cwd(), 'public', 'uploads');
    
    // Lire les noms des fichiers dans le dossier
    const filenames = await fs.readdir(uploadsDirectory);

    // Filtrer pour ne garder que les fichiers .mp3 (optionnel mais recommandé)
    const mp3Files = filenames.filter(file => file.endsWith('.mp3'));
    
    // Renvoyer la liste des fichiers
    return NextResponse.json(mp3Files, {
      status: 200,
      // On peut aussi ajouter des en-têtes pour s'assurer que le navigateur ne met pas en cache non plus
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });

  } catch (error) {
    console.error("Erreur lors de la lecture du dossier uploads:", error);
    // Gérer le cas où le dossier n'existe pas encore
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return NextResponse.json([], { status: 200 }); // Renvoyer une liste vide
    }
    return NextResponse.json({ error: 'Impossible de lister les fichiers son.' }, { status: 500 });
  }
}