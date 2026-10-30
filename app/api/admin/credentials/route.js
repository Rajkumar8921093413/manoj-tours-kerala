import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthenticatedAdmin, comparePassword, hashPassword, createAdminToken, COOKIE_NAME } from '@/lib/auth';

export async function PUT(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newUsername, newPassword } = await request.json();

    if (!currentPassword) {
      return NextResponse.json({ error: 'Current password is required' }, { status: 400 });
    }

    const rows = await query('SELECT * FROM admins WHERE id = ? LIMIT 1', [admin.id]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 });
    }

    const currentAdmin = rows[0];
    const isCurrentValid = await comparePassword(currentPassword, currentAdmin.password_hash);
    if (!isCurrentValid) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
    }

    let updatedUsername = currentAdmin.username;
    if (newUsername && newUsername.trim()) {
      updatedUsername = newUsername.trim();
    }

    let updatedHash = currentAdmin.password_hash;
    if (newPassword && newPassword.trim()) {
      if (newPassword.trim().length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
      }
      updatedHash = await hashPassword(newPassword.trim());
    }

    await query(
      'UPDATE admins SET username = ?, password_hash = ? WHERE id = ?',
      [updatedUsername, updatedHash, admin.id]
    );

    const token = await createAdminToken({ id: admin.id, username: updatedUsername });

    const response = NextResponse.json({
      success: true,
      message: 'Admin credentials updated successfully',
      user: { username: updatedUsername }
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (err) {
    console.error('Update credentials error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update credentials' }, { status: 500 });
  }
}
