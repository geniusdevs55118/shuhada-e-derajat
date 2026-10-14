import { siteConfig } from "@/lib/site-config";
import { PublicPageIntro } from "@/components/public/page-intro";
import { PublicContactDetails } from "@/components/public/public-contact-details";

export const metadata = {
  title: "Contact & Health Desk Locations | Shuhada-e-Derajat Healthcare",
  description:
    "Contact information, institutional addresses, and Family Health Desk locations across DHQ, MMMTH, and DWCH hospitals.",
};

export default function ContactPage() {
  return (
    <main>
      <PublicPageIntro
        section="Institutional Access"
        title="Contact the Institution & Health Desks"
        description={`${siteConfig.institutionName}, ${siteConfig.institutionCity}. Direct lines, hospital desk locations, and assistance coordinates.`}
        breadcrumbs={[{ label: "Contact" }]}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <PublicContactDetails />
      </section>
    </main>
  );
}
