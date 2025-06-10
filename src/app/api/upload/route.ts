// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file || !file.name.endsWith('.mp3')) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadPath = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

  const filePath = path.join(uploadPath, file.name);
  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({ success: true, filename: file.name });
}
