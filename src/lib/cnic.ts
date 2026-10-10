export function formatCnic(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 13);
  const parts = [digits.slice(0, 5), digits.slice(5, 12), digits.slice(12, 13)].filter((p) => p.length > 0);
  return parts.join("-");
}

export function isValidCnic(value: string): boolean {
  return /^\d{5}-\d{7}-\d{1}$/.test(value);
}

export function maskCnic(value: string | null | undefined): string {
  if (!value) return "—";
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 1) return "****";
  return `*****-*******-${digits.slice(-1)}`;
}
