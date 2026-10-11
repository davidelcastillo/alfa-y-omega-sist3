import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions, type JwtPayload } from "jsonwebtoken";

const DEV_FALLBACK_SECRET = "dev-secret";
let cachedSecret: Secret | null = null;

function getSecret(): Secret {
    if (cachedSecret) return cachedSecret;
    const fromEnv = process.env.JWT_SECRET;
    if (fromEnv) {
        cachedSecret = fromEnv;
    } else if (process.env.NODE_ENV === "production") {
        throw new Error("JWT_SECRET environment variable is required in production");
    } else {
        console.warn(`JWT_SECRET is not set; using insecure "${DEV_FALLBACK_SECRET}" (development only)`);
        cachedSecret = DEV_FALLBACK_SECRET;
    }
    return cachedSecret;
}
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
    return jwt.sign(payload, getSecret(), options);
}

export function verifyJwt<T extends JwtPayload = JwtPayload>(token: string): T | null {
    const secret = getSecret();
    try {
        return jwt.verify(token, secret) as T;
    } catch {
        return null;
    }
}
