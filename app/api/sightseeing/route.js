import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const spots = await query('SELECT * FROM sightseeing_spots ORDER BY sort_order ASC, id ASC');
    return NextResponse.json(spots);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch sightseeing spots' }, { status: 500 });
  }
}

