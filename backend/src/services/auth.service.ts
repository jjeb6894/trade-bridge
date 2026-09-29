import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.util.js';

const prisma = new PrismaClient();

export interface AuthResult {
  user: { id: string; email: string; name: string };
  accessToken: string;
  refreshToken: string;
}

function sanitizeUser(user: { id: string; email: string; name: string; password: string }) {
  const { password: _password, ...rest } = user;
  return rest;
}

export async function register(email: string, password: string, name: string): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('EMAIL_EXISTS');
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, name },
  });

  const payload = { userId: user.id, email: user.email };
  return {
    user: sanitizeUser(user),
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const payload = { userId: user.id, email: user.email };
  return {
    user: sanitizeUser(user),
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export async function refresh(refreshToken: string): Promise<{ accessToken: string }> {
  try {
    const payload = verifyRefreshToken(refreshToken);
    return { accessToken: signAccessToken({ userId: payload.userId, email: payload.email }) };
  } catch {
    throw new Error('INVALID_REFRESH_TOKEN');
  }
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('USER_NOT_FOUND');
  return sanitizeUser(user);
}

export async function updateUser(userId: string, data: { name?: string; email?: string }) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });
  return sanitizeUser(user);
}
