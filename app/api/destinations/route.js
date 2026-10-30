import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const destinations = await query('SELECT * FROM destinations ORDER BY sort_order ASC, id ASC');
    return NextResponse.json(destinations);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}

