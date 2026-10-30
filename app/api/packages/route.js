import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const packages = await query(`
      SELECT * FROM tour_packages 
      ORDER BY sort_order ASC, id ASC
    `);

    const formatted = packages.map(pkg => {
      let inclusions = [];
      let exclusions = [];
      let itinerary = [];
      try {
        inclusions = typeof pkg.inclusions === 'string' ? JSON.parse(pkg.inclusions) : pkg.inclusions;
      } catch (e) {
        inclusions = [];
      }
      try {
        exclusions = typeof pkg.exclusions === 'string' ? JSON.parse(pkg.exclusions) : pkg.exclusions;
      } catch (e) {
        exclusions = [];
      }
      try {
        itinerary = typeof pkg.itinerary === 'string' ? JSON.parse(pkg.itinerary) : pkg.itinerary;
      } catch (e) {
        itinerary = [];
      }

      return {
        ...pkg,
        inclusions: inclusions || [],
        exclusions: exclusions || [],
        itinerary: itinerary || []
      };
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('Fetch packages error:', err);
    return NextResponse.json({ error: 'Failed to fetch tour packages' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const {
      title,
      subtitle = '',
      badge = '🔥 Special Offer',
      duration = '1 Night / 2 Days',
      price = 0,
      show_price = true,
      price_basis = 'Per Person (Per Head)',
      destinations = 'Marayoor & Kanthalloor',
      image = 'assets/images/dest_kanthaloor.jpg',
      poster_image = 'assets/images/poster_master_offers.jpg',
      inclusions = [],
      exclusions = [],
      group_note = ''
    } = data;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Package title is required' }, { status: 400 });
    }

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const res = await query(
      `INSERT INTO tour_packages (slug, title, subtitle, badge, duration, price, show_price, price_basis, destinations, image, poster_image, inclusions, exclusions, group_note, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        title.trim(),
        subtitle,
        badge,
        duration,
        parseInt(price, 10) || 0,
        show_price ? 1 : 0,
        price_basis,
        destinations,
        image,
        poster_image,
        JSON.stringify(Array.isArray(inclusions) ? inclusions : [inclusions]),
        JSON.stringify(Array.isArray(exclusions) ? exclusions : [exclusions]),
        group_note,
        0
      ]
    );

    return NextResponse.json({ success: true, id: res.insertId, message: 'Package created successfully' });
  } catch (err) {
    console.error('Create package error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create package' }, { status: 500 });
  }
}
