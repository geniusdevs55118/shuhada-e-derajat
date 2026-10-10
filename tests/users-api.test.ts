import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";
import { GET as usersGET, POST as usersPOST } from "@/app/api/users/route";
import { PATCH as userPATCH } from "@/app/api/users/[id]/route";
import { PATCH as statusPATCH } from "@/app/api/users/[id]/status/route";
import { POST as resetPOST } from "@/app/api/users/[id]/reset-password/route";
import { POST as loginPOST } from "@/app/api/auth/login/route";
import { signToken } from "@/lib/auth";
import { canConnect } from "./helpers/db";
import { _clearAll } from "@/lib/rate-limit";

const prisma = new PrismaClient();
const dbUp = await canConnect();
const DEMO_PASSWORD = "demo-password-123";

function tokenFor(username: string) {
  return (async () => {
    const user = await prisma.user.findUniqueOrThrow({ where: { email: `${username}@demo.dsfhi.local` } });
    return signToken({ userId: user.id, role: user.role, hospitalId: user.hospitalId });
  })();
}

function req(url: string, token: string, init?: Omit<RequestInit, "signal">) {
  const rest = { ...init, signal: undefined };
  return new NextRequest(url, { ...rest, method: rest.method ?? "GET", headers: { "content-type": "application/json", cookie: `dsfhi_token=${token}` } });
}

describe.skipIf(!dbUp)("user management API", () => {
  beforeAll(async () => {
    await runSeed(DEMO_PASSWORD);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { in: ["wg.it2@demo.dsfhi.local", "tmp.user@example.com"] } } });
    await prisma.user.deleteMany({ where: { email: { endsWith: "@e2e.dsfhi.local" } } });
    await prisma.$disconnect();
  });

  it("only it_mis_rep can call user APIs", async () => {
    const usernames = ["director", "addl.director", "ms.dhq", "desk.dhq", "wg.admin", "wg.sehat", "wg.pharmacy", "wg.diagnostics", "wg.nursing", "wg.it"];
    for (const username of usernames) {
      const token = await tokenFor(username);
      const res = await usersGET(req("http://localhost/api/users", token));
      const expected = username === "wg.it" ? 200 : 403;
      expect(res.status, username).toBe(expected);
    }
  });

  it("creating an MS without a hospital fails", async () => {
    const token = await tokenFor("wg.it");
    const res = await usersPOST(req("http://localhost/api/users", token, { method: "POST", body: JSON.stringify({ name: "X", username: "x.ms@example.com", role: "medical_superintendent", password: "password123" }) }));
    expect(res.status).toBe(400);
  });

  it("creating a director with a hospital fails", async () => {
    const token = await tokenFor("wg.it");
    const res = await usersPOST(req("http://localhost/api/users", token, { method: "POST", body: JSON.stringify({ name: "D", username: "d", role: "hospital_director", hospitalCode: "DHQ", password: "password123" }) }));
    expect(res.status).toBe(400);
  });

  it("duplicate username fails", async () => {
    const token = await tokenFor("wg.it");
    const res = await usersPOST(req("http://localhost/api/users", token, { method: "POST", body: JSON.stringify({ name: "D", username: "director", role: "pharmacy_rep", password: "password123" }) }));
    expect(res.status).toBe(409);
  });

  it("password hash never in responses", async () => {
    const token = await tokenFor("wg.it");
    const listRes = await usersGET(req("http://localhost/api/users", token));
    const body = await listRes.json();
    expect(JSON.stringify(body)).not.toContain("passwordHash");
    expect(JSON.stringify(body)).not.toContain("$2");
  });

  it("cannot deactivate self", async () => {
    const me = await prisma.user.findUniqueOrThrow({ where: { email: "wg.it@demo.dsfhi.local" } });
    const token = await tokenFor("wg.it");
    const res = await statusPATCH(req(`http://localhost/api/users/${me.id}/status`, token, { method: "PATCH", body: JSON.stringify({ isActive: false }) }), { params: Promise.resolve({ id: String(me.id) }) });
    expect(res.status).toBe(400);
  });

  it("cannot role-change own account", async () => {
    const me = await prisma.user.findUniqueOrThrow({ where: { email: "wg.it@demo.dsfhi.local" } });
    const token = await tokenFor("wg.it");
    const res = await userPATCH(req(`http://localhost/api/users/${me.id}`, token, { method: "PATCH", body: JSON.stringify({ name: me.name, role: "pharmacy_rep", hospitalCode: null }) }), { params: Promise.resolve({ id: String(me.id) }) });
    expect(res.status).toBe(400);
  });

  it("deactivating another it_mis_rep keeps at least one active (himself)", async () => {
    const token = await tokenFor("wg.it");
    const me = await prisma.user.findUniqueOrThrow({ where: { email: "wg.it@demo.dsfhi.local" } });
    const u2 = await prisma.user.upsert({
      where: { email: "wg.it2@demo.dsfhi.local" },
      update: { isActive: true, role: "it_mis_rep" },
      create: { name: "IT2", email: "wg.it2@demo.dsfhi.local", passwordHash: me.passwordHash, role: "it_mis_rep", isActive: true },
    });
    const res = await statusPATCH(req(`http://localhost/api/users/${u2.id}/status`, token, { method: "PATCH", body: JSON.stringify({ isActive: false }) }), { params: Promise.resolve({ id: String(u2.id) }) });
    expect(res.status).toBe(200);
    const active = await prisma.user.count({ where: { role: "it_mis_rep", isActive: true } });
    expect(active).toBeGreaterThanOrEqual(1);
    await prisma.user.delete({ where: { id: u2.id } });
  });

  it("reset-password lets the user log in with the new password", async () => {
    const token = await tokenFor("wg.it");
    // create a temp user to reset
    const createRes = await usersPOST(req("http://localhost/api/users", token, { method: "POST", body: JSON.stringify({ name: "Tmp", username: "tmp.user@example.com", role: "health_desk_officer", hospitalCode: "MMMTH", password: "oldpass123" }) }));
    expect(createRes.status).toBe(201);
    const created = await prisma.user.findUniqueOrThrow({ where: { email: "tmp.user@example.com" } });
    const resetRes = await resetPOST(req(`http://localhost/api/users/${created.id}/reset-password`, token, { method: "POST", body: JSON.stringify({ password: "newpass456" }) }), { params: Promise.resolve({ id: String(created.id) }) });
    expect(resetRes.status).toBe(200);
    _clearAll();
    const loginRes = await loginPOST(new NextRequest("http://localhost/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username: created.email.replace("@demo.dsfhi.local", ""), password: "newpass456" }) }));
    expect(loginRes.status).toBe(200);
    await prisma.user.delete({ where: { id: created.id } });
  });

  it("audit rows written without passwords", async () => {
    const audits = await prisma.auditLog.findMany({ where: { entity: "user" } });
    expect(audits.length).toBeGreaterThan(0);
    const json = JSON.stringify(audits);
    expect(json).not.toContain("$2");
    expect(json).not.toContain("passwordHash");
    expect(json).not.toContain("oldpass123");
    expect(json).not.toContain("newpass456");
    expect(json).not.toContain("demo-password");
  });
});
