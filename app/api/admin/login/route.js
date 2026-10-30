import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, createAdminToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const rows = await query('SELECT * FROM admins WHERE username = ? LIMIT 1', [username.trim()]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const admin = rows[0];
    const match = await comparePassword(password, admin.password_hash);
    if (!match) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const token = await createAdminToken({ id: admin.id, username: admin.username });

    const isHttps = request.headers.get('x-forwarded-proto') === 'https';
    const response = NextResponse.json({ success: true, message: 'Logged in successfully', user: { username: admin.username } });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
