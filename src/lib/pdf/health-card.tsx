/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import fs from "fs";
import path from "path";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { extractFamilyCode } from "@/lib/family-code";
export const CARD_WIDTH = 242.65;
export const CARD_HEIGHT = 153.01;

// Official Pakistan National Green & Gold Palette
const PAK_GREEN = "#01411c";
const GOLD = "#c5a059";
const TEXT_DARK = "#0f172a";

function getLocalAssetBase64(filename: string): string {
  try {
    const fullPath = path.join(process.cwd(), "public", "images", filename);
    if (fs.existsSync(fullPath)) {
      const data = fs.readFileSync(fullPath).toString("base64");
      return `data:image/png;base64,${data}`;
    }
  } catch {}
  return "";
}

const s = StyleSheet.create({
  page: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    padding: 3,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  cardFrame: {
    flex: 1,
    borderWidth: 1.2,
    borderColor: PAK_GREEN,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    justifyContent: "space-between",
  },

  // Top Header Banner
  topBanner: {
    backgroundColor: PAK_GREEN,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topTitleEn1: {
    color: "#ffffff",
    fontSize: 6.8,
    fontWeight: "bold",
    letterSpacing: 0.3,
    lineHeight: 1.1,
  },
  topTitleEn2: {
    color: "#ffffff",
    fontSize: 5.6,
    fontWeight: "bold",
    letterSpacing: 0.2,
    lineHeight: 1.1,
  },
  topUrduImg: {
    width: 95,
    height: 13,
    objectFit: "contain",
  },
  goldLine: {
    height: 1.5,
    backgroundColor: GOLD,
  },

  // Middle Body
  frontBody: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftCol: {
    width: "68%",
    justifyContent: "center",
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderTopColor: "transparent",
    borderBottomWidth: 4,
    borderBottomColor: "transparent",
    borderRightWidth: 5,
    borderRightColor: PAK_GREEN,
    marginRight: 3,
  },
  chipImg: {
    width: 25,
    height: 19,
    marginRight: 6,
  },
  cardNoBox: {
    justifyContent: "center",
  },
  cardNoText: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: 0.4,
  },
  validThruText: {
    fontSize: 4.5,
    fontWeight: "bold",
    color: "#475569",
    marginTop: 0.5,
  },
  holderLabel: {
    fontSize: 4.2,
    fontWeight: "bold",
    color: PAK_GREEN,
    textTransform: "uppercase",
    marginTop: 1.5,
  },
  holderName: {
    fontSize: 6.8,
    fontWeight: "bold",
    color: "#0f172a",
  },
  detailsList: {
    marginTop: 1.5,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  detailLabel: {
    width: 54,
    fontSize: 4.5,
    fontWeight: "bold",
    color: PAK_GREEN,
  },
  detailValue: {
    flex: 1,
    fontSize: 4.5,
    fontWeight: "bold",
    color: "#0f172a",
  },
  rightCol: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  photoBox: {
    width: 45,
    height: 52,
    borderWidth: 1.2,
    borderColor: GOLD,
    borderRadius: 3,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  photoImg: {
    width: 45,
    height: 52,
    objectFit: "cover",
  },
  rightHolderName: {
    fontSize: 5,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 1,
    textAlign: "center",
  },
  rightIdText: {
    fontSize: 4,
    color: "#64748b",
    textAlign: "center",
  },
  signatureBox: {
    alignItems: "center",
    marginTop: 1,
  },
  signatureImg: {
    width: 40,
    height: 10,
  },
  directorLabel: {
    fontSize: 4,
    color: PAK_GREEN,
    textAlign: "center",
    marginTop: -0.5,
  },

  // Bottom Footer
  footerBanner: {
    backgroundColor: PAK_GREEN,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    color: "#ffffff",
    fontSize: 4.6,
    fontWeight: "bold",
    letterSpacing: 0.4,
  },
  footerLogo: {
    width: 11,
    height: 11,
  },

  // BACK: Elements
  backBody: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
    justifyContent: "space-between",
  },
  backBanner: {
    backgroundColor: PAK_GREEN,
    paddingVertical: 1.5,
    alignItems: "center",
    borderRadius: 1,
    marginBottom: 2,
  },
  backBannerText: {
    color: "#ffffff",
    fontSize: 4.8,
    fontWeight: "bold",
    letterSpacing: 0.6,
    textAlign: "center",
  },
  tableContainer: {
    borderWidth: 0.8,
    borderColor: PAK_GREEN,
    backgroundColor: "#ffffff",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f0fdf4",
    borderBottomWidth: 0.8,
    borderBottomColor: PAK_GREEN,
    paddingVertical: 1.2,
  },
  tableHeaderCell: {
    fontSize: 4.5,
    fontWeight: "bold",
    color: PAK_GREEN,
    textAlign: "center",
  },
  tableDataRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e1",
    paddingVertical: 1.2,
    alignItems: "center",
  },
  tableCellName: {
    width: "40%",
    fontSize: 4.4,
    fontWeight: "bold",
    color: TEXT_DARK,
    paddingLeft: 3,
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
  backBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  importantInfoBox: {
    width: "72%",
  },
  importantInfoTitle: {
    fontSize: 4.5,
    fontWeight: "bold",
    color: PAK_GREEN,
    marginBottom: 0.8,
  },
  bulletPoint: {
    fontSize: 3.8,
    color: "#334155",
    lineHeight: 1.2,
  },
  qrCodeBox: {
    width: "25%",
    alignItems: "center",
    justifyContent: "center",
  },
  qrImage: {
    width: 28,
    height: 28,
  },
  qrVerifyText: {
    fontSize: 3.8,
    color: PAK_GREEN,
    fontWeight: "bold",
    marginTop: 1,
    textAlign: "center",
  },
});

export function HealthCardPdf({
  card,
  family,
  qrSrc,
  photoSrc,
  healthDeskContact,
  lang = "en",
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
  const cardMembers = members.slice(0, 4);

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

  // Asset base64 URLs
  const dhqEmblem = getLocalAssetBase64("card-emblem-dhq.png");
  const signature = getLocalAssetBase64("card-signature.png");
  const fallbackPhoto = getLocalAssetBase64("card-photo-placeholder.png");
  const chipImg = getLocalAssetBase64("card-chip.png");
  const urduTitleWhite = getLocalAssetBase64("card-urdu-title-white.png");

  const effectivePhoto = photoSrc || fallbackPhoto;

  const validThru = card?.dateOfCardIssue
    ? (() => {
        const d = new Date(card.dateOfCardIssue);
        d.setFullYear(d.getFullYear() + 5);
        return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      })()
    : "12/2030";

  const cardNoDisplay = card?.cardNo?.startsWith("DS") || card?.cardNo?.startsWith("DG")
    ? card.cardNo
    : `${isGhazi ? "DG" : "DS"}${card?.cardNo || "0123456789"}`;

  return (
    <Document>
      {/* ========================================================
          SIDE 1: FRONT (Exact Pakistani CNIC Horizontal Size: 85.6mm x 54mm)
         ======================================================== */}
      <Page size={[CARD_WIDTH, CARD_HEIGHT]} style={s.page}>
        <View style={s.cardFrame}>
          {/* Top Header Banner */}
          <View style={s.topBanner}>
            <View>
              <Text style={s.topTitleEn1}>{isGhazi ? "DERAJAT GHAZIS" : "DERAJAT SHUHADA"}</Text>
              <Text style={s.topTitleEn2}>{isGhazi ? "HONOUR & HEALTH CARD" : "FAMILY HEALTH CARD"}</Text>
            </View>
            {urduTitleWhite ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={urduTitleWhite} style={s.topUrduImg} />
            ) : null}
          </View>
          <View style={s.goldLine} />

          {/* Middle Body */}
          <View style={s.frontBody}>
            {/* Left Column: Chip & Beneficiary Data */}
            <View style={s.leftCol}>
              <View style={s.chipRow}>
                <View style={s.arrow} />
                {chipImg ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <Image src={chipImg} style={s.chipImg} />
                ) : null}
                <View style={s.cardNoBox}>
                  <Text style={s.cardNoText}>{cardNoDisplay}</Text>
                  <Text style={s.validThruText}>VALID THRU: {validThru}</Text>
                </View>
              </View>

              <Text style={s.holderLabel}>{isGhazi ? "GHAZI'S NAME" : "HOLDER'S NAME"}</Text>
              <Text style={s.holderName}>{family?.shaheedName || "—"}</Text>

              <View style={s.detailsList}>
                <View style={s.detailRow}>
                  <Text style={s.detailLabel}>{isGhazi ? "Ghazi CNIC:" : "Shaheed CNIC:"}</Text>
                  <Text style={s.detailValue}>{family?.shaheedCnic || "—"}</Text>
                </View>
                <View style={s.detailRow}>
                  <Text style={s.detailLabel}>{isGhazi ? "Force / Dept:" : "Organization:"}</Text>
                  <Text style={s.detailValue}>{family?.shaheedDepartment || "Police"}</Text>
                </View>
                <View style={s.detailRow}>
                  <Text style={s.detailLabel}>{isGhazi ? "Veteran Code:" : "Family Code:"}</Text>
                  <Text style={[s.detailValue, { color: PAK_GREEN }]}>#{extractFamilyCode(family)}</Text>
                </View>
                <View style={s.detailRow}>
                  <Text style={s.detailLabel}>District:</Text>
                  <Text style={s.detailValue}>{family?.shaheedPermanentDistrict || "Dera Ismail Khan"}</Text>
                </View>
              </View>
            </View>

            {/* Right Column: Photo & Signature */}
            <View style={s.rightCol}>
              <View style={s.photoBox}>
                {effectivePhoto ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <Image src={effectivePhoto} style={s.photoImg} />
                ) : (
                  <Text style={{ fontSize: 5, color: "#94a3b8" }}>PHOTO</Text>
                )}
              </View>
              <Text style={s.rightHolderName}>{family?.shaheedName || "—"}</Text>
              <Text style={s.rightIdText}>ID: {isGhazi ? "DG" : "DS"}-FHC-{extractFamilyCode(family)}</Text>

              <View style={s.signatureBox}>
                {signature ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <Image src={signature} style={s.signatureImg} />
                ) : (
                  <View style={{ width: 40, height: 1, backgroundColor: PAK_GREEN, marginTop: 4 }} />
                )}
                <Text style={s.directorLabel}>Hospital Director</Text>
              </View>
            </View>
          </View>

          {/* Bottom Footer Banner */}
          <View style={s.footerBanner}>
            <Text style={s.footerText}>DEPARTMENT OF HEALTH &amp; FAMILY WELFARE</Text>
            {dhqEmblem ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={dhqEmblem} style={s.footerLogo} />
            ) : null}
          </View>
        </View>
      </Page>

      {/* ========================================================
          SIDE 2: BACK (Eligible Members, Information & QR Code)
         ======================================================== */}
      <Page size={[CARD_WIDTH, CARD_HEIGHT]} style={s.page}>
        <View style={s.cardFrame}>
          {/* Top Header Banner */}
          <View style={s.topBanner}>
            <View>
              <Text style={s.topTitleEn1}>{isGhazi ? "DERAJAT GHAZIS" : "DERAJAT SHUHADA"}</Text>
              <Text style={s.topTitleEn2}>{isGhazi ? "HONOUR & HEALTH CARD" : "FAMILY HEALTH CARD"}</Text>
            </View>
            {urduTitleWhite ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={urduTitleWhite} style={s.topUrduImg} />
            ) : null}
          </View>
          <View style={s.goldLine} />

          {/* Back Body */}
          <View style={s.backBody}>
            {/* Green Section Banner */}
            <View style={s.backBanner}>
              <Text style={s.backBannerText}>{isGhazi ? "GHAZI BENEFICIARIES / FAMILY" : "ELIGIBLE FAMILY MEMBERS"}</Text>
            </View>

            {/* Table */}
            <View style={s.tableContainer}>
              <View style={s.tableHeaderRow}>
                <Text style={[s.tableHeaderCell, { width: "40%", borderRightWidth: 0.8, borderRightColor: PAK_GREEN }]}>
                  Name
                </Text>
                <Text style={[s.tableHeaderCell, { width: "26%", borderRightWidth: 0.8, borderRightColor: PAK_GREEN }]}>
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
                    No family members recorded
                  </Text>
                </View>
              )}
            </View>

            {/* Bottom Area: Important Information + QR Code */}
            <View style={s.backBottomRow}>
              <View style={s.importantInfoBox}>
                <Text style={s.importantInfoTitle}>IMPORTANT INFORMATION</Text>
                <Text style={s.bulletPoint}>• Valid across all participating teaching hospitals.</Text>
                <Text style={s.bulletPoint}>• Non-transferable. Present at {isGhazi ? "Ghazis / Shuhada" : "Shuhada"} Facilitation Desk.</Text>
                <Text style={s.bulletPoint}>• Report loss immediately to Hospital Director office.</Text>
              </View>

              {/* QR Code placed directly on the back card face */}
              <View style={s.qrCodeBox}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={qrSrc} style={s.qrImage} />
                <Text style={s.qrVerifyText}>Scan to Verify</Text>
              </View>
            </View>
          </View>

          {/* Bottom Footer Banner */}
          <View style={s.footerBanner}>
            <Text style={s.footerText}>MUFTI MEHMOOD MEMORIAL MTI • DERA ISMAIL KHAN</Text>
            {dhqEmblem ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={dhqEmblem} style={s.footerLogo} />
            ) : null}
          </View>
        </View>
      </Page>
    </Document>
  );
}