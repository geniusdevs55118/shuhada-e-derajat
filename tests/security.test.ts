// @vitest-environment node
import { describe, it, expect } from "vitest";
import { GET as verifyGET } from "@/app/api/verify/[qr]/route";
import { NextRequest } from "next/server";
import { maskCnic } from "@/lib/cnic";
import { rateLimitReset } from "@/lib/rate-limit-ip";

describe("Phase 26: Security & Privacy", () => {
  it("masks CNIC in lists", () => {
    expect(maskCnic("12345-1234567-1")).toBe("*****-*******-1");
  });

  it("verify route rate limits after 30 requests from same IP", async () => {
    rateLimitReset();
    let lastStatus = 0;
    for (let i = 0; i < 35; i++) {
      const r = new NextRequest("http://localhost/api/verify/abc", { headers: { "x-forwarded-for": "9.9.9.9" } });
      const res = await verifyGET(r, { params: Promise.resolve({ qr: "abc" }) });
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
    rateLimitReset();
  });

  it("verify route never exposes CNIC or diagnosis", async () => {
    rateLimitReset();
    const r = new NextRequest("http://localhost/api/verify/abc", { headers: { "x-forwarded-for": "8.8.8.8" } });
    const res = await verifyGET(r, { params: Promise.resolve({ qr: "abc" }) });
    const text = JSON.stringify(await res.json());
    expect(text).not.toContain("cnic");
    expect(text).not.toContain("diagnosis");
  });
});
