import Link from "next/link";
import { PublicPageIntro } from "@/components/public/page-intro";

export default function Page() {
  return (
    <main>
      <PublicPageIntro
        section="Beneficiary services"
        title="Verify a health card"
        description="Check the status of a Derajat Shuhada Family Health Card."
      />

      <section className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
        <div className="border-y border-border py-6">
          <div>
            <h2 className="font-semibold text-blue-950">Card verification is not available online yet</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              The public verification service will open in a later phase. For assistance, contact a Family Health Desk
              at one of the three hospitals.
            </p>
            <Link href="/contact" className="mt-4 inline-flex items-center text-sm font-semibold text-blue-800 hover:underline">
              View contact information
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
