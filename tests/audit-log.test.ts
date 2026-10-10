// @vitest-environment node
import { describe, it, expect, beforeAll } from "vitest";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runSeed } from "../prisma/seed";
import { GET as auditGET } from "@/app/api/audit-log/route";
import { signToken } from "@/lib/auth";
import { canConnect } from "./helpers/db";

const prisma = new PrismaClient();
const dbUp = await canConnect();
const DEMO_PASSWORD = "demo-password-123";

async function tokenFor(username: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { email: `${username}@demo.dsfhi.local` } });
  return signToken({ userId: user.id, role: user.role, hospitalId: user.hospitalId });
}

function req(url: string, token: string) {
  return new NextRequest(url, { headers: { cookie: `dsfhi_token=${token}` } });
}

describe.skipIf(!dbUp)("Phase 25: Audit Log viewer", () => {
  beforeAll(async () => {
    await runSeed(DEMO_PASSWORD);
  });

  it("it_mis_rep and directors can read audit log", async () => {
    for (const u of ["wg.it", "director", "addl.director"]) {
      const token = await tokenFor(u);
      const res = await auditGET(req("http://localhost/api/audit-log", token));
      expect(res.status, u).toBe(200);
    }
  });

  it("health desk cannot read audit log", async () => {
    const token = await tokenFor("desk.dhq");
    const res = await auditGET(req("http://localhost/api/audit-log", token));
    expect(res.status).toBe(403);
  });

  it("supports search filters", async () => {
    const token = await tokenFor("director");
    const res = await auditGET(req("http://localhost/api/audit-log?action=login_failure", token));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data.data)).toBe(true);
  });
});
