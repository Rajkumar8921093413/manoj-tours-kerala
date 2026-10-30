import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const items = await query('SELECT * FROM gallery_items ORDER BY sort_order ASC, id ASC');
    return NextResponse.json(items);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

