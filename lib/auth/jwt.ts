import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "furute-admin-secure-jwt-secret-key-2026";

export interface JWTPayload {
  id: string;
  username: string;
  email: string;
  role: string;
}

/**
 * Signs a payload to generate a signed JWT.
 * @param payload The session payload to encode.
 * @param expiresIn Token expiration duration. Defaults to "7d".
 * @returns The signed JWT string.
 */
export function signToken(payload: JWTPayload, expiresIn = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
}

/**
 * Verifies a JWT and returns the decoded payload.
 * @param token The signed JWT token.
 * @returns The decoded payload, or null if verification fails.
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error("JWT token verification failed:", error);
    return null;
  }
}
