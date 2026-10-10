import { z } from "zod";

export const ALL_ROLES = [
  "super_admin",
  "hospital_director",
  "additional_director",
  "medical_superintendent",
  "health_desk_officer",
  "sehat_card_desk",
  "pharmacy_rep",
  "diagnostics_rep",
  "admin_finance_rep",
  "nursing_rep",
  "it_mis_rep",
  "working_group_member",
] as const;

export const HOSPITAL_CODES = ["DHQ", "MMMTH", "WC"] as const;

const SCOPED_ROLES = ["medical_superintendent", "health_desk_officer"];

function hospitalRule(role: string, hospitalCode: string | null | undefined): boolean {
  if (SCOPED_ROLES.includes(role)) return Boolean(hospitalCode);
  return !hospitalCode;
}

export const createUserSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-z0-9._@-]+$/, "Lowercase letters, digits, dot, underscore, dash only"),
    role: z.enum(ALL_ROLES),
    designation: z.string().optional(),
    hospitalCode: z.enum(HOSPITAL_CODES).nullish(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .superRefine((v, ctx) => {
    if (!hospitalRule(v.role, v.hospitalCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hospitalCode"],
        message: SCOPED_ROLES.includes(v.role)
          ? "This role requires a hospital assignment"
          : "Directors and Working Group roles must not have a hospital assignment",
      });
    }
  });

export const updateUserSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    role: z.enum(ALL_ROLES),
    designation: z.string().optional(),
    hospitalCode: z.enum(HOSPITAL_CODES).nullish(),
  })
  .superRefine((v, ctx) => {
    if (!hospitalRule(v.role, v.hospitalCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["hospitalCode"],
        message: SCOPED_ROLES.includes(v.role)
          ? "This role requires a hospital assignment"
          : "Directors and Working Group roles must not have a hospital assignment",
      });
    }
  });

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const statusSchema = z.object({
  isActive: z.boolean(),
});

export function emailForUsername(username: string): string {
  return username.includes("@") ? username : `${username}@demo.dsfhi.local`;
}

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
