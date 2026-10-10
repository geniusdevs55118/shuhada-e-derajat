import { prisma } from "@/lib/db";

export async function notifyRedGrievance(input: { id: number; grievanceNo: string; beneficiaryName: string; hospitalId: number }) {
  const recipients = await prisma.user.findMany({
    where: { isActive: true, OR: [
      { role: "hospital_director" },
      { role: "additional_director" },
      { role: "medical_superintendent", hospitalId: input.hospitalId },
    ] }, select: { id: true },
  });
  if (!recipients.length) return;
  await prisma.notification.createMany({ data: recipients.map(({ id: userId }) => ({
    userId,
    title: `RED ALERT · ${input.grievanceNo}`,
    message: `${input.beneficiaryName} needs immediate attention at hospital #${input.hospitalId}.`,
    href: `/dashboard/grievances/${input.id}`,
    hospitalId: input.hospitalId,
    entity: "grievance",
    entityId: String(input.id),
  })) });
}
