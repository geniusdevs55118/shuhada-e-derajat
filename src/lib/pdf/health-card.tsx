/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 9, fontFamily: "Helvetica" },
  card: { borderWidth: 2, borderColor: "#166534", borderRadius: 8, padding: 16, marginTop: 12 },
  headRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 13, fontWeight: "bold", color: "#1e3a8a" },
  org: { fontSize: 8, color: "#166534", textAlign: "center" },
  grid: { flexDirection: "row", gap: 12, marginTop: 10 },
  col: { flex: 1 },
  label: { color: "#475569", marginTop: 6 },
  value: { fontWeight: "bold" },
  qr: { width: 90, height: 90 },
  emergency: { marginTop: 12, fontSize: 8, color: "#b91c1c", textAlign: "center" },
});

export function HealthCardPdf({ card, family, qrSrc }: { card: any; family: any; qrSrc: string }) {
  const member = family?.members?.[0];
  return (
    <Document>
      <Page size="A5" style={s.page}>
        <View style={s.card}>
          <Text style={s.org}>MUFTI MEHMOOD MEMORIAL MEDICAL TEACHING INSTITUTION, DERA ISMAIL KHAN</Text>
          <View style={s.headRow}>
            <Text style={s.title}>Derajat Shuhada Family Health Card</Text>
            <Text>{card.cardNo}</Text>
          </View>
          <View style={s.grid}>
            <View style={s.col}>
              <Text style={s.label}>Name of Shaheed</Text><Text style={s.value}>{family?.shaheedName}</Text>
              <Text style={s.label}>Organization</Text><Text style={s.value}>{family?.shaheedDepartment ?? "—"}</Text>
              <Text style={s.label}>Rank</Text><Text style={s.value}>{family?.shaheedRank ?? "—"}</Text>
              <Text style={s.label}>Institutional ID</Text><Text style={s.value}>{family?.shaheedServiceNo ?? "—"}</Text>
              <Text style={s.label}>CNIC</Text><Text style={s.value}>{family?.shaheedCnic ?? "—"}</Text>
              <Text style={s.label}>Address</Text><Text style={s.value}>{family?.contactPresentAddress ?? "—"}</Text>
            </View>
            <View style={s.col}>
              <Text style={s.label}>Beneficiary Name</Text><Text style={s.value}>{member?.name ?? family?.contactName}</Text>
              <Text style={s.label}>Family ID</Text><Text style={s.value}>{family?.registrationNo}</Text>
              <Text style={s.label}>Beneficiary ID</Text><Text style={s.value}>{member?.beneficiaryId ?? "—"}</Text>
              <Text style={s.label}>Relationship</Text><Text style={s.value}>{member?.relationship ?? family?.contactRelationship}</Text>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop */}
              <Image style={s.qr} src={qrSrc} />
              <Text style={s.label}>Emergency / Health Desk</Text><Text style={s.value}>Visit nearest DSFHI Health Desk</Text>
            </View>
          </View>
          <Text style={s.emergency}>In a medical emergency, immediate clinical assessment shall not be delayed solely for routine card verification.</Text>
        </View>
      </Page>
      <Page size="A5" style={s.page}>
        <View style={s.card}>
          <Text style={s.org}>MUFTI MEHMOOD MEMORIAL MEDICAL TEACHING INSTITUTION, DERA ISMAIL KHAN</Text>
          <View style={[s.headRow, { marginTop: 4, marginBottom: 8 }]}>
            <Text style={s.title}>Eligible Beneficiaries Record</Text>
            <Text style={{ fontSize: 8, color: "#475569" }}>Card #{card.cardNo} · Family #{family?.registrationNo}</Text>
          </View>
          <View style={{ borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 4, overflow: "hidden" }}>
            <View style={{ flexDirection: "row", backgroundColor: "#f1f5f9", padding: 4, borderBottomWidth: 1, borderBottomColor: "#cbd5e1" }}>
              <Text style={{ width: 22, fontWeight: "bold", fontSize: 7 }}>S#</Text>
              <Text style={{ flex: 2, fontWeight: "bold", fontSize: 7 }}>Full Name</Text>
              <Text style={{ flex: 1.2, fontWeight: "bold", fontSize: 7 }}>Relation</Text>
              <Text style={{ flex: 1.8, fontWeight: "bold", fontSize: 7 }}>CNIC / B-Form</Text>
              <Text style={{ flex: 1.2, fontWeight: "bold", fontSize: 7 }}>DOB / Age</Text>
              <Text style={{ flex: 1.2, fontWeight: "bold", fontSize: 7 }}>Status</Text>
            </View>
            {(family?.members && family.members.length > 0 ? family.members : [member]).map((m: any, idx: number) => (
              <View key={idx} style={{ flexDirection: "row", padding: 4, borderBottomWidth: idx < (family?.members?.length ?? 1) - 1 ? 1 : 0, borderBottomColor: "#e2e8f0" }}>
                <Text style={{ width: 22, fontSize: 7 }}>{idx + 1}</Text>
                <Text style={{ flex: 2, fontSize: 7, fontWeight: "bold" }}>{m?.name ?? "—"}</Text>
                <Text style={{ flex: 1.2, fontSize: 7 }}>{m?.relationship ?? "—"}</Text>
                <Text style={{ flex: 1.8, fontSize: 7 }}>{m?.cnic ?? "—"}</Text>
                <Text style={{ flex: 1.2, fontSize: 7 }}>{m?.dateOfBirth ? new Date(m.dateOfBirth).toISOString().slice(0, 10) : (m?.age ? `${m.age} yrs` : "—")}</Text>
                <Text style={{ flex: 1.2, fontSize: 7, color: "#166534" }}>{m?.cardStatus ?? "Active"}</Text>
              </View>
            ))}
          </View>
          <View style={{ marginTop: 10, padding: 6, backgroundColor: "#f8fafc", borderRadius: 4, borderWidth: 1, borderColor: "#e2e8f0" }}>
            <Text style={{ fontSize: 7, fontWeight: "bold", color: "#1e3a8a", marginBottom: 2 }}>TERMS & CONDITIONS:</Text>
            <Text style={{ fontSize: 6.5, lineHeight: 1.4, color: "#334155" }}>
              1. Non-transferable. Valid only for authorized healthcare facilitation through DSFHI Health Desks across DHQ, MMMTH, and Derajat Women & Children Hospital.
            </Text>
            <Text style={{ fontSize: 6.5, lineHeight: 1.4, color: "#334155" }}>
              2. Misuse, alteration, or unauthorized transfer may lead to immediate suspension and administrative cancellation.
            </Text>
            <Text style={{ fontSize: 6.5, lineHeight: 1.4, color: "#334155" }}>
              3. Report lost or damaged cards immediately to the nearest facilitation desk for reissuance and token revocation.
            </Text>
            <Text style={{ fontSize: 6.5, lineHeight: 1.4, color: "#b91c1c", fontWeight: "bold", marginTop: 2 }}>
              4. In a medical emergency, clinical assessment and life-saving care shall NOT be delayed solely for routine card verification.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
