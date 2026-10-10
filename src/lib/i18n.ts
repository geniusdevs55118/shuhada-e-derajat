export type Lang = "en" | "ur";

export const LANG_KEY = "dsfhi_lang";

export const dict: Record<string, { en: string; ur: string }> = {
  heroTitle: {
    en: "Derajat Shuhada Family Healthcare Initiative",
    ur: "Ø¯Ø±Ø¬Ø§Øª Ø´ÛØ¯Ø§Ø¡ ÙÛŒÙ…Ù„ÛŒ ÛÛŒÙ„ØªÚ¾ Ú©ÛŒØ¦Ø± Ø§Ù†ÛŒØ´ÛŒ Ø§ÛŒÙ¹Ùˆ",
  },
  heroTagline: {
    en: "Honouring the Shuhada by Caring for Their Families.",
    ur: "Ø´ÛØ¯Ø§Ø¡ Ú©ÛŒ Ø¹Ø²Øª Ù…ÛŒÚº Ø§Ù† Ú©Û’ Ø§ÛÙ„ Ø®Ø§Ù†Û Ú©ÛŒ Ø®Ø¯Ù…ØªÛ”",
  },
  heroMotto: {
    en: "Their Sacrifice, Our Responsibility",
    ur: "Ø§Ù† Ú©ÛŒ Ù‚Ø±Ø¨Ø§Ù†ÛŒØŒ ÛÙ…Ø§Ø±ÛŒ Ø°Ù…Û Ø¯Ø§Ø±ÛŒ",
  },
  home: { en: "Home", ur: "ÛÙˆÙ…" },
  services: { en: "Services", ur: "Ø®Ø¯Ù…Ø§Øª" },
  hospitals: { en: "Three Hospitals", ur: "ØªÛŒÙ† ÛØ³Ù¾ØªØ§Ù„" },
  eligibility: { en: "Eligibility", ur: "Eligibility" },
  faq: { en: "FAQs", ur: "FAQs" },
  verify: { en: "Verify Card", ur: "Ú©Ø§Ø±Úˆ ØªØµØ¯ÛŒÙ‚" },
  about: { en: "About Initiative", ur: "ÛÙ…Ø§Ø±Û’ Ø¨Ø§Ø±Û’ Ù…ÛŒÚº" },
  contact: { en: "Contact", ur: "Ø±Ø§Ø¨Ø·Û" },
  verifyCardCta: { en: "Verify Health Card", ur: "ÛÛŒÙ„ØªÚ¾ Ú©Ø§Ø±Úˆ ØªØµØ¯ÛŒÙ‚ Ú©Ø±ÛŒÚº" },
  staffLogin: { en: "Staff Login", ur: "Ø¹Ù…Ù„Û Ù„Ø§Ú¯ Ø§Ù†" },
  oneFamilyRecord: {
    en: "One Family Record. Three Hospitals. One Coordinated Healthcare Pathway.",
    ur: "Ø§ÛŒÚ© Ø®Ø§Ù†Ø¯Ø§Ù†ÛŒ Ø±ÛŒÚ©Ø§Ø±ÚˆÛ” ØªÛŒÙ† ÛØ³Ù¾ØªØ§Ù„Û” Ø§ÛŒÚ© Ù…Ø±Ø¨ÙˆØ· Ø·Ø±ÛŒÙ‚Û Ø¹Ù„Ø§Ø¬Û”",
  },
  emergencyFirst: {
    en: "Emergency Care First",
    ur: "Ø§ÛŒÙ…Ø±Ø¬Ù†Ø³ÛŒ Ø¹Ù„Ø§Ø¬ Ø³Ø¨ Ø³Û’ Ù¾ÛÙ„Û’",
  },
  grievanceFeedback: {
    en: "Grievance and Feedback",
    ur: "Ø´Ú©Ø§ÛŒØª Ø§ÙˆØ± Ø±Ø§Ø¦Û’",
  },
};

export function t(key: string, lang: Lang): string {
  return dict[key]?.[lang] ?? key;
}
