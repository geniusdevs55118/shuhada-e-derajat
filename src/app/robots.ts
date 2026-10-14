import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/services", "/hospitals", "/eligibility", "/how-it-works", "/faq", "/contact"],
        disallow: ["/dashboard/", "/api/", "/login/", "/_next/"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "ClaudeBot",
          "anthropic-ai",
          "Bytespider",
          "Diffbot",
          "cohere-ai",
        ],
        disallow: ["/"],
      },
    ],
  };
}
