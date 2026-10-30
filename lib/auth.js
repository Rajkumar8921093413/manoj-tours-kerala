import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'manoj_kerala_super_secret_jwt_key_2026';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
export const COOKIE_NAME = 'manoj_admin_token';

export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

export async function comparePassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

export async function createAdminToken(payload) {
  return new SignJWT({ ...payload, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function getAuthenticatedAdmin(request) {
  try {
    let token = null;
    if (request && request.cookies && typeof request.cookies.get === 'function') {
      token = request.cookies.get(COOKIE_NAME)?.value;
    }
    if (!token) {
      const cookieStore = cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    }
    if (!token) return null;
    return await verifyAdminToken(token);
  } catch (err) {
    return null;
  }
}
