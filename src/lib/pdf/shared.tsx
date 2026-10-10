import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 9, fontFamily: "Helvetica", color: "#1e293b" },
  header: { borderBottomWidth: 2, borderBottomColor: "#166534", paddingBottom: 8, marginBottom: 12, alignItems: "center" },
  headerOrg: { fontSize: 12, fontWeight: "bold", color: "#1e3a8a", textAlign: "center" },
  headerSub: { fontSize: 9, color: "#166534", marginTop: 2 },
  title: { fontSize: 13, fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "#1e3a8a" },
  sectionTitle: { fontSize: 10, fontWeight: "bold", backgroundColor: "#dbeafe", padding: 4, marginTop: 8, marginBottom: 4 },
  row: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#e2e8f0", paddingVertical: 2 },
  label: { width: "40%", color: "#475569" },
  value: { width: "60%", fontWeight: "bold" },
  footer: { position: "absolute", bottom: 24, left: 40, right: 40, borderTopWidth: 1, borderTopColor: "#bfdbfe", paddingTop: 4, fontSize: 7, color: "#64748b" },
  sigRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 40 },
  sig: { width: "30%", borderTopWidth: 1, borderTopColor: "#334155", textAlign: "center", paddingTop: 2 },
});

export function PdfHeader({ title }: { title: string }) {
  return (
    <>
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.headerOrg}>MUFTI MEHMOOD MEMORIAL MEDICAL TEACHING INSTITUTION DERA ISMAIL KHAN</Text>
        <Text style={pdfStyles.headerSub}>Derajat Shuhada Family Healthcare Initiative</Text>
      </View>
      <Text style={pdfStyles.title}>{title}</Text>
    </>
  );
}

export function PdfFooter() {
  return (
    <View style={pdfStyles.footer} fixed>
      <Text>Generated: {new Date().toLocaleString()} | Confidential - For official DSFHI use only.</Text>
    </View>
  );
}

export function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <View style={pdfStyles.row}>
      <Text style={pdfStyles.label}>{label}</Text>
      <Text style={pdfStyles.value}>{value ?? "—"}</Text>
    </View>
  );
}

export function SectionTitle({ children }: { children: string }) {
  return <Text style={pdfStyles.sectionTitle}>{children}</Text>;
}

export { Document, Page, Text, View };
