const sharp = require("sharp");
const path = require("path");

async function makeLogos() {
  const publicImages = path.join(__dirname, "..", "public", "images");

  // 1. KP / MMTI Emblem SVG -> PNG
  const kpkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
    <circle cx="80" cy="80" r="76" fill="#ffffff" stroke="#1b5e20" stroke-width="4"/>
    <circle cx="80" cy="80" r="70" fill="#0e4d26"/>
    <circle cx="80" cy="80" r="54" fill="#ffffff" stroke="#d4a017" stroke-width="2"/>
    <path d="M80 34 A20 20 0 1 0 80 74 A16 16 0 1 1 80 34 Z" fill="#0e4d26"/>
    <polygon points="88,50 91,58 99,58 93,63 95,71 88,66 81,71 83,63 77,58 85,58" fill="#d4a017"/>
    <path d="M44 116 L64 88 L78 104 L96 80 L116 116 Z" fill="#1b5e20"/>
    <rect x="66" y="110" width="28" height="14" fill="#d4a017"/>
    <path d="M68 108 h4 v2 h-4 z M74 108 h4 v2 h-4 z M80 108 h4 v2 h-4 z M86 108 h4 v2 h-4 z" fill="#0e4d26"/>
    <path d="M22 84 C20 114 42 140 80 144 C118 140 140 114 138 84" fill="none" stroke="#2e7d32" stroke-width="6" stroke-linecap="round"/>
  </svg>`;
  await sharp(Buffer.from(kpkSvg)).resize(240, 240).png().toFile(path.join(publicImages, "card-emblem-kpk.png"));

  // 2. DHQ Hospital Crest SVG -> PNG
  const dhqSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
    <circle cx="80" cy="80" r="76" fill="#ffffff" stroke="#b71c1c" stroke-width="4"/>
    <circle cx="80" cy="80" r="70" fill="#b71c1c"/>
    <circle cx="80" cy="80" r="56" fill="#ffffff"/>
    <rect x="77" y="36" width="6" height="88" rx="3" fill="#1b5e20"/>
    <circle cx="80" cy="34" r="6" fill="#d4a017"/>
    <path d="M70 54 Q90 62 80 76 Q70 90 90 98 Q80 112 76 120" fill="none" stroke="#1b5e20" stroke-width="5" stroke-linecap="round"/>
    <circle cx="80" cy="80" r="52" fill="none" stroke="#b71c1c" stroke-width="3"/>
    <text x="80" y="142" font-family="Arial" font-size="9" font-weight="bold" fill="#b71c1c" text-anchor="middle">DHQ HOSPITAL</text>
  </svg>`;
  await sharp(Buffer.from(dhqSvg)).resize(240, 240).png().toFile(path.join(publicImages, "card-emblem-dhq.png"));

  // 3. Signature SVG -> PNG
  const sigSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
    <path d="M15 42 Q35 15 55 35 T95 20 Q120 45 145 18 T185 30" fill="none" stroke="#0d47a1" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M40 38 Q85 8 130 38 T170 34" fill="none" stroke="#0d47a1" stroke-width="2" stroke-linecap="round"/>
    <line x1="10" y1="52" x2="190" y2="52" stroke="#1e293b" stroke-width="1.5"/>
  </svg>`;
  await sharp(Buffer.from(sigSvg)).resize(300, 90).png().toFile(path.join(publicImages, "card-signature.png"));

  // 4. Fallback beneficiary photo
  const photoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 144">
    <rect width="120" height="144" fill="#e2e8f0"/>
    <circle cx="60" cy="52" r="26" fill="#94a3b8"/>
    <path d="M20 134 C20 98 40 88 60 88 C80 88 100 98 100 134 Z" fill="#94a3b8"/>
  </svg>`;
  await sharp(Buffer.from(photoSvg)).resize(180, 216).png().toFile(path.join(publicImages, "card-photo-placeholder.png"));

  console.log("Card logos and assets generated successfully!");
}

makeLogos().catch(console.error);
