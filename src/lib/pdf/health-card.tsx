/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import fs from "fs";
import path from "path";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

// ISO ID-1 Standard Credit / PVC Card Dimensions:
// 85.60 mm x 53.98 mm -> 242.65 pt x 153.01 pt
export const CARD_WIDTH = 242.65;
export const CARD_HEIGHT = 153.01;

// Official Palette matching the Designer Card
const NAVY = "#1a365d";        // Deep Navy for institution titles, field labels & table borders
const BLACK_TEXT = "#0f172a";  // Dark crisp text for values
const RED_PILL = "#c62828";    // Bright Crimson Red for badge pill & motto
const BLUE_BANNER = "#1a365d"; // Solid royal navy bar for ELIGIBLE FAMILY MEMBERS

function getLocalAssetBase64(filename: string): string {
  try {
    const fullPath = path.join(process.cwd(), "public", "images", filename);
    if (fs.existsSync(fullPath)) {
      const ext = path.extname(fullPath).toLowerCase().replace(".", "");
      const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
      const data = fs.readFileSync(fullPath).toString("base64");
      return `data:${mime};base64,${data}`;
    }
  } catch {}
  return "";
}

export function resolvePhotoBase64(photoSrc?: string | null): string {
  if (!photoSrc) return "";
  if (photoSrc.startsWith("data:")) return photoSrc;
  try {
    const cleanPath = photoSrc.startsWith("/") ? photoSrc.slice(1) : photoSrc;
    const fullPath = path.join(process.cwd(), "public", cleanPath);
    if (fs.existsSync(fullPath)) {
      const ext = path.extname(fullPath).toLowerCase().replace(".", "");
      const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
      const b64 = fs.readFileSync(fullPath).toString("base64");
      return `data:${mime};base64,${b64}`;
    }
  } catch {}
  return photoSrc;
}

const s = StyleSheet.create({
  page: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    padding: 2.5,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  cardFrame: {
    flex: 1,
    borderWidth: 0.8,
    borderColor: NAVY,
    borderRadius: 3.5,
    overflow: "hidden",
    position: "relative",
    justifyContent: "space-between",
  },
  cardBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CARD_WIDTH - 5,
    height: CARD_HEIGHT - 5,
  },

  // ==========================================
  // FRONT SIDE STYLES (MATCHING DESIGNER EXACT SCALE)
  // ==========================================
  frontContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "space-between",
  },
  frontHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  emblemLeft: {
    width: 32,
    height: 32,
  },
  emblemRight: {
    width: 32,
    height: 32,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 2,
    marginTop: -0.5,
  },
  instTitle1: {
    fontSize: 6.8,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.25,
    textAlign: "center",
    lineHeight: 1.15,
  },
  instTitle2: {
    fontSize: 6.8,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.25,
    textAlign: "center",
    lineHeight: 1.15,
  },
  instTitle3: {
    fontSize: 7.8,
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: 0.35,
    textAlign: "center",
    lineHeight: 1.15,
  },
  redPill: {
    backgroundColor: RED_PILL,
    borderRadius: 8,
    paddingVertical: 1.5,
    paddingHorizontal: 12,
    marginTop: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  redPillText: {
    color: "#ffffff",
    fontSize: 7.2,
    fontWeight: "bold",
    letterSpacing: 0.6,
    textAlign: "center",
  },
  familyHealthCardTitle: {
    fontSize: 7.8,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.5,
    textAlign: "center",
    marginTop: 1.5,
  },
  mottoQuote: {
    fontSize: 5.2,
    color: RED_PILL,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 0.8,
  },

  // Front Middle / Body Area (Properly spaced down to lower half)
  frontBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flex: 1,
    marginTop: 2,
    paddingHorizontal: 2,
  },
  leftDataCol: {
    width: "68%",
    justifyContent: "space-around",
    height: 72,
    paddingBottom: 2,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 2.5,
  },
  dataLabel: {
    width: 72,
    fontSize: 7.2,
    fontWeight: "bold",
    color: NAVY,
  },
  dataValue: {
    flex: 1,
    fontSize: 7.2,
    color: BLACK_TEXT,
    fontWeight: "bold",
  },

  // Right Photo & Director Signature
  rightCol: {
    width: "30%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  photoBox: {
    width: 48,
    height: 56,
    borderWidth: 0.8,
    borderColor: "#0f172a",
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  photoImg: {
    width: 48,
    height: 56,
    objectFit: "cover",
  },
  directorSignBox: {
    alignItems: "center",
    marginTop: 1.5,
  },
  signatureImg: {
    width: 46,
    height: 12,
    objectFit: "contain",
  },
  signLine: {
    width: 52,
    height: 0.6,
    backgroundColor: "#0f172a",
    marginTop: 0.5,
  },
  directorLabel: {
    fontSize: 5.2,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
    marginTop: 0.8,
  },

  // ==========================================
  // BACK SIDE STYLES (EXACT DESIGNER SCALE - NO QR CODE)
  // ==========================================
  backContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "space-between",
  },
  backHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  backHeaderCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 2,
  },
  subSlogan1: {
    fontSize: 4.4,
    fontWeight: "bold",
    color: "#334155",
    textAlign: "center",
    letterSpacing: 0.6,
    marginTop: 1.0,
  },
  subSlogan2: {
    fontSize: 4.4,
    fontWeight: "bold",
    color: NAVY,
    textAlign: "center",
    letterSpacing: 0.6,
    marginTop: 0.4,
  },
  sacrificesBox: {
    width: 56,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  sacrificesText: {
    fontSize: 5.4,
    fontWeight: "bold",
    color: RED_PILL,
    textAlign: "left",
    lineHeight: 1.15,
    letterSpacing: 0.25,
  },

  // Back Table
  blueBanner: {
    backgroundColor: BLUE_BANNER,
    paddingVertical: 2.2,
    alignItems: "center",
    borderRadius: 1,
    marginTop: 2.5,
  },
  blueBannerText: {
    color: "#ffffff",
    fontSize: 6.5,
    fontWeight: "bold",
    letterSpacing: 0.6,
    textAlign: "center",
  },
  tableContainer: {
    borderWidth: 0.8,
    borderColor: NAVY,
    backgroundColor: "#ffffff",
    marginTop: 0,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderBottomWidth: 0.8,
    borderBottomColor: NAVY,
    paddingVertical: 2.2,
  },
  tableHeaderCell: {
    fontSize: 5.8,
    fontWeight: "bold",
    color: NAVY,
    textAlign: "center",
  },
  tableDataRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e1",
    paddingVertical: 2.2,
    alignItems: "center",
  },
  tableCellName: {
    width: "40%",
    fontSize: 5.6,
    fontWeight: "bold",
    color: BLACK_TEXT,
    paddingLeft: 4,
    borderRightWidth: 0.5,
    borderRightColor: "#cbd5e1",
  },
  tableCellRelation: {
    width: "26%",
    fontSize: 5.6,
    color: "#334155",
    textAlign: "center",
    borderRightWidth: 0.5,
    borderRightColor: "#cbd5e1",
  },
  tableCellCnic: {
    width: "34%",
    fontSize: 5.4,
    color: "#334155",
    textAlign: "center",
  },

  // Back Bottom Information (Clean centered layout without QR code)
  importantInfoBox: {
    width: "100%",
    alignItems: "center",
    marginTop: 2.5,
  },
  importantInfoTitle: {
    fontSize: 6.2,
    fontWeight: "bold",
    color: NAVY,
    textAlign: "center",
    marginBottom: 1.5,
  },
  bulletsContainer: {
    width: "90%",
  },
  bulletPoint: {
    fontSize: 4.8,
    color: "#1e293b",
    lineHeight: 1.3,
    textAlign: "left",
  },
});

export function HealthCardPdf({
  card,
  family,
  photoSrc,
  category,
}: {
  card: any;
  family: any;
  qrSrc?: string;
  photoSrc?: string | null;
  healthDeskContact?: string | null;
  lang?: string;
  category?: "shaheed" | "ghazi";
}) {
  const members: any[] = Array.isArray(family?.members) && family.members.length > 0 ? family.members : [];
  const cardMembers = members.slice(0, 3); // Top eligible members fit cleanly in standard ID card table

  const isGhazi =
    category === "ghazi" ||
    card?.category === "ghazi" ||
    family?.category === "ghazi" ||
    card?.cardNo?.toUpperCase().includes("GZ") ||
    card?.cardNo?.toUpperCase().includes("DG") ||
    family?.registrationNo?.toUpperCase().includes("GZ") ||
    family?.registrationNo?.toUpperCase().includes("DG") ||
    (typeof family?.specialDependencyDisability === "string" &&
      family.specialDependencyDisability.toLowerCase().includes("ghazi"));

  // Exact Assets cropped and cleaned from the Designer card
  const kpkEmblem = getLocalAssetBase64("card-emblem-kpk.png");
  const dhqEmblem = getLocalAssetBase64("card-emblem-dhq.png");
  const signature = getLocalAssetBase64("card-signature.png");
  const fallbackPhoto = getLocalAssetBase64("card-photo-placeholder.png");
  const cardBg = getLocalAssetBase64("card-official-bg.png") || getLocalAssetBase64("card-bg-template.png");

  const effectivePhoto = resolvePhotoBase64(photoSrc) || fallbackPhoto;

  // Beneficiary Data formatted matching the Designer Card
  const personName = family?.shaheedName || "—";
  const orgName = family?.shaheedDepartment || "Police";
  const rawServiceNo = family?.shaheedServiceNo ? String(family.shaheedServiceNo).replace(/^No\.\s*/i, "") : null;
  const cnicValue = family?.shaheedCnic || rawServiceNo || family?.shaheedBeltNo || "—";
  const districtValue = family?.shaheedPermanentDistrict || "DIKhan";

  return (
    <Document>
      {/* ========================================================
          SIDE 1: FRONT (Exact Designer PVC Card Layout)
         ======================================================== */}
      <Page size={[CARD_WIDTH, CARD_HEIGHT]} style={s.page}>
        <View style={s.cardFrame}>
          {/* Official Security Guilloche & Watermark Background */}
          {cardBg ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={cardBg} style={s.cardBackground} />
          ) : null}

          <View style={s.frontContainer}>
            {/* Top Header Row with KPK & DHQ Emblems */}
            <View style={s.frontHeader}>
              {kpkEmblem ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image src={kpkEmblem} style={s.emblemLeft} />
              ) : (
                <View style={s.emblemLeft} />
              )}

              <View style={s.headerCenter}>
                <Text style={s.instTitle1}>MUFTI MEHMOOD MEMORIAL</Text>
                <Text style={s.instTitle2}>MEDICAL TEACHING INSTITUTION</Text>
                <Text style={s.instTitle3}>DERA ISMAIL KHAN</Text>

                {/* Red Capsule / Pill Badge */}
                <View style={s.redPill}>
                  <Text style={s.redPillText}>{isGhazi ? "DERAJAT GHAZIAN" : "SHUHADA-E-DERAJAT"}</Text>
                </View>

                {/* Card Title */}
                <Text style={s.familyHealthCardTitle}>FAMILY HEALTH CARD</Text>

                {/* Official Slogan */}
                <Text style={s.mottoQuote}>
                  {isGhazi
                    ? "“Honouring the Ghazis by Caring for Their Families”"
                    : "“Honouring the Shuhada by Caring for Their Families”"}
                </Text>
              </View>

              {dhqEmblem ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image src={dhqEmblem} style={s.emblemRight} />
              ) : (
                <View style={s.emblemRight} />
              )}
            </View>

            {/* Middle / Body Area */}
            <View style={s.frontBody}>
              {/* Left Column: Beneficiary Details */}
              <View style={s.leftDataCol}>
                <View style={s.dataRow}>
                  <Text style={s.dataLabel}>{isGhazi ? "Name of Ghazi:" : "Name of Shaheed:"}</Text>
                  <Text style={s.dataValue}>{personName}</Text>
                </View>
                <View style={s.dataRow}>
                  <Text style={s.dataLabel}>Organization:</Text>
                  <Text style={s.dataValue}>{orgName}</Text>
                </View>
                <View style={s.dataRow}>
                  <Text style={s.dataLabel}>CNIC:</Text>
                  <Text style={s.dataValue}>{cnicValue}</Text>
                </View>
                <View style={s.dataRow}>
                  <Text style={s.dataLabel}>District:</Text>
                  <Text style={s.dataValue}>{districtValue}</Text>
                </View>
              </View>

              {/* Right Column: Photo & Hospital Director Signature */}
              <View style={s.rightCol}>
                <View style={s.photoBox}>
                  {effectivePhoto ? (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <Image src={effectivePhoto} style={s.photoImg} />
                  ) : (
                    <Text style={{ fontSize: 5, color: "#94a3b8" }}>PHOTO</Text>
                  )}
                </View>

                <View style={s.directorSignBox}>
                  {signature ? (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <Image src={signature} style={s.signatureImg} />
                  ) : (
                    <View style={{ width: 46, height: 12 }} />
                  )}
                  <View style={s.signLine} />
                  <Text style={s.directorLabel}>Hospital Director</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* ========================================================
          SIDE 2: BACK (Eligible Members Table & Info - NO QR CODE)
         ======================================================== */}
      <Page size={[CARD_WIDTH, CARD_HEIGHT]} style={s.page}>
        <View style={s.cardFrame}>
          {/* Security Background */}
          {cardBg ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={cardBg} style={s.cardBackground} />
          ) : null}

          <View style={s.backContainer}>
            {/* Top Header Row */}
            <View style={s.backHeader}>
              {dhqEmblem ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image src={dhqEmblem} style={{ width: 28, height: 28 }} />
              ) : (
                <View style={{ width: 28, height: 28 }} />
              )}

              <View style={s.backHeaderCenter}>
                <View style={[s.redPill, { paddingVertical: 1.2, paddingHorizontal: 10, marginTop: 0 }]}>
                  <Text style={[s.redPillText, { fontSize: 6.8 }]}>
                    {isGhazi ? "DERAJAT GHAZIAN" : "SHUHADA-E-DERAJAT"}
                  </Text>
                </View>
                <Text style={[s.familyHealthCardTitle, { fontSize: 7.2, marginTop: 1.0 }]}>
                  FAMILY HEALTH CARD
                </Text>
                <Text style={s.subSlogan1}>HEATH | SERVICE | COMPASSION</Text>
                <Text style={s.subSlogan2}>FOR A STRONGER PAKISTAN</Text>
              </View>

              <View style={s.sacrificesBox}>
                <Text style={s.sacrificesText}>THEIR</Text>
                <Text style={s.sacrificesText}>SACRIFICES</Text>
                <Text style={s.sacrificesText}>WILL NOT GO</Text>
                <Text style={s.sacrificesText}>IN VAIN</Text>
              </View>
            </View>

            {/* Blue Banner: ELIGIBLE FAMILY MEMBERS */}
            <View style={s.blueBanner}>
              <Text style={s.blueBannerText}>ELIGIBLE FAMILY MEMBERS</Text>
            </View>

            {/* Table */}
            <View style={s.tableContainer}>
              <View style={s.tableHeaderRow}>
                <Text style={[s.tableHeaderCell, { width: "40%", borderRightWidth: 0.8, borderRightColor: NAVY }]}>
                  Name
                </Text>
                <Text style={[s.tableHeaderCell, { width: "26%", borderRightWidth: 0.8, borderRightColor: NAVY }]}>
                  Relation
                </Text>
                <Text style={[s.tableHeaderCell, { width: "34%" }]}>CNIC/B-Form No.</Text>
              </View>

              {cardMembers.map((m: any, idx: number) => (
                <View
                  key={idx}
                  style={[s.tableDataRow, idx === cardMembers.length - 1 ? { borderBottomWidth: 0 } : {}]}
                >
                  <Text style={s.tableCellName}>{m?.name || "—"}</Text>
                  <Text style={s.tableCellRelation}>{m?.relationship || "—"}</Text>
                  <Text style={s.tableCellCnic}>{m?.cnicBForm || "—"}</Text>
                </View>
              ))}

              {cardMembers.length === 0 && (
                <View style={s.tableDataRow}>
                  <Text
                    style={[
                      s.tableCellName,
                      { width: "100%", textAlign: "center", borderRightWidth: 0, color: "#64748b" },
                    ]}
                  >
                    No additional family members registered
                  </Text>
                </View>
              )}
            </View>

            {/* Bottom Section: Important Information (Centered bullets, exact designer layout, NO QR) */}
            <View style={s.importantInfoBox}>
              <Text style={s.importantInfoTitle}>IMPORTANT INFORMATION</Text>
              <View style={s.bulletsContainer}>
                <Text style={s.bulletPoint}>• Valid for eligible family members as per institutional policy.</Text>
                <Text style={s.bulletPoint}>• Non-transferable.</Text>
                <Text style={s.bulletPoint}>• Misuse may lead to cancellation.</Text>
                <Text style={s.bulletPoint}>• Report loss immediately.</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
