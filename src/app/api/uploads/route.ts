import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";
import { AuthError, can, requireUser } from "@/lib/permissions";
import { configuredCloudinary, cloudinaryReady, SENSITIVE_DOCUMENT_TYPES } from "@/lib/cloudinary";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
const DOCUMENT_TYPES = new Set<string>(SENSITIVE_DOCUMENT_TYPES);

function matchesSignature(type: string, bytes: Uint8Array) {
  if (type === "application/pdf") return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a;
  return false;
}

export async function POST(req: NextRequest) {
  let user;
  try { user = await requireUser(req); }
  catch (error) {
    if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
    throw error;
  }
  if (!can(user, "family", "create") && !can(user, "family", "edit")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!cloudinaryReady()) return NextResponse.json({ error: "Document storage is not configured. Contact the system administrator." }, { status: 503 });

  let form: FormData;
  try { form = await req.formData(); }
  catch { return NextResponse.json({ error: "Upload form is invalid" }, { status: 400 }); }
  const familyId = Number(form.get("familyId"));
  const docType = String(form.get("docType") ?? "");
  const file = form.get("file");
  if (!Number.isInteger(familyId) || familyId < 1 || !DOCUMENT_TYPES.has(docType) || !(file instanceof File)) {
    return NextResponse.json({ error: "Family, document type, and file are required" }, { status: 400 });
  }
  if (file.size < 1 || file.size > MAX_BYTES) return NextResponse.json({ error: "Files must be between 1 byte and 5 MB" }, { status: 413 });
  if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: "Only PDF, JPG, and PNG files are accepted" }, { status: 415 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!matchesSignature(file.type, bytes)) return NextResponse.json({ error: "The file contents do not match the selected file type" }, { status: 415 });

  const family = await prisma.family.findUnique({ where: { id: familyId }, select: { id: true, registrationNo: true } });
  if (!family) return NextResponse.json({ error: "Family record not found" }, { status: 404 });
  const sensitive = (SENSITIVE_DOCUMENT_TYPES as readonly string[]).includes(docType);
  const resourceType = file.type === "application/pdf" ? "raw" : "image";
  const extension = file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : "jpg";
  const publicId = `dsfhi/families/${family.registrationNo}/${randomUUID()}`;
  let uploaded: { secure_url: string; public_id: string; resource_type: string; format?: string };
  try {
    const cloud = configuredCloudinary();
    uploaded = await cloud.uploader.upload(`data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`, {
      public_id: publicId,
      resource_type: resourceType as "raw" | "image",
      type: sensitive ? "authenticated" : "upload",
      overwrite: false,
      unique_filename: false,
      filename_override: file.name.replace(/[\r\n"/\\]/g, "_").slice(0, 120),
    });
  } catch (error) {
    console.error("Cloudinary upload failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json({ error: "The document could not be uploaded. Please retry." }, { status: 502 });
  }
  try {
    const document = await prisma.document.create({ data: {
      familyId,
      publicId: uploaded.public_id,
      secureUrl: uploaded.secure_url,
      resourceType: uploaded.resource_type,
      docType,
      originalFilename: `${file.name.replace(/[\r\n/\\]/g, "_").replace(/\.[^.]*$/, "").slice(0, 160)}.${extension}`,
      isSensitive: sensitive,
      createdBy: user.email ?? String(user.id),
    } });
    await prisma.auditLog.create({ data: { who: user.email ?? String(user.id), role: user.role, action: "document_upload", entity: "family_document", entityId: String(document.id), hospitalId: user.hospitalId } }).catch(() => {});
    return NextResponse.json({ id: document.id, docType: document.docType, originalFilename: document.originalFilename, isSensitive: document.isSensitive }, { status: 201 });
  } catch {
    await configuredCloudinary().uploader.destroy(uploaded.public_id, { resource_type: uploaded.resource_type as "raw" | "image", type: sensitive ? "authenticated" : "upload" }).catch(() => undefined);
    return NextResponse.json({ error: "The document record could not be saved. The upload was rolled back." }, { status: 500 });
  }
}
