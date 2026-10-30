import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const reviews = await query('SELECT * FROM reviews ORDER BY sort_order ASC, id ASC');
    return NextResponse.json(reviews);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

