import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AuthError, requirePermission, requireUser } from "@/lib/permissions";
import { configuredCloudinary, cloudinaryReady } from "@/lib/cloudinary";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try { await requirePermission("family", "read", req); }
  catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    throw error;
  }
  if (!cloudinaryReady()) return NextResponse.json({ error: "Document storage is not configured" }, { status: 503 });
  const id = Number((await ctx.params).id);
  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  const user = await requireUser(req);
  const format = document.originalFilename.split(".").pop()?.toLowerCase() ?? "bin";
  const url = document.isSensitive
    ? configuredCloudinary().utils.private_download_url(document.publicId, format, { resource_type: document.resourceType as "raw" | "image", type: "authenticated", expires_at: Math.floor(Date.now() / 1000) + 300, attachment: true })
    : document.secureUrl;
  await prisma.auditLog.create({ data: { who: user.email ?? String(user.id), role: user.role, action: "sensitive_document_view", entity: "family_document", entityId: String(document.id), hospitalId: user.hospitalId } }).catch(() => {});
  return NextResponse.redirect(url);
}
