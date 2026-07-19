import crypto from "node:crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const sessionCookieName = "bzmxs_admin_session";
const invalidPasswordHash = "$2b$12$wJHt1d1E2hfe7rIpiYdK/.9u0XwHO26tX2JJN2yV6MTi7klRCthxu";

type AdminSessionPayload = {
  userId: string;
  username: string;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set to at least 32 characters for admin authentication.");
  }
  return secret;
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function signCookie(sessionId: string, token: string) {
  return crypto.createHmac("sha256", getAuthSecret()).update(`${sessionId}.${token}`).digest("base64url");
}

function verifyCookieValue(value: string) {
  const [sessionId, token, signature] = value.split(".");
  if (!sessionId || !token || !signature) {
    return null;
  }

  if (!safeEqual(signature, signCookie(sessionId, token))) {
    return null;
  }

  return { sessionId, token };
}

export async function verifyAdminCredentials(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, passwordHash: true },
  });

  if (!user) {
    await bcrypt.compare(password, invalidPasswordHash).catch(() => false);
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return { id: user.id, username: user.username };
}

export async function createAdminSession(user: { id: string; username: string }) {
  const cookieStore = await cookies();
  const maxAge = Number(process.env.ADMIN_SESSION_MAX_AGE_SECONDS ?? 60 * 60 * 8);
  const token = crypto.randomBytes(32).toString("base64url");
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + maxAge * 1000),
    },
  });

  const cookieValue = `${session.id}.${token}.${signCookie(session.id, token)}`;

  cookieStore.set(sessionCookieName, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge,
  });
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(sessionCookieName)?.value;
  if (!cookieValue) {
    return null;
  }

  try {
    const verifiedCookie = verifyCookieValue(cookieValue);
    if (!verifiedCookie) {
      return null;
    }

    const session = await prisma.session.findUnique({
      where: { id: verifiedCookie.sessionId },
      include: { user: { select: { id: true, username: true } } },
    });

    if (!session || session.revokedAt || session.expiresAt.getTime() < Date.now()) {
      return null;
    }

    if (!safeEqual(session.tokenHash, sha256(verifiedCookie.token))) {
      return null;
    }

    return { userId: session.user.id, username: session.user.username };
  } catch {
    return null;
  }
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(sessionCookieName)?.value;
  const verifiedCookie = cookieValue ? verifyCookieValue(cookieValue) : null;

  if (verifiedCookie) {
    await prisma.session
      .update({
        where: { id: verifiedCookie.sessionId },
        data: { revokedAt: new Date() },
      })
      .catch(() => null);
  }

  cookieStore.delete(sessionCookieName);
}
