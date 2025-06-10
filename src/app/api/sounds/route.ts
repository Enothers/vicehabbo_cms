// app/api/sounds/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export async function GET() {
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    const mp3Files = files.filter(f => f.endsWith('.mp3'));
    return NextResponse.json(mp3Files);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
