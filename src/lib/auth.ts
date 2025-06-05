import { jwtVerify, SignJWT } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

const encoder = new TextEncoder();
const secretUint8 = encoder.encode(JWT_SECRET);

interface JwtPayload {
    userId: string;
}

export async function signToken(userId: string): Promise<string> {
    return (new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(secretUint8)
    );
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secretUint8);
        if (typeof payload === 'object' && payload !== null && 'userId' in payload) {
            return (payload as unknown as JwtPayload);
        }
        return (null);
    }
    catch {
        return (null);
    }
}

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return (bcrypt.hash(password, salt));
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return (bcrypt.compare(password, hash));
}