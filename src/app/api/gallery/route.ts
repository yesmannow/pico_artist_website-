import { NextResponse } from 'next/server';
import manifest from '@/data/media-manifest.json';

export const runtime = 'nodejs'; // CLOUDFLARE FIX: Changed from edge to nodejs

export async function GET() {
  return NextResponse.json(manifest);
}
