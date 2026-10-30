import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const safaris = await query(`
      SELECT * FROM jeep_safaris 
      ORDER BY sort_order ASC, id ASC
    `);

    const formatted = safaris.map(s => {
      let gallery = [];
      try {
        gallery = typeof s.gallery_images === 'string' ? JSON.parse(s.gallery_images) : s.gallery_images;
      } catch (e) {
        gallery = [];
      }
      return {
        ...s,
        gallery_images: gallery || []
      };
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('Fetch safaris error:', err);
    return NextResponse.json({ error: 'Failed to fetch jeep safaris' }, { status: 500 });
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
      badge = '⛰️ Peak Safari',
      description = '',
      duration = '3 - 4 Hours',
      terrain_tag = 'Rugged Climb',
      price_info = '₹2,500 – ₹4,500 per Jeep',
      weather_note = 'Routes subject to weather and forest rules.',
      primary_image = 'assets/images/jeep_mountain_peak.jpg',
      gallery_images = []
    } = data;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const res = await query(
      `INSERT INTO jeep_safaris (slug, title, badge, description, duration, terrain_tag, price_info, weather_note, primary_image, gallery_images, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        title.trim(),
        badge,
        description,
        duration,
        terrain_tag,
        price_info,
        weather_note,
        primary_image,
        JSON.stringify(Array.isArray(gallery_images) ? gallery_images : []),
        0
      ]
    );

    return NextResponse.json({ success: true, id: res.insertId, message: 'Jeep Safari created successfully' });
  } catch (err) {
    console.error('Create safari error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create safari' }, { status: 500 });
  }
}
