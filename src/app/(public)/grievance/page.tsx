import { PublicPageIntro } from "@/components/public/page-intro";
import { PublicGrievanceForm } from "@/components/public/public-grievance-form";

export default function PublicGrievancePage() {
  return <main><PublicPageIntro section="Confidential support" title="Lodge a grievance" description="Tell us about a difficulty with registration, hospital access or healthcare facilitation." />
    <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <PublicGrievanceForm />
      <aside className="space-y-4 text-sm leading-6 text-gray-700"><h2 className="text-lg font-bold text-blue-950">What happens next?</h2><p>Your concern is recorded for the relevant hospital team to review. If an immediate patient-safety concern is selected, it is flagged for urgent follow-up.</p><p>Provide only the information needed to explain the concern. Do not enter a CNIC or medical diagnosis in this public form.</p><p>Grievances and administrative concerns never delay emergency care.</p></aside>
    </section>
  </main>;
}
