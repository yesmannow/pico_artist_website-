import { NextResponse } from 'next/server';
import manifest from '@/data/media-manifest.json';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json(manifest);
}
