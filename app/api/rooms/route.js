import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const rooms = await query(`
      SELECT * FROM rooms 
      ORDER BY sort_order ASC, id ASC
    `);

    // Fetch images for all rooms
    const images = await query(`
      SELECT * FROM room_images 
      ORDER BY sort_order ASC, id ASC
    `);

    // Group images by room_id
    const imageMap = {};
    for (const img of images) {
      if (!imageMap[img.room_id]) {
        imageMap[img.room_id] = [];
      }
      imageMap[img.room_id].push(img);
    }

    const formatted = rooms.map(room => {
      let parsedFeatures = [];
      try {
        parsedFeatures = typeof room.features === 'string' ? JSON.parse(room.features) : room.features;
      } catch (e) {
        parsedFeatures = [];
      }

      const roomImgs = imageMap[room.id] || [];
      const gallery = roomImgs.map(i => i.image_url);
      if (gallery.length === 0 && room.primary_image) {
        gallery.push(room.primary_image);
      }

      return {
        ...room,
        features: parsedFeatures || [],
        gallery,
        room_images: roomImgs
      };
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error('Fetch rooms error:', err);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
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
      name,
      category,
      price = 0,
      show_price = true,
      price_basis = 'Per Room / Per Night',
      capacity = '2 Adults',
      location = 'Marayoor / Kanthalloor',
      primary_image = 'assets/images/room_standard_non_ac.jpg',
      features = [],
      dining_note = 'Homely Kerala meals available on request.',
      disclaimer = 'Price Basis: Per Room / Per Night.',
      gallery = []
    } = data;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 });
    }

    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const res = await query(
      `INSERT INTO rooms (slug, name, category, price, show_price, price_basis, capacity, location, primary_image, features, dining_note, disclaimer, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        name.trim(),
        category || 'deluxe',
        parseInt(price, 10) || 0,
        show_price ? 1 : 0,
        price_basis,
        capacity,
        location,
        primary_image,
        JSON.stringify(Array.isArray(features) ? features : [features]),
        dining_note,
        disclaimer,
        0
      ]
    );

    const roomId = res.insertId;

    // Add primary image to gallery if not empty
    const allImages = Array.isArray(gallery) && gallery.length > 0 ? gallery : [primary_image];
    for (let i = 0; i < allImages.length; i++) {
      await query(
        `INSERT INTO room_images (room_id, image_url, caption, is_primary, sort_order)
         VALUES (?, ?, ?, ?, ?)`,
        [roomId, allImages[i], `${name} - Photo ${i + 1}`, i === 0 ? 1 : 0, i]
      );
    }

    return NextResponse.json({ success: true, id: roomId, message: 'Room created successfully' });
  } catch (err) {
    console.error('Create room error:', err);
    return NextResponse.json({ error: err.message || 'Failed to create room' }, { status: 500 });
  }
}
