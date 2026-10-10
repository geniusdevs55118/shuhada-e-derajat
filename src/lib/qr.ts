import QRCode from "qrcode";

export async function generateQrDataUrl(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, { width: 320, margin: 1 });
}

export function publicVerifyUrl(qrDigitalVerificationId: string): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL;
  const base = configured?.trim() || (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");
  if (!base) throw new Error("NEXT_PUBLIC_SITE_URL must be configured before generating production QR codes");
  return `${base.replace(/\/+$/, "")}/verify/${encodeURIComponent(qrDigitalVerificationId)}`;
}
