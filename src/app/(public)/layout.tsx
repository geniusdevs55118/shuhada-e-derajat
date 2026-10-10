import { PublicHeader } from "@/components/public/public-header";
import { SiteFooter } from "@/components/public/site-footer";
import { ScrollToTop } from "@/components/public/scroll-to-top";
import { PublicSafetyBanner } from "@/components/public/public-safety-banner";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <PublicSafetyBanner />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}
