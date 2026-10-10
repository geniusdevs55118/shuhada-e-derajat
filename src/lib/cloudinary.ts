import "server-only";
import { v2 as cloudinary } from "cloudinary";

export function cloudinaryReady() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

export function configuredCloudinary() {
  if (!cloudinaryReady()) throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

export const SENSITIVE_DOCUMENT_TYPES = [
  "Official Shahadat Certificate / Verification",
  "CNIC of Shaheed",
  "CNIC of Applicant",
  "CNIC / B-Form of Family Members",
  "Family Registration Certificate / Proof of Relationship",
  "Dependency Certificate, where applicable",
  "Disability Documentation, where applicable",
  "Domicile / Residence Record, where required",
  "Beneficiary Photographs",
  "Departmental / Service Verification",
  "Other",
] as const;
