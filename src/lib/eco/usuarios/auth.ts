import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions, type JwtPayload } from "jsonwebtoken";

const SECRET: Secret = (process.env.JWT_SECRET || "dev-secret") as Secret;
const EXPIRES_IN: SignOptions["expiresIn"] =
    (process.env.JWT_EXPIRES as SignOptions["expiresIn"]) || "1d";

export async function hashPassword(plain: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
}

export function signJwt(payload: object) {
    const options: SignOptions = { expiresIn: EXPIRES_IN };
    return jwt.sign(payload, SECRET, options);
}

export function verifyJwt<T extends JwtPayload = JwtPayload>(token: string): T | null {
    try {
        return jwt.verify(token, SECRET) as T;
    } catch {
        return null;
    }
}
