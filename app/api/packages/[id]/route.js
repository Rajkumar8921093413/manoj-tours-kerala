import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function PUT(request, { params }) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    const data = await request.json();

    const {
      title,
      subtitle,
      badge,
      duration,
      price,
      show_price,
      price_basis,
      destinations,
      image,
      poster_image,
      inclusions,
      exclusions,
      group_note,
      sort_order,
      is_active
    } = data;

    const fields = [];
    const values = [];

    if (title !== undefined) { fields.push('title = ?'); values.push(title.trim()); }
    if (subtitle !== undefined) { fields.push('subtitle = ?'); values.push(subtitle); }
    if (badge !== undefined) { fields.push('badge = ?'); values.push(badge); }
    if (duration !== undefined) { fields.push('duration = ?'); values.push(duration); }
    if (price !== undefined) { fields.push('price = ?'); values.push(parseInt(price, 10) || 0); }
    if (show_price !== undefined) { fields.push('show_price = ?'); values.push(show_price ? 1 : 0); }
    if (price_basis !== undefined) { fields.push('price_basis = ?'); values.push(price_basis); }
    if (destinations !== undefined) { fields.push('destinations = ?'); values.push(destinations); }
    if (image !== undefined) { fields.push('image = ?'); values.push(image); }
    if (poster_image !== undefined) { fields.push('poster_image = ?'); values.push(poster_image); }
    if (inclusions !== undefined) {
      fields.push('inclusions = ?');
      values.push(JSON.stringify(Array.isArray(inclusions) ? inclusions : [inclusions]));
    }
    if (exclusions !== undefined) {
      fields.push('exclusions = ?');
      values.push(JSON.stringify(Array.isArray(exclusions) ? exclusions : [exclusions]));
    }
    if (group_note !== undefined) { fields.push('group_note = ?'); values.push(group_note); }
    if (sort_order !== undefined) { fields.push('sort_order = ?'); values.push(parseInt(sort_order, 10) || 0); }
    if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active ? 1 : 0); }

    if (fields.length === 0) {
      return NextResponse.json({ message: 'No fields to update' });
    }

    values.push(id);
    await query(`UPDATE tour_packages SET ${fields.join(', ')} WHERE id = ?`, values);

    return NextResponse.json({ success: true, message: 'Package updated successfully' });
  } catch (err) {
    console.error('Update package error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update package' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id, 10);

    // Clean up images from Cloudinary if present
    try {
      const rows = await query('SELECT image, poster_image FROM tour_packages WHERE id = ?', [id]);
      if (rows && rows.length > 0) {
        if (rows[0].image) await deleteFromCloudinary(rows[0].image);
        if (rows[0].poster_image) await deleteFromCloudinary(rows[0].poster_image);
      }
    } catch (cleanErr) {
      console.warn('Could not clean Cloudinary images for package:', cleanErr);
    }

    await query('DELETE FROM tour_packages WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Package deleted successfully' });
  } catch (err) {
    console.error('Delete package error:', err);
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}
