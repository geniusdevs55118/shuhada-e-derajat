import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "dsfhi_token";
const EXPIRES_IN = "8h";

export type TokenPayload = {
  userId: number;
  role: string;
  hospitalId: number | null;
};

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set in .env");
  return secret;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret());
    if (typeof decoded === "object" && decoded !== null) {
      return decoded as unknown as TokenPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export function getCookieName() {
  return COOKIE_NAME;
}

export async function getCurrentUser(tokenOverride?: string) {
  let token = tokenOverride;
  if (!token) {
    try {
      const store = await cookies();
      token = store.get(COOKIE_NAME)?.value;
    } catch {
      token = undefined;
    }
  }
  if (!token) return null;

  try {
    await connection();
  } catch {
    // not in a request scope (e.g. direct handler calls); safe to continue
  }
  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { hospital: true },
  }).catch(() => null);
  if (!user || !user.isActive) return null;
  return user;
}
