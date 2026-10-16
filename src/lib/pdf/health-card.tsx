/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import fs from "fs";
import path from "path";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { extractFamilyCode } from "@/lib/family-code";

// Standard Pakistani CNIC / Smart ID Card Dimensions:
// 85.60 mm x 53.98 mm (ISO/IEC 7810 ID-1 standard)
// In PostScript points (72 DPI): 242.65 pt (width) x 153.01 pt (height)
// HORIZONTAL / LANDSCAPE ORIENTATION
export const CARD_WIDTH = 242.65;
export const CARD_HEIGHT = 153.01;

// Pakistan Flag Green & White Theme
// Deep Pakistan Green (#01411C - official flag green) & Pure White (#FFFFFF)
const CARD_BG = "#ffffff";
const PAK_GREEN = "#01411c";
const PAK_GREEN_MID = "#065f46";
const PAK_GREEN_LIGHT = "#f0fdf4";
const BORDER_COLOR = "#01411c";
const TEXT_DARK = "#0f172a";

const NAVY = PAK_GREEN;
const DARK_BLUE = PAK_GREEN;
const RED_BADGE = PAK_GREEN;
const MAROON_TEXT = PAK_GREEN_MID;

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
    padding: 5,
    fontFamily: "Helvetica",
    backgroundColor: CARD_BG,
  },
  cardFrame: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 4,
    padding: 4,
    backgroundColor: CARD_BG,
    justifyContent: "space-between",
    position: "relative",
  },
  cardBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 232.65,
    height: 143.01,
    borderRadius: 3.5,
  },

  // FRONT: Header
  frontHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emblemLeft: {
    width: 25,
    height: 25,
  },
  emblemRight: {
    width: 25,
    height: 25,
  },
  frontHeaderCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 2,
  },
  instTitle: {
    fontSize: 4.8,
    fontWeight: "bold",
    color: NAVY,
    textAlign: "center",
    lineHeight: 1.15,
  },
  badgeRed: {
    backgroundColor: RED_BADGE,
    borderRadius: 6,
    paddingVertical: 1.2,
    paddingHorizontal: 10,
    marginTop: 1,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 6.5,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.4,
  },
  familyHealthCardTitle: {
    fontSize: 6,
    fontWeight: "bold",
    color: DARK_BLUE,
    textAlign: "center",
    marginTop: 1,
  },
  urduCardTitle: {
    width: 95,
    height: 8.7,
    marginTop: 1,
    alignSelf: "center",
  },
  mottoText: {
    fontSize: 3.8,
    color: MAROON_TEXT,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 0.5,
  },

  // FRONT: Body
  frontBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    marginTop: 2,
    paddingHorizontal: 2,
  },
  infoList: {
    width: "70%",
    justifyContent: "center",
    paddingRight: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2.2,
  },
  infoLabel: {
    width: 62,
    fontSize: 5.1,
    fontWeight: "bold",
    color: DARK_BLUE,
  },
  infoValue: {
    flex: 1,
    fontSize: 5.1,
    fontWeight: "bold",
    color: TEXT_DARK,
  },
  photoColumn: {
    width: "28%",
    alignItems: "center",
    justifyContent: "center",
  },
  photoBox: {
    width: 44,
    height: 52,
    borderWidth: 0.8,
    borderColor: PAK_GREEN,
    borderRadius: 2,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  photoImg: {
    width: 44,
    height: 52,
    objectFit: "cover",
  },
  signatureBox: {
    alignItems: "center",
    marginTop: 1.5,
  },
  signatureImg: {
    width: 46,
    height: 12,
  },
  directorLabel: {
    fontSize: 4.5,
    color: PAK_GREEN,
    textAlign: "center",
    marginTop: -1,
  },

  // BACK: Header
  backHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backHeaderCenter: {
    alignItems: "center",
    flex: 1,
  },
  backRightSlogan: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  sloganSacrifice: {
    fontSize: 4.8,
    fontWeight: "bold",
    color: MAROON_TEXT,
  },
  sloganResponsibility: {
    fontSize: 4.6,
    fontWeight: "bold",
    color: NAVY,
  },
  subSlogan: {
    fontSize: 3.2,
    color: DARK_BLUE,
    textAlign: "center",
    marginTop: 0.5,
  },

  // BACK: Blue Table Banner
  blueBanner: {
    backgroundColor: DARK_BLUE,
    paddingVertical: 1.5,
    alignItems: "center",
    borderRadius: 1,
    marginTop: 1.5,
  },
  blueBannerText: {
    color: "#ffffff",
    fontSize: 5,
    fontWeight: "bold",
    letterSpacing: 0.6,
    textAlign: "center",
  },

  // BACK: Table
  tableContainer: {
    borderWidth: 0.8,
    borderColor: DARK_BLUE,
    backgroundColor: "#ffffff",
    marginTop: 1,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 0.8,
    borderBottomColor: DARK_BLUE,
    backgroundColor: PAK_GREEN_LIGHT,
  },
  tableHeaderCell: {
    fontSize: 4.5,
    fontWeight: "bold",
    color: DARK_BLUE,
    paddingVertical: 1,
    textAlign: "center",
  },
  tableDataRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e1",
    alignItems: "center",
  },
  tableCellName: {
    width: "40%",
    fontSize: 4.3,
    fontWeight: "bold",
    color: TEXT_DARK,
    paddingVertical: 1,
    paddingHorizontal: 2,
    borderRightWidth: 0.8,
    borderRightColor: DARK_BLUE,
  },
  tableCellRelation: {
    width: "26%",
    fontSize: 4.3,
    color: TEXT_DARK,
    paddingVertical: 1,
    textAlign: "center",
    borderRightWidth: 0.8,
    borderRightColor: DARK_BLUE,
  },
  tableCellCnic: {
    width: "34%",
    fontSize: 4.3,
    color: TEXT_DARK,
    paddingVertical: 1,
    textAlign: "center",
  },

  // BACK: Bottom Info & QR
  backBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    paddingHorizontal: 1,
  },
  importantInfoBox: {
    width: "74%",
  },
  importantInfoTitle: {
    fontSize: 4.6,
    fontWeight: "bold",
    color: DARK_BLUE,
    textAlign: "center",
    marginBottom: 1,
  },
  bulletPoint: {
    fontSize: 3.6,
    color: TEXT_DARK,
    lineHeight: 1.25,
    marginLeft: 3,
  },
  qrCodeBox: {
    width: "24%",
    alignItems: "center",
    justifyContent: "center",
  },
  qrImage: {
    width: 32,
    height: 32,
    borderRadius: 1,
  },
  qrVerifyText: {
    fontSize: 3.2,
    fontWeight: "bold",
    color: DARK_BLUE,
    textAlign: "center",
    marginTop: 0.5,
  },
});

export function HealthCardPdf({
  card,
  family,
  qrSrc,
  photoSrc,
  lang = "en",
}: {
  card: any;
  family: any;
  qrSrc: string;
  photoSrc?: string | null;
  healthDeskContact?: string | null;
  lang?: string;
}) {
  const members: any[] = Array.isArray(family?.members) && family.members.length > 0 ? family.members : [];
  const cardMembers = members.slice(0, 4);

  // Asset base64 URLs
  const kpkEmblem = getLocalAssetBase64("card-emblem-kpk.png");
  const dhqEmblem = getLocalAssetBase64("card-emblem-dhq.png");
  const signature = getLocalAssetBase64("card-signature.png");
  const fallbackPhoto = getLocalAssetBase64("card-photo-placeholder.png");
  const urduTitleImg = getLocalAssetBase64("card-urdu-title.png");
  const cardBgTemplate = getLocalAssetBase64("card-bg-template.png");

  const effectivePhoto = photoSrc || fallbackPhoto;

  return (
    <Document>
      {/* ========================================================
          SIDE 1: FRONT (Exact Pakistani CNIC Horizontal Size: 85.6mm x 54mm)
          NO orientation prop so react-pdf preserves exact [242.65, 153.01] width x height
         ======================================================== */}
      <Page size={[CARD_WIDTH, CARD_HEIGHT]} style={s.page}>
        <View style={s.cardFrame}>
          {cardBgTemplate ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={cardBgTemplate} style={s.cardBackground} />
          ) : null}
          {/* Header */}
          <View style={s.frontHeader}>
            {kpkEmblem ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={kpkEmblem} style={s.emblemLeft} />
            ) : (
              <View style={s.emblemLeft} />
            )}

            <View style={s.frontHeaderCenter}>
              <Text style={s.instTitle}>MUFTI MEHMOOD MEMORIAL</Text>
              <Text style={s.instTitle}>MEDICAL TEACHING INSTITUTION</Text>
              <Text style={s.instTitle}>DERA ISMAIL KHAN</Text>

              <View style={s.badgeRed}>
                <Text style={s.badgeText}>SHUHADA-E-DERAJAT</Text>
              </View>

              {lang === "ur" && urduTitleImg ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image src={urduTitleImg} style={s.urduCardTitle} />
              ) : (
                <Text style={s.familyHealthCardTitle}>FAMILY HEALTH CARD</Text>
              )}
              <Text style={s.mottoText}>"Honouring the Shuhda by Caring for Their Families"</Text>
            </View>

            {dhqEmblem ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={dhqEmblem} style={s.emblemRight} />
            ) : (
              <View style={s.emblemRight} />
            )}
          </View>

          {/* Body: Left Info Details + Right Photo & Signature */}
          <View style={s.frontBody}>
            {/* Left Details */}
            <View style={s.infoList}>
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Name of Shuhada:</Text>
                <Text style={s.infoValue}>{family?.shaheedName || "—"}</Text>
              </View>

              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Shaheed CNIC:</Text>
                <Text style={s.infoValue}>{family?.shaheedCnic || "—"}</Text>
              </View>

              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Organization:</Text>
                <Text style={s.infoValue}>{family?.shaheedDepartment || "Police"}</Text>
              </View>

              <View style={s.infoRow}>
                <Text style={s.infoLabel}>I-Card No:</Text>
                <Text style={s.infoValue}>{card?.cardNo || "—"}</Text>
              </View>

              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Family Code:</Text>
                <Text style={[s.infoValue, { color: PAK_GREEN }]}>#{extractFamilyCode(family)}</Text>
              </View>

              <View style={s.infoRow}>
                <Text style={s.infoLabel}>District:</Text>
                <Text style={s.infoValue}>{family?.shaheedPermanentDistrict || "Dera Ismail Khan"}</Text>
              </View>

              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Date of Issue:</Text>
                <Text style={s.infoValue}>
                  {card?.dateOfCardIssue ? new Date(card.dateOfCardIssue).toLocaleDateString("en-GB") : new Date().toLocaleDateString("en-GB")}
                </Text>
              </View>
            </View>

            {/* Right Photo & Director Signature */}
            <View style={s.photoColumn}>
              <View style={s.photoBox}>
                {effectivePhoto ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <Image src={effectivePhoto} style={s.photoImg} />
                ) : (
                  <Text style={{ fontSize: 6, color: "#94a3b8" }}>PHOTO</Text>
                )}
              </View>

              <View style={s.signatureBox}>
                {signature ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <Image src={signature} style={s.signatureImg} />
                ) : (
                  <View style={{ width: 46, height: 1, backgroundColor: PAK_GREEN, marginTop: 8 }} />
                )}
                <Text style={s.directorLabel}>Hospital Director</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* ========================================================
          SIDE 2: BACK (Eligible Members, Information & QR Code)
         ======================================================== */}
      <Page size={[CARD_WIDTH, CARD_HEIGHT]} style={s.page}>
        <View style={s.cardFrame}>
          {cardBgTemplate ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={cardBgTemplate} style={s.cardBackground} />
          ) : null}
          {/* Header */}
          <View style={s.backHeader}>
            {dhqEmblem ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={dhqEmblem} style={{ width: 18, height: 18 }} />
            ) : (
              <View style={{ width: 18, height: 18 }} />
            )}

            <View style={s.backHeaderCenter}>
              <View style={s.badgeRed}>
                <Text style={s.badgeText}>SHUHADA-E-DERAJAT</Text>
              </View>
              {lang === "ur" && urduTitleImg ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image src={urduTitleImg} style={s.urduCardTitle} />
              ) : (
                <Text style={s.familyHealthCardTitle}>FAMILY HEALTH CARD</Text>
              )}
              <Text style={s.subSlogan}>HEALTH  |  SERVICE  |  COMPASSION</Text>
              <Text style={s.subSlogan}>FOR A STRONGER PAKISTAN</Text>
            </View>

            <View style={s.backRightSlogan}>
              <Text style={s.sloganSacrifice}>Their sacrifices</Text>
              <Text style={s.sloganResponsibility}>will not go in vain</Text>
            </View>
          </View>

          {/* Green Section Banner */}
          <View style={s.blueBanner}>
            <Text style={s.blueBannerText}>ELIGIBLE FAMILY MEMBERS</Text>
          </View>

          {/* Table */}
          <View style={s.tableContainer}>
            <View style={s.tableHeaderRow}>
              <Text style={[s.tableHeaderCell, { width: "40%", borderRightWidth: 0.8, borderRightColor: PAK_GREEN }]}>Name</Text>
              <Text style={[s.tableHeaderCell, { width: "26%", borderRightWidth: 0.8, borderRightColor: PAK_GREEN }]}>Relation</Text>
              <Text style={[s.tableHeaderCell, { width: "34%" }]}>CNIC/B-Form No.</Text>
            </View>

            {cardMembers.map((m: any, idx: number) => (
              <View key={idx} style={[s.tableDataRow, idx === cardMembers.length - 1 ? { borderBottomWidth: 0 } : {}]}>
                <Text style={s.tableCellName}>{m?.name || "—"}</Text>
                <Text style={s.tableCellRelation}>{m?.relationship || "—"}</Text>
                <Text style={s.tableCellCnic}>{m?.cnicBForm || "—"}</Text>
              </View>
            ))}

            {cardMembers.length === 0 && (
              <View style={s.tableDataRow}>
                <Text style={[s.tableCellName, { width: "100%", textAlign: "center", borderRightWidth: 0, color: "#64748b" }]}>
                  No family members recorded
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Area: Important Information + QR Code */}
          <View style={s.backBottomRow}>
            <View style={s.importantInfoBox}>
              <Text style={s.importantInfoTitle}>IMPORTANT INFORMATION</Text>
              <Text style={s.bulletPoint}>• Valid for eligible family members as per institutional policy.</Text>
              <Text style={s.bulletPoint}>• Non-transferable.</Text>
              <Text style={s.bulletPoint}>• Misuse may lead to cancellation.</Text>
              <Text style={s.bulletPoint}>• Report loss immediately.</Text>
            </View>

            {/* QR Code placed directly on the back card face */}
            <View style={s.qrCodeBox}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={qrSrc} style={s.qrImage} />
              <Text style={s.qrVerifyText}>Scan to Verify</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}