import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';  // Garder en string

export function signToken(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    // Ici, jwtVerify de 'jose' attend Uint8Array donc on encode
    const secretUint8 = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secretUint8);

    if (typeof payload === 'object' && payload !== null && 'userId' in payload) {
      return payload as { userId: string };
    }

    console.warn("Payload décodé ne contient pas 'userId' ou n'est pas un objet:", payload);
    return null;

  } catch (error) {
    console.error('Erreur lors de la vérification du token (jose):', error);
    return null;
  }
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
