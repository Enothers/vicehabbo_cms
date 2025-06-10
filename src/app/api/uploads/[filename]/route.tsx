import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.query;

  if (!filename || typeof filename !== 'string') {
    res.status(400).end('Nom de fichier invalide');
    return;
  }

  const filePath = path.join(process.cwd(), 'uploads', filename);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.status(404).end('Fichier non trouvé');
      return;
    }

    // Content-Type simple basé sur extension (à améliorer si besoin)
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg',
      '.m4a': 'audio/mp4',
      '.flac': 'audio/flac',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    // Stream le fichier (plus performant que readFile)
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}
