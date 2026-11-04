import QRCode from "qrcode";

export async function generateQrDataUrl(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, { width: 320, margin: 1 });
}

export function publicVerifyUrl(qrDigitalVerificationId: string): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "https://mtidikorg.vercel.app";
  const base = configured.trim() || "https://mtidikorg.vercel.app";
  return `${base.replace(/\/+$/, "")}/verify/${encodeURIComponent(qrDigitalVerificationId)}`;
}
