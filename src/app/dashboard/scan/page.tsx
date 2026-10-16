"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { Ticket, Shield, Award } from "lucide-react";


type VerifyResult = {
  found: boolean;
  valid?: boolean;
  status?: string;
  cardNo?: string;
  familyRegistrationId?: string;
  beneficiaries?: { name: string; relationship: string; beneficiaryId?: string; eligibility: string }[];
  allowedHospitals?: string[];
  message?: string;
  emergencyNote?: string;
};

function tokenFromPayload(payload: string) {
  try {
    const parsed = new URL(payload);
    const match = parsed.pathname.match(/\/verify\/([^/]+)\/?$/);
    if (match) return decodeURIComponent(match[1]);
  } catch {
    // Raw tokens are supported for staff testing.
  }
  return payload.trim();
}

function ScanPageContent() {
  const scanner = useRef<Html5Qrcode | null>(null);
  const decodedOnce = useRef(false);
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get("category") === "ghazi" ? "ghazi" : "shuhada";
  const [scanCategory, setScanCategory] = useState<"shuhada" | "ghazi">(initialCategory);
  const [token, setToken] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState("");
  const [cameraMessage, setCameraMessage] = useState("Starting camera…");
  const [busy, setBusy] = useState(false);

  const verify = useCallback(async (value: string) => {
    const clean = tokenFromPayload(value);
    if (!clean) return;
    setBusy(true);
    setError("");
    setResult(null);
    setToken(clean);
    try {
      const response = await fetch(`/api/verify/${encodeURIComponent(clean)}`);
      const body = await response.json();
      if (!response.ok) {
        setError(body.error ?? "Invalid card");
        setResult({ found: false });
      } else {
        setResult(body);
      }
    } catch {
      setError("Could not reach verification service. Check the connection and try again.");
    } finally {
      setBusy(false);
    }
  }, []);

  const verifyImage = useCallback(async (file: File) => {
    const reader = scanner.current;
    if (!reader) {
      setError("QR scanner is still loading. Refresh the page and try again.");
      return;
    }
    setBusy(true);
    setError("");
    setResult(null);
    try {
      if (reader.isScanning) await reader.stop();
      const decoded = await reader.scanFile(file, false);
      await verify(decoded);
      setCameraMessage("QR read from image.");
    } catch {
      setError("Could not read a QR code from that image. Choose a clear screenshot or photo of the card QR.");
    } finally {
      setBusy(false);
    }
  }, [verify]);

  useEffect(() => {
    let cancelled = false;
    const reader = new Html5Qrcode("card-qr-reader");
    scanner.current = reader;
    reader.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 4 / 3, videoConstraints: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: { ideal: "environment" } } },
      (decoded) => { if (!cancelled && !decodedOnce.current) { decodedOnce.current = true; void reader.stop().catch(() => undefined); void verify(decoded); } },
      () => undefined,
    ).then(() => { if (!cancelled) setCameraMessage(""); })
      .catch((cause: unknown) => {
        const message = cause instanceof Error ? cause.message : String(cause);
        console.error("Health card camera scanner failed to start:", cause);
        setCameraMessage(/permission|denied|notallowed/i.test(message)
          ? `Camera access failed (${message}). Check Chrome Site settings and Windows camera privacy settings, then retry.`
          : /notfound|camera|device/i.test(message)
            ? "No camera is available. Enter the QR token below."
            : "Camera could not start. Enter the QR token below.");
      });
    return () => {
      cancelled = true;
      const active = scanner.current;
      if (active?.isScanning) void active.stop().catch(() => undefined);
    };
  }, [verify]);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Category Toggle: Shuhada | Ghazis */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1">
            Verification Mode:
          </span>
          <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setScanCategory("shuhada")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                scanCategory === "shuhada"
                  ? "bg-[#01411c] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Shield className="size-3.5 text-amber-300" />
              <span>Shuhada Family Card</span>
            </button>
            <button
              type="button"
              onClick={() => setScanCategory("ghazi")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                scanCategory === "ghazi"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Award className="size-3.5 text-amber-200" />
              <span>Derajat Ghazi Card</span>
            </button>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-600 pr-1">
          {scanCategory === "ghazi" ? "🎖️ Scanning Ghazi Veterans" : "🛡️ Scanning Shuhada Families"}
        </span>
      </div>

      <div className="dashboard-page-heading">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-200">
          {scanCategory === "ghazi" ? "🎖️ Derajat Ghazis Verification Desk" : "Card verification"}
        </p>
        <h1 className="text-xl font-bold text-white sm:text-2xl">
          {scanCategory === "ghazi" ? "Scan a Derajat Ghazi Card" : "Scan a Health Card"}
        </h1>
        <p className="mt-1 text-sm text-blue-100/80">
          {scanCategory === "ghazi"
            ? "Scan the QR code or enter token to verify wounded Police, Army, Levies, and FC personnel."
            : "Scan the QR code or enter its token to view the current card record."}
        </p>
        <Link className="mt-2 inline-block text-sm font-semibold text-blue-100 underline" href="/dashboard/verify">
          Open the staff verification screen
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold text-blue-950">Camera scanner</h2>
          <div id="card-qr-reader" className="min-h-64 overflow-hidden rounded-lg bg-slate-950" />
          <p className="mt-2 text-sm text-gray-600" role="status">{cameraMessage || "Point the rear camera at the card QR code."}</p>
          {cameraMessage.toLowerCase().includes("permission") && <button type="button" onClick={() => window.location.reload()} className="mt-3 rounded-md border border-[#01411c] px-3 py-2 text-sm font-semibold text-[#01411c] hover:bg-emerald-50 transition-colors">Retry camera</button>}
        </section>
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold text-emerald-950">Manual token entry</h2>
          <form onSubmit={(event) => { event.preventDefault(); void verify(token); }} className="space-y-3">
            <label className="block text-sm font-medium text-gray-700" htmlFor="qr-token">QR URL or token</label>
            <input id="qr-token" value={token} onChange={(event) => setToken(event.target.value)} className="w-full rounded-md border px-3 py-2 text-sm focus:border-[#01411c] focus:ring-1 focus:ring-[#01411c] outline-none" placeholder="Paste the verification URL or token" />
            <button disabled={busy || !token.trim()} className="rounded-md bg-[#01411c] hover:bg-emerald-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 transition-colors cursor-pointer">{busy ? "Checking…" : "Verify card"}</button>
          </form>
          <div className="mt-5 border-t pt-4">
            <label htmlFor="qr-image" className="mb-2 block text-sm font-medium text-gray-700">Or upload a QR image</label>
            <input id="qr-image" type="file" accept="image/*" disabled={busy} onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) void verifyImage(file); event.currentTarget.value = ""; }} className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-semibold file:text-[#01411c] cursor-pointer" />
            <p className="mt-1 text-xs text-gray-500">Use a screenshot or photo of the QR code if camera access is unavailable.</p>
          </div>
          {error && <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          {result && <div aria-live="polite" className={`mt-4 rounded-lg border p-4 ${result.valid ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
            <p className={`font-bold ${result.valid ? "text-emerald-800" : "text-amber-900"}`}>{result.valid ? `Valid · ${result.status}` : result.found ? `Not valid · ${result.status}` : "Invalid card"}</p>
            {result.found && <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div><dt className="text-gray-500">Card number</dt><dd className="font-semibold">{result.cardNo}</dd></div>
              <div><dt className="text-gray-500">Family registration</dt><dd className="font-semibold">{result.familyRegistrationId}</dd></div>
              <div className="sm:col-span-2"><dt className="text-gray-500">Permitted hospitals</dt><dd>{result.allowedHospitals?.join(", ") || "Not recorded"}</dd></div>
            </dl>}
          </div>}
        </section>
      </div>
      {result?.found && <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b p-4">
          <div>
            <h2 className="font-semibold text-blue-950">Verified Beneficiaries</h2>
            <p className="text-xs text-gray-500">Ready for hospital facilitation & appointment token issuance</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              className="flex items-center gap-1.5 rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800"
              href={`/dashboard/facilitation-booking?card=${encodeURIComponent(result.cardNo ?? result.familyRegistrationId ?? "")}`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Facilitate & Book Appointment Slip</span>
            </Link>
            <Link className="text-xs text-[#01411c] font-bold underline hover:text-emerald-700" href={`/dashboard/health-cards?search=${encodeURIComponent(result.cardNo ?? "")}`}>
              Card register
            </Link>
          </div>
        </div>
        <div className="divide-y">{(result.beneficiaries ?? []).map((person) => <div key={person.beneficiaryId ?? `${person.name}-${person.relationship}`} className="grid grid-cols-2 gap-2 p-3 text-sm sm:grid-cols-4"><span className="font-medium">{person.name}</span><span>{person.relationship}</span><span className="text-gray-500">{person.beneficiaryId ?? ""}</span><span>{person.eligibility}</span></div>)}</div>
        <p className="border-t border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-950 font-medium">{result.emergencyNote}</p>
      </section>}
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading scanner…</div>}>
      <ScanPageContent />
    </Suspense>
  );
}
