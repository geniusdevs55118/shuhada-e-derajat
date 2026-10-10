import { siteConfig } from "@/lib/site-config";
import { PublicPageIntro } from "@/components/public/page-intro";
import { PublicContactDetails } from "@/components/public/public-contact-details";

export default function ContactPage() {
  return (
    <main>
      <PublicPageIntro
        section="Contact"
        title="Contact the institution"
        description={siteConfig.institutionName + ", " + siteConfig.institutionCity + "."}
      />

      <section className="mx-auto max-w-4xl px-4 py-14">
        <h2 className="font-heading text-2xl text-blue-950">{siteConfig.institutionName}</h2>
        <p className="mt-1 text-gray-600">{siteConfig.institutionCity}</p>

        <PublicContactDetails />
      </section>
    </main>
  );
}
