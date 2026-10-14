import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";
import { CardStatus } from "@prisma/client";

/**
 * Generates the next Card Number in sequential format: DSFHC-000001
 */
export async function getNextCardNo(tx?: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]): Promise<string> {
  const db = tx ?? prisma;
  const cards = await db.healthCard.findMany({
    where: { cardNo: { startsWith: "DSFHC-" } },
    select: { cardNo: true },
  });

  let maxSeq = 0;
  for (const c of cards) {
    const match = c.cardNo.match(/^DSFHC-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxSeq) maxSeq = num;
    }
  }

  return `DSFHC-${String(maxSeq + 1).padStart(6, "0")}`;
}

/**
 * Generates an unguessable cryptographically secure random QR ID
 * Not derived from CNIC, registration number, or name.
 */
export function generateUnguessableQrId(): string {
  return `DSFQR-${randomBytes(16).toString("hex")}`;
}

export interface GenerateCardResult {
  card: {
    id: number;
    cardNo: string;
    familyRegistrationNo: string;
    qrDigitalVerificationId: string | null;
    status: CardStatus;
    dateOfCardIssue: Date | null;
  };
  beneficiariesCount: number;
}

/**
 * Executes Phase 14 Health Card generation inside a database transaction:
 * - Validates family exists and does not already have a card
 * - Validates Section I authorization is 'Approved for Health Card' or 'Approved for Registration'
 * - Sets status: Active (if Verified & Eligible) or Under Verification (if Provisionally Verified)
 * - Assigns card number DSFHC-000001 and random unguessable QR ID
 * - Assigns beneficiary IDs: <RegNo>-01, <RegNo>-02, ... to all family members
 * - Populates Annexure-A Section F on Family record
 * - Populates Annexure-C Master Record (HealthCard) with controlFlags, hospital access, etc.
 * - Logs audit record
 */
export async function generateHealthCardTransaction(
  familyId: number,
  actor: { id: number; email?: string; role: string; hospitalId: number | null },
  options?: {
    specialFlags?: string[];
    controlFlags?: string[];
  }
): Promise<GenerateCardResult> {
  return await prisma.$transaction(async (tx) => {
    const family = await tx.family.findUnique({
      where: { id: familyId },
      include: {
        members: {
          orderBy: { serialNo: "asc" },
        },
      },
    });

    if (!family) {
      throw new Error("Family not found");
    }

    if (family.healthCardNo) {
      throw new Error(`Family already has a Health Card issued: ${family.healthCardNo}`);
    }

    const existingCard = await tx.healthCard.findFirst({
      where: { familyRegistrationNo: family.registrationNo },
    });
    if (existingCard) {
      throw new Error(`Health Card already exists for registration ${family.registrationNo}`);
    }

    // Must have Section I authorization
    const validAuthorizations = [
      "APPROVED_FOR_HEALTH_CARD",
      "APPROVED_FOR_REGISTRATION",
      "Approved for Shuhada-e-Derajat Family Health Card",
      "Approved for Derajat Shuhada Family Health Card",
      "Approved for Registration",
    ];
    if (!family.authorizationDecision || !validAuthorizations.includes(family.authorizationDecision)) {
      throw new Error("Family must be authorized in Section I before generating a Health Card");
    }

    // Determine initial status based on Section E verification
    let cardStatus: CardStatus = CardStatus.UNDER_VERIFICATION;
    if (
      family.verificationStatus === "VERIFIED_ELIGIBLE" ||
      (family.verificationStatus as string) === "Verified & Eligible"
    ) {
      cardStatus = CardStatus.ACTIVE;
    } else if (
      family.verificationStatus === "PROVISIONALLY_VERIFIED" ||
      (family.verificationStatus as string) === "Provisionally Verified"
    ) {
      cardStatus = CardStatus.UNDER_VERIFICATION;
    } else {
      throw new Error("Cannot generate Health Card: Family is not verified or eligible");
    }

    const cardNo = await getNextCardNo(tx);
    const qrId = generateUnguessableQrId();
    const now = new Date();

    // Default control flags for newly generated card as per Annexure-C
    const defaultControlFlags = [
      "Family Card",
      "Physical Card Issued",
      "QR / Digital Record Activated",
      "Hospital Information System Linked",
      "CNIC / B-Form Linked",
    ];
    const controlFlags = Array.from(new Set([...defaultControlFlags, ...(options?.controlFlags || [])]));
    const specialFlags = options?.specialFlags || (family.specialDependencyDisability ? ["Person with Disability"] : []);

    // 1. Create Annexure-C HealthCard Master Record
    const card = await tx.healthCard.create({
      data: {
        cardNo,
        familyRegistrationNo: family.registrationNo,
        qrDigitalVerificationId: qrId,
        dateOfRegistration: family.dateOfRegistration,
        dateOfCardIssue: now,
        status: cardStatus,
        specialFlags,
        controlFlags,
        issuedBy: actor.email || `User #${actor.id}`,
        issuedByDesignation: family.authorizedDesignation || "Authorised Officer / Focal Person",
        issuedSignatureDate: now.toISOString().split("T")[0],
        accessDHQ: family.hospitalAccessDHQ,
        accessMMMTH: family.hospitalAccessMMMTH,
        accessWC: family.hospitalAccessWC,
        reviewFlags: ["Family Particulars Confirmed", "Beneficiary List Confirmed"],
        authorisedOfficer: family.authorizedOfficer,
        authorisedDesignation: family.authorizedDesignation,
        authorisedSignature: family.authorizedSignature,
        authorisedDate: family.authorizationDate,
      },
    });

    // 2. Update all family members with Beneficiary IDs (<RegNo>-01, <RegNo>-02...)
    for (let i = 0; i < family.members.length; i++) {
      const member = family.members[i];
      const beneficiaryIndex = String(i + 1).padStart(2, "0");
      const beneficiaryId = `${family.registrationNo}-${beneficiaryIndex}`;

      await tx.familyMember.update({
        where: { id: member.id },
        data: {
          beneficiaryId,
          cardStatus: cardStatus === CardStatus.ACTIVE ? "Active" : "Under Verification",
        },
      });
    }

    // 3. Update Annexure-A Section F on the Family record
    await tx.family.update({
      where: { id: family.id },
      data: {
        healthCardNo: cardNo,
        qrDigitalId: qrId,
        cardRegistrationId: family.registrationNo,
        cardQrVerificationId: qrId,
        cardDateOfIssue: now,
        cardPhysicalIssued: true,
        cardDigitalRecordCreated: true,
        cardBeneficiariesLinked: true,
        cardSystemUpdated: true,
      },
    });

    // 4. Record Audit Log
    await tx.auditLog.create({
      data: {
        who: actor.email || String(actor.id),
        role: actor.role,
        action: "create",
        entity: "card",
        entityId: String(card.id),
        hospitalId: actor.hospitalId,
      },
    });

    return {
      card: {
        id: card.id,
        cardNo: card.cardNo,
        familyRegistrationNo: card.familyRegistrationNo,
        qrDigitalVerificationId: card.qrDigitalVerificationId,
        status: card.status,
        dateOfCardIssue: card.dateOfCardIssue,
      },
      beneficiariesCount: family.members.length,
    };
  });
}
