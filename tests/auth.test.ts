import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";
import { POST as loginPOST } from "@/app/api/auth/login/route";
import { POST as logoutPOST } from "@/app/api/auth/logout/route";
import { GET as meGET } from "@/app/api/auth/me/route";
import { signToken } from "@/lib/auth";
import { _clearAll } from "@/lib/rate-limit";
import { canConnect } from "./helpers/db";

const prisma = new PrismaClient();
const dbUp = await canConnect();
const DEMO_PASSWORD = "demo-password-123";

function loginReq(username: string, password: string) {
  return new NextRequest("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

function reqWithCookie(url: string, token?: string) {
  return new NextRequest(url, {
    method: "GET",
    headers: token ? { cookie: `dsfhi_token=${token}` } : {},
  });
}

describe.skipIf(!dbUp)("auth", () => {
  beforeAll(async () => {
    await runSeed(DEMO_PASSWORD);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("correct login sets httpOnly cookie and returns safe user fields", async () => {
    _clearAll();
    const res = await loginPOST(loginReq("director", DEMO_PASSWORD));
    expect(res.status).toBe(200);
    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("dsfhi_token=");
    expect(setCookie).toContain("HttpOnly");
    const body = await res.json();
    expect(body.user.role).toBe("hospital_director");
    expect(body.user.name).toBeTruthy();
    expect(JSON.stringify(body)).not.toContain("passwordHash");
    expect(JSON.stringify(body)).not.toContain("$2");
  });

  it("wrong password returns 401 with the generic message", async () => {
    _clearAll();
    const res = await loginPOST(loginReq("director", "wrong-password"));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Invalid username or password");
  });

  it("inactive user cannot log in", async () => {
    _clearAll();
    const user = await prisma.user.findUniqueOrThrow({ where: { email: "ms.dhq@demo.dsfhi.local" } });
    await prisma.user.update({ where: { id: user.id }, data: { isActive: false } });
    try {
      const res = await loginPOST(loginReq("ms.dhq", DEMO_PASSWORD));
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe("Invalid username or password");
    } finally {
      await prisma.user.update({ where: { id: user.id }, data: { isActive: true } });
    }
  });

  it("/me returns 401 without a cookie, and with tampered or expired token", async () => {
    expect((await meGET(reqWithCookie("http://localhost/api/auth/me"))).status).toBe(401);
    expect((await meGET(reqWithCookie("http://localhost/api/auth/me", "tampered.token.value"))).status).toBe(401);

    const expired = jwt.sign({ userId: 1, role: "hospital_director", hospitalId: null }, process.env.JWT_SECRET!, { expiresIn: "-1s" });
    expect((await meGET(reqWithCookie("http://localhost/api/auth/me", expired))).status).toBe(401);
  });

  it("/me returns the current user with a valid token", async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: "director@demo.dsfhi.local" } });
    const token = signToken({ userId: user.id, role: user.role, hospitalId: user.hospitalId });
    const res = await meGET(reqWithCookie("http://localhost/api/auth/me", token));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user.role).toBe("hospital_director");
    expect(JSON.stringify(body)).not.toContain("passwordHash");
  });

  it("logout clears the cookie and writes an audit row", async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: "director@demo.dsfhi.local" } });
    const token = signToken({ userId: user.id, role: user.role, hospitalId: user.hospitalId });
    const logoutRes = await logoutPOST(new NextRequest("http://localhost/api/auth/logout", { method: "POST", headers: { cookie: `dsfhi_token=${token}` } }));
    expect(logoutRes.status).toBe(200);
    const setCookie = logoutRes.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("dsfhi_token=");
    expect(setCookie).toMatch(/Max-Age=0/);
    const audit = await prisma.auditLog.findFirst({ where: { action: "logout", entityId: String(user.id) } });
    expect(audit).not.toBeNull();
  });

  it("6th failed login attempt returns 429", async () => {
    _clearAll();
    let lastStatus = 0;
    for (let i = 0; i < 6; i++) {
      const res = await loginPOST(loginReq("ratelimituser", "bad-password"));
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });

  it("audit rows are written for login success and failure", async () => {
    _clearAll();
    await loginPOST(loginReq("director", "wrong-password"));
    await loginPOST(loginReq("director", DEMO_PASSWORD));
    const fail = await prisma.auditLog.findFirst({ where: { action: "login_failure", who: "director" } });
    const success = await prisma.auditLog.findFirst({ where: { action: "login_success" } });
    expect(fail).not.toBeNull();
    expect(success).not.toBeNull();
  });
});
