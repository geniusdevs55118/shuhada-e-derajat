/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

const GREEN = "#166534";
const RED = "#b91c1c";
const GOLD = "#d4a017";

const s = StyleSheet.create({
  landscapePage: { padding: 12, fontSize: 9, fontFamily: "Helvetica", backgroundColor: "#ffffff" },

  // Red title banner
  titleBanner: { backgroundColor: RED, paddingVertical: 5, paddingHorizontal: 12, borderRadius: 4, alignItems: "center" },
  bannerTitle: { fontSize: 14, fontWeight: "bold", color: "#ffffff" },
  bannerSubtitle: { fontSize: 7.5, color: "#fee2e2", marginTop: 1 },

  // Flag + mountains theme band
  themeBand: { height: 36, marginTop: 6, backgroundColor: GREEN, borderRadius: 4, overflow: "hidden", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12 },
  themeLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  crescent: { width: 16, height: 16, borderRadius: 8, backgroundColor: "#ffffff" },
  crescentCut: { width: 13, height: 13, borderRadius: 7, backgroundColor: GREEN, marginLeft: -7 },
  star: { fontSize: 11, color: "#ffffff", marginTop: -9, marginLeft: -3 },
  themeText: { color: "#ffffff", fontSize: 8 },
  mountain: { width: 0, height: 0, borderLeftWidth: 22, borderRightWidth: 22, borderBottomWidth: 26, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: "#14532d" },
  mountainBack: { width: 0, height: 0, borderLeftWidth: 16, borderRightWidth: 16, borderBottomWidth: 20, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: "#166534", marginLeft: -10 },

  body: { flexDirection: "row", gap: 8, marginTop: 7 },
  col: { flex: 1 },
  label: { color: "#475569", fontSize: 7.5, marginTop: 7 },
  value: { fontWeight: "bold", fontSize: 9 },

  photoBox: { width: 62, height: 72, borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 3, alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" },
  photoCaption: { fontSize: 6.5, color: "#94a3b8", marginTop: 3, textAlign: "center" },

  chip: { width: 42, height: 30, borderRadius: 4, backgroundColor: GOLD, marginTop: 6, padding: 4, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  chipLineH: { width: "44%", height: 1.5, backgroundColor: "#92400e", marginVertical: 2 },
  chipLineV: { width: 1.5, height: "42%", backgroundColor: "#92400e", marginHorizontal: 2 },

  qr: { width: 78, height: 78 },
  qrCaption: { fontSize: 6.5, color: "#475569", textAlign: "center", marginTop: 2 },

  footer: { marginTop: 6, padding: 5, backgroundColor: "#fef2f2", borderLeftWidth: 3, borderLeftColor: RED, fontSize: 7.5, lineHeight: 1.45, color: "#7f1d1d" },

  // Back of card
  backPage: { padding: 22, fontFamily: "Helvetica", backgroundColor: GREEN },
  backOrg: { color: "#bbf7d0", fontSize: 7, textAlign: "center" },
  backTitle: { color: "#ffffff", fontSize: 13, fontWeight: "bold", textAlign: "center", marginTop: 5 },
  backBody: { color: "#ecfdf5", fontSize: 8, lineHeight: 1.5, marginTop: 10, textAlign: "center" },
  backEmergency: { color: "#fecaca", fontSize: 8.5, lineHeight: 1.45, marginTop: 12, textAlign: "center", fontWeight: "bold" },
  backFoot: { color: "#a7f3d0", fontSize: 7, textAlign: "center", marginTop: 14 },

  // Members layout
  memberPage: { padding: 30, fontSize: 9, fontFamily: "Helvetica" },
  memberTitle: { fontSize: 13, fontWeight: "bold", color: "#1e3a8a", textAlign: "center" },
  memberOrg: { fontSize: 8, color: GREEN, textAlign: "center", marginBottom: 10 },
  tableHead: { flexDirection: "row", backgroundColor: "#f1f5f9", padding: 4, borderBottomWidth: 1, borderBottomColor: "#cbd5e1" },
  tableRow: { flexDirection: "row", padding: 4, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  terms: { marginTop: 10, padding: 6, backgroundColor: "#f8fafc", borderRadius: 4, borderWidth: 1, borderColor: "#e2e8f0" },
});

export function HealthCardPdf({
  card,
  family,
  qrSrc,
  photoSrc,
  healthDeskContact,
}: {
  card: any;
  family: any;
  qrSrc: string;
  photoSrc?: string | null;
  healthDeskContact?: string | null;
}) {
  const members: any[] = Array.isArray(family?.members) && family.members.length > 0 ? family.members : [];
  const member = members[0];

  return (
    <Document>
      {/* ---------- Card face (landscape) ---------- */}
      <Page size="A6" orientation="landscape" style={s.landscapePage}>
        <View style={s.titleBanner}>
          <Text style={s.bannerTitle}>DERAJAT SHUHADA FAMILY HEALTH CARD</Text>
          <Text style={s.bannerSubtitle}>Mufti Mehmood Memorial Medical Teaching Institution, Dera Ismail Khan</Text>
        </View>

        <View style={s.themeBand}>
          <View style={s.themeLeft}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={s.crescent} />
                <View style={s.crescentCut} />
              </View>
              <Text style={s.star}>★</Text>
            </View>
            <Text style={s.themeText}>Honouring the Shuhada{`\n`}by Caring for Their Families</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <View style={s.mountain} />
            <View style={s.mountainBack} />
          </View>
        </View>

        <View style={s.body}>
          <View style={[s.col, { flex: 1.15 }]}>
            <View style={{ flexDirection: "row" }}>
              <View>
                {photoSrc ? (
                  // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop
                  <Image src={photoSrc} style={{ width: 62, height: 72, objectFit: "cover", borderRadius: 3 }} />
                ) : (
                  <View style={s.photoBox}>
                    <Text style={{ fontSize: 6.5, color: "#94a3b8" }}>PHOTO</Text>
                  </View>
                )}
                <View style={{ alignItems: "center" }}>
                  <View style={s.chip}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                      <View style={s.chipLineH} />
                      <View style={s.chipLineH} />
                    </View>
                    <View style={s.chipLineV} />
                    <View style={s.chipLineV} />
                    <View style={s.chipLineH} />
                    <View style={s.chipLineH} />
                  </View>
                  <Text style={s.photoCaption}>CHIP</Text>
                </View>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={s.label}>Card No</Text>
                <Text style={s.value}>{card.cardNo}</Text>
                <Text style={s.label}>Family ID</Text>
                <Text style={s.value}>{family?.registrationNo}</Text>
                <Text style={s.label}>Beneficiary ID</Text>
                <Text style={s.value}>{member?.beneficiaryId ?? "—"}</Text>
                <Text style={s.label}>Card Status</Text>
                <Text style={s.value}>{card.status}</Text>
              </View>
            </View>
          </View>

          <View style={s.col}>
            <Text style={s.label}>Name of Shaheed</Text>
            <Text style={s.value}>{family?.shaheedName ?? "—"}</Text>
            <Text style={s.label}>Beneficiary Name</Text>
            <Text style={s.value}>{member?.name ?? family?.contactName ?? "—"}</Text>
            <Text style={s.label}>Relationship</Text>
            <Text style={s.value}>{member?.relationship ?? family?.contactRelationship ?? "—"}</Text>
            <Text style={s.label}>CNIC / B-Form</Text>
            <Text style={s.value}>{member?.cnicBForm ?? family?.contactCnic ?? "—"}</Text>
            <Text style={s.label}>Eligible Beneficiaries</Text>
            <Text style={s.value}>{members.length}</Text>
          </View>

          <View style={{ alignItems: "center" }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop */}
            <Image style={s.qr} src={qrSrc} />
            <Text style={s.qrCaption}>Scan at any DSFHI Health Desk</Text>
            <Text style={[s.qrCaption, { marginTop: 6, color: RED }]}>
              {healthDeskContact ?? "Contact your nearest Family Health Desk"}
            </Text>
          </View>
        </View>

        <View style={s.footer}>
          <Text>
            In a medical emergency, immediate clinical assessment shall not be delayed solely for routine card verification.
          </Text>
        </View>
      </Page>

      {/* ---------- Card back ---------- */}
      <Page size="A6" orientation="landscape" style={s.backPage}>
        <Text style={s.backOrg}>MUFTI MEHMOOD MEMORIAL MEDICAL TEACHING INSTITUTION, DERA ISMAIL KHAN</Text>
        <Text style={s.backTitle}>DERAJAT SHUHADA FAMILY HEALTH CARD</Text>
        <Text style={s.backBody}>
          Valid for healthcare facilitation through the Derajat Shuhada Family Health Desks of Mufti Mehmood Memorial
          Medical Teaching Institution, Dera Ismail Khan, subject to applicable institutional rules and clinical protocols.
        </Text>
        <Text style={s.backEmergency}>
          In a medical emergency, immediate clinical assessment shall not be delayed solely for routine card verification.
        </Text>
        <Text style={s.backFoot}>
          Card No {card.cardNo} · Family ID {family?.registrationNo} · Non-transferable · Report loss immediately
        </Text>
      </Page>

      {/* ---------- Eligible members layout ---------- */}
      <Page size="A5" style={s.memberPage}>
        <Text style={s.memberOrg}>MUFTI MEHMOOD MEMORIAL MEDICAL TEACHING INSTITUTION, DERA ISMAIL KHAN</Text>
        <Text style={s.memberTitle}>Eligible Beneficiaries Record</Text>
        <View style={{ borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 4, overflow: "hidden", marginTop: 8 }}>
          <View style={s.tableHead}>
            <Text style={{ width: 22, fontWeight: "bold", fontSize: 7 }}>S#</Text>
            <Text style={{ flex: 2, fontWeight: "bold", fontSize: 7 }}>Full Name</Text>
            <Text style={{ flex: 1.2, fontWeight: "bold", fontSize: 7 }}>Relation</Text>
            <Text style={{ flex: 1.8, fontWeight: "bold", fontSize: 7 }}>CNIC / B-Form</Text>
            <Text style={{ flex: 1.2, fontWeight: "bold", fontSize: 7 }}>DOB / Age</Text>
            <Text style={{ flex: 1.2, fontWeight: "bold", fontSize: 7 }}>Status</Text>
          </View>
          {members.map((m: any, idx: number) => (
            <View key={idx} style={s.tableRow}>
              <Text style={{ width: 22, fontSize: 7 }}>{idx + 1}</Text>
              <Text style={{ flex: 2, fontSize: 7, fontWeight: "bold" }}>{m?.name ?? "—"}</Text>
              <Text style={{ flex: 1.2, fontSize: 7 }}>{m?.relationship ?? "—"}</Text>
              <Text style={{ flex: 1.8, fontSize: 7 }}>{m?.cnicBForm ?? "—"}</Text>
              <Text style={{ flex: 1.2, fontSize: 7 }}>{m?.dobAge ?? "—"}</Text>
              <Text style={{ flex: 1.2, fontSize: 7, color: GREEN }}>{m?.cardStatus ?? "Active"}</Text>
            </View>
          ))}
          {members.length === 0 && (
            <View style={s.tableRow}>
              <Text style={{ fontSize: 7, color: "#64748b" }}>No eligible beneficiaries recorded.</Text>
            </View>
          )}
        </View>

        <View style={s.terms}>
          <Text style={{ fontSize: 7, fontWeight: "bold", color: "#1e3a8a", marginBottom: 2 }}>NOTES:</Text>
          <Text style={{ fontSize: 6.5, lineHeight: 1.4, color: "#334155" }}>
            1. Non-transferable. Valid only for authorized healthcare facilitation through DSFHI Health Desks across DHQ, MMMTH, and Derajat Women &amp; Children Hospital.
          </Text>
          <Text style={{ fontSize: 6.5, lineHeight: 1.4, color: "#334155" }}>
            2. Misuse, alteration, or unauthorized transfer may lead to immediate suspension and administrative cancellation.
          </Text>
          <Text style={{ fontSize: 6.5, lineHeight: 1.4, color: "#334155" }}>
            3. Report lost or damaged cards immediately to the nearest facilitation desk for reissuance and token revocation.
          </Text>
          <Text style={{ fontSize: 6.5, lineHeight: 1.4, color: RED, fontWeight: "bold", marginTop: 2 }}>
            4. In a medical emergency, clinical assessment and life-saving care shall NOT be delayed solely for routine card verification.
          </Text>
        </View>
      </Page>
    </Document>
  );
}