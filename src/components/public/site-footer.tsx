import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import Image from "next/image";

const links = [
  { label: "About the initiative", href: "/about" },
  { label: "Eligibility", href: "/eligibility" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Sehat Card Plus", href: "/sehat-card-plus" },
  { label: "Working Group", href: "/working-group" },
  { label: "Frequently asked questions", href: "/faq" },
  { label: "Lodge a grievance", href: "/grievance" },
  { label: "Healthcare services", href: "/services" },
  { label: "Contact", href: "/contact" },
  { label: "Verify a health card", href: "/verify" },
  { label: "Staff portal", href: "/login" },
];

export function SiteFooter() {
  return (
    <footer className="bg-blue-950 text-blue-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/images/logo.svg" alt="" width={40} height={40} />
            <span className="font-heading text-lg font-semibold text-white">Derajat Shuhada</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-blue-100/80">{siteConfig.tagline}</p>
          <p className="mt-2 text-xs text-blue-200">{siteConfig.institutionName}, {siteConfig.institutionCity}</p>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-white">Initiative</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-blue-100/80">
            {links.map((item) => (
              <li key={item.href}><Link href={item.href} className="hover:text-white hover:underline">{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-white">Hospitals</h2>
          <p className="mt-4 text-xs text-blue-200">Dera Ismail Khan</p>
          <ul className="mt-2 space-y-2 text-sm text-blue-100/80">
            {siteConfig.hospitals.map((hospital) => <li key={hospital.name}>{hospital.name}</li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-4 text-xs text-blue-200/75 sm:px-8">© 2026 {siteConfig.institutionName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
