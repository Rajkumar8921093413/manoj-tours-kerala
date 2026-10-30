import { NextResponse } from 'next/server';
import { runSeeder } from '@/scripts/seed';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function POST(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    await runSeeder();
    return NextResponse.json({ success: true, message: 'Database seeder completed successfully.' });
  } catch (err) {
    console.error('Seeder execution error:', err);
    return NextResponse.json({ error: err.message || 'Seeder failed' }, { status: 500 });
  }
}
