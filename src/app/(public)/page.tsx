import { HeroCarousel } from "@/components/public/hero-carousel";
import { QuickActionStrip } from "@/components/public/quick-action-strip";
import { ShuhadaTribute } from "@/components/public/shuhada-tribute";
import { GhazisTribute } from "@/components/public/ghazis-tribute";
import { HospitalsSlider } from "@/components/public/hospitals-slider";
import { ServicesSlider } from "@/components/public/services-slider";
import { HealthCardShowcase } from "@/components/public/health-card-showcase";
import { FamilyEligibilityPreview } from "@/components/public/family-eligibility-preview";
import { PrinciplesSlider } from "@/components/public/principles-slider";
import { SupportBanner } from "@/components/public/support-banner";
import { EmergencyCallout } from "@/components/public/emergency-callout";
import { ProcessSteps } from "@/components/public/process-steps";
import { ImpactStats } from "@/components/public/impact-stats";

export const metadata = {
  title: "Shuhada-e-Derajat Family Healthcare Initiative | Mufti Mehmood Memorial MTI",
  description:
    "A coordinated, dignified healthcare facilitation pathway for verified families of Shuhada across DHQ Hospital, Mufti Mehmood Memorial Hospital, and Derajat Women & Children Hospital in Dera Ismail Khan.",
};

export default function HomePage() {
  return (
    <main id="main-content" className="flex flex-col">
      {/* 1. High-Impact Multi-Slide Hero Carousel */}
      <HeroCarousel />

      {/* 2. Quick Action Strip Overlay */}
      <QuickActionStrip />

      {/* Section 1: Why it exists & Shuhada Tribute */}
      <ShuhadaTribute />

      {/* Section 1B: Living Valor - Derajat Ghazis Tribute */}
      <GhazisTribute />

      {/* Section 2: Hospital Network Slider */}
      <HospitalsSlider />

      {/* Section 3: Healthcare Facilitation Services Slider */}
      <ServicesSlider />

      {/* Emergency Callout Banner */}
      <EmergencyCallout />

      {/* Section 4: Health Card Showcase with Instant Verification */}
      <HealthCardShowcase />

      {/* Section 5: Eligible Family Members Preview */}
      <FamilyEligibilityPreview />

      {/* Process Steps Pathway */}
      <ProcessSteps />

      {/* Impact Stats Ribbon */}
      <ImpactStats />

      {/* Section 6: Core Guiding Principles */}
      <PrinciplesSlider />

      {/* Section 7: Grievance and Feedback Banner */}
      <SupportBanner />
    </main>
  );
}
