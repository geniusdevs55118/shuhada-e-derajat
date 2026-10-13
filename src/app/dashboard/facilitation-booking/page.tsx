import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { FacilitationBookingView } from "@/components/visits/facilitation-booking-view";

export const instant = false;

export default async function FacilitationBookingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const session = { id: user.id, role: user.role, hospitalId: user.hospitalId };
  if (!can(session, "visit", "create") && !can(session, "visit", "read")) {
    redirect("/dashboard");
  }

  // Get hospital details
  let hospitalName = "Derajat Facilitation Desk";
  let hospitalId = 1;

  if (user.hospitalId) {
    const hospital = await prisma.hospital.findUnique({
      where: { id: user.hospitalId },
    });
    if (hospital) {
      hospitalName = hospital.name;
      hospitalId = hospital.id;
    }
  } else {
    const firstHospital = await prisma.hospital.findFirst({
      orderBy: { id: "asc" },
    });
    if (firstHospital) {
      hospitalName = firstHospital.name;
      hospitalId = firstHospital.id;
    }
  }

  return (
    <FacilitationBookingView
      defaultHospitalName={hospitalName}
      defaultHospitalId={hospitalId}
    />
  );
}
