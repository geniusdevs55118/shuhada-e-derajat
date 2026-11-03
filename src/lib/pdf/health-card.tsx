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
      const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "png" ? "image/png" : "image/jpeg";
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
  // FRONT SIDE STYLES
  // ==========================================
  frontContainer: {
    flex: 1,
    paddingHorizontal: 7,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: "space-between",
  },
  frontHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emblemLeft: {
    width: 27,
    height: 27,
  },
  emblemRight: {
    width: 27,
    height: 27,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 2,
  },
  instTitle1: {
    fontSize: 5.2,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.2,
    textAlign: "center",
    lineHeight: 1.15,
  },
  instTitle2: {
    fontSize: 5.2,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.2,
    textAlign: "center",
    lineHeight: 1.15,
  },
  instTitle3: {
    fontSize: 5.8,
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: 0.3,
    textAlign: "center",
    lineHeight: 1.15,
  },
  redPill: {
    backgroundColor: RED_PILL,
    borderRadius: 7,
    paddingVertical: 1.2,
    paddingHorizontal: 9,
    marginTop: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  redPillText: {
    color: "#ffffff",
    fontSize: 5.8,
    fontWeight: "bold",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  familyHealthCardTitle: {
    fontSize: 6.2,
    fontWeight: "bold",
    color: NAVY,
    letterSpacing: 0.4,
    textAlign: "center",
    marginTop: 1.2,
  },
  mottoQuote: {
    fontSize: 4.2,
    color: RED_PILL,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 0.8,
  },

  // Front Middle / Body Area
  frontBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flex: 1,
    marginTop: 2,
  },
  leftDataCol: {
    width: "68%",
    justifyContent: "center",
    paddingBottom: 2,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2.8,
  },
  dataLabel: {
    width: 65,
    fontSize: 5.5,
    fontWeight: "bold",
    color: NAVY,
  },
  dataValue: {
    flex: 1,
    fontSize: 5.5,
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
    width: 44,
    height: 52,
    borderWidth: 0.8,
    borderColor: "#0f172a",
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  photoImg: {
    width: 44,
    height: 52,
    objectFit: "cover",
  },
  directorSignBox: {
    alignItems: "center",
    marginTop: 1,
  },
  signatureImg: {
    width: 44,
    height: 11,
    objectFit: "contain",
  },
  signLine: {
    width: 50,
    height: 0.6,
    backgroundColor: "#0f172a",
    marginTop: 0.5,
  },
  directorLabel: {
    fontSize: 4.2,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
    marginTop: 0.8,
  },

  // ==========================================
  // BACK SIDE STYLES
  // ==========================================
  backContainer: {
    flex: 1,
    paddingHorizontal: 7,
    paddingTop: 5,
    paddingBottom: 4,
    justifyContent: "space-between",
  },
  backHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backHeaderCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 2,
  },
  subSlogan1: {
    fontSize: 3.4,
    color: "#334155",
    textAlign: "center",
    letterSpacing: 0.6,
    marginTop: 0.8,
  },
  subSlogan2: {
    fontSize: 3.4,
    fontWeight: "bold",
    color: NAVY,
    textAlign: "center",
    letterSpacing: 0.6,
    marginTop: 0.3,
  },
  sacrificesBox: {
    width: 50,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  sacrificesText: {
    fontSize: 4.4,
    fontWeight: "bold",
    color: RED_PILL,
    textAlign: "left",
    lineHeight: 1.15,
    letterSpacing: 0.2,
  },

  // Back Table
  blueBanner: {
    backgroundColor: BLUE_BANNER,
    paddingVertical: 1.8,
    alignItems: "center",
    borderRadius: 1,
    marginTop: 2,
  },
  blueBannerText: {
    color: "#ffffff",
    fontSize: 5.0,
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
    paddingVertical: 1.5,
  },
  tableHeaderCell: {
    fontSize: 4.6,
    fontWeight: "bold",
    color: NAVY,
    textAlign: "center",
  },
  tableDataRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e1",
    paddingVertical: 1.4,
    alignItems: "center",
  },
  tableCellName: {
    width: "40%",
    fontSize: 4.4,
    fontWeight: "bold",
    color: BLACK_TEXT,
    paddingLeft: 4,
    borderRightWidth: 0.5,
    borderRightColor: "#cbd5e1",
  },
  tableCellRelation: {
    width: "26%",
    fontSize: 4.4,
    color: "#334155",
    textAlign: "center",
    borderRightWidth: 0.5,
    borderRightColor: "#cbd5e1",
  },
  tableCellCnic: {
    width: "34%",
    fontSize: 4.2,
    color: "#334155",
    textAlign: "center",
  },

  // Back Bottom Information & QR
  backBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  importantInfoBox: {
    width: "74%",
  },
  importantInfoTitle: {
    fontSize: 4.6,
    fontWeight: "bold",
    color: NAVY,
    marginBottom: 0.8,
  },
  bulletPoint: {
    fontSize: 3.7,
    color: "#1e293b",
    lineHeight: 1.25,
  },
  qrCodeBox: {
    width: "24%",
    alignItems: "center",
    justifyContent: "center",
  },
  qrImage: {
    width: 26,
    height: 26,
  },
  qrVerifyText: {
    fontSize: 3.4,
    color: NAVY,
    fontWeight: "bold",
    marginTop: 0.8,
    textAlign: "center",
  },
});

export function HealthCardPdf({
  card,
  family,
  qrSrc,
  photoSrc,
  category,
}: {
  card: any;
  family: any;
  qrSrc: string;
  photoSrc?: string | null;
  healthDeskContact?: string | null;
  lang?: string;
  category?: "shaheed" | "ghazi";
}) {
  const members: any[] = Array.isArray(family?.members) && family.members.length > 0 ? family.members : [];
  const cardMembers = members.slice(0, 3); // Top 3 eligible members fit cleanly in standard ID card table

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

  // Assets
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
                    <Text style={{ fontSize: 4.5, color: "#94a3b8" }}>PHOTO</Text>
                  )}
                </View>

                <View style={s.directorSignBox}>
                  {signature ? (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <Image src={signature} style={s.signatureImg} />
                  ) : (
                    <View style={{ width: 44, height: 11 }} />
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
          SIDE 2: BACK (Eligible Members Table & Verification)
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
                <Image src={dhqEmblem} style={{ width: 22, height: 22 }} />
              ) : (
                <View style={{ width: 22, height: 22 }} />
              )}

              <View style={s.backHeaderCenter}>
                <View style={[s.redPill, { paddingVertical: 1, paddingHorizontal: 8, marginTop: 0 }]}>
                  <Text style={[s.redPillText, { fontSize: 5.2 }]}>
                    {isGhazi ? "DERAJAT GHAZIAN" : "SHUHADA-E-DERAJAT"}
                  </Text>
                </View>
                <Text style={[s.familyHealthCardTitle, { fontSize: 5.6, marginTop: 0.8 }]}>
                  FAMILY HEALTH CARD
                </Text>
                <Text style={s.subSlogan1}>HEALTH | SERVICE | COMPASSION</Text>
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

            {/* Bottom Row: Important Information & Desk Verification QR */}
            <View style={s.backBottomRow}>
              <View style={s.importantInfoBox}>
                <Text style={s.importantInfoTitle}>IMPORTANT INFORMATION</Text>
                <Text style={s.bulletPoint}>• Valid for eligible family members as per institutional policy.</Text>
                <Text style={s.bulletPoint}>• Non-transferable.</Text>
                <Text style={s.bulletPoint}>• Misuse may lead to cancellation.</Text>
                <Text style={s.bulletPoint}>• Report loss immediately.</Text>
              </View>

              <View style={s.qrCodeBox}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={qrSrc} style={s.qrImage} />
                <Text style={s.qrVerifyText}>Scan to Verify</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
