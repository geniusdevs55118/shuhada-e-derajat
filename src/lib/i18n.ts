export type Lang = "en" | "ur";

export const LANG_KEY = "dsfhi_lang";

export const dict: Record<string, { en: string; ur: string }> = {
  heroTitle: {
    en: "Shuhada-e-Derajat Family Healthcare Initiative",
    ur: "شہدائے درجات فیملی ہیلتھ کیئر انیشی ایٹو",
  },
  heroTagline: {
    en: "Honouring the Shuhada by Caring for Their Families.",
    ur: "شہداء کی عزت میں ان کے اہل خانہ کی خدمت۔",
  },
  heroMotto: {
    en: "Their Sacrifice, Our Responsibility",
    ur: "ان کی قربانی، ہماری ذمہ داری",
  },
  home: { en: "Home", ur: "ہوم" },
  services: { en: "Services", ur: "خدمات" },
  hospitals: { en: "Hospitals", ur: "ہسپتال" },
  eligibility: { en: "Eligibility", ur: "اہلیت" },
  howItWorks: { en: "How It Works", ur: "طریقہ کار" },
  faq: { en: "FAQs", ur: "عام سوالات" },
  verify: { en: "Verify Card", ur: "کارڈ تصدیق" },
  about: { en: "About", ur: "تعارف" },
  contact: { en: "Contact", ur: "رابطہ" },
  verifyCardCta: { en: "Verify Card", ur: "کارڈ تصدیق" },
  staffLogin: { en: "Staff Portal", ur: "عملہ پورٹل" },
  oneFamilyRecord: {
    en: "One Family Record. Three Hospitals. One Coordinated Healthcare Pathway.",
    ur: "ایک خاندانی ریکارڈ۔ تین ہسپتال۔ ایک مربوط طریقہ علاج۔",
  },
  emergencyFirst: {
    en: "Emergency Care First",
    ur: "ایمرجنسی علاج سب سے پہلے",
  },
  grievanceFeedback: {
    en: "Grievance and Feedback",
    ur: "شکایت اور رائے",
  },
};

export function t(key: string, lang: Lang): string {
  return dict[key]?.[lang] ?? key;
}
