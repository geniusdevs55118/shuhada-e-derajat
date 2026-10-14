"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  Stethoscope,
  HeartPulse,
  Award,
  CreditCard,
  PhoneCall,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface CarouselSlide {
  id: number;
  kicker: string;
  title: string;
  urduMotto?: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  badge: string;
  primaryCta: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  secondaryCta: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  };
}

const SLIDES: CarouselSlide[] = [
  {
    id: 1,
    kicker: "Mufti Mehmood Memorial Medical Teaching Institution",
    title: "Derajat Shuhada Family Healthcare Initiative",
    urduMotto: "شہداء کی عزت میں ان کے اہل خانہ کی خدمت • ان کی قربانی، ہماری ذمہ داری",
    tagline: "Honouring the Shuhada by Caring for Their Families with Dignity & Respect.",
    description:
      "A dedicated, coordinated healthcare pathway for the verified families of our brave Shuhada across Dera Ismail Khan's premier teaching hospitals.",
    image: "/images/hero-hospital.jpg",
    imageAlt: "Modern hospital facility serving Shuhada families in Dera Ismail Khan",
    badge: "Official Shuhada Healthcare Pathway",
    primaryCta: {
      label: "Verify Health Card",
      href: "/verify",
      icon: ShieldCheck,
    },
    secondaryCta: {
      label: "Staff Login",
      href: "/login",
      icon: Building2,
    },
  },
  {
    id: 2,
    kicker: "Integrated Teaching Hospital Network",
    title: "Three Premier Hospitals, One Coordinated Record",
    urduMotto: "ایک خاندانی ریکارڈ • تین ہسپتال • ایک مربوط طریقہ علاج",
    tagline: "DHQ Teaching Hospital • Mufti Mehmood Memorial • Derajat Women & Children Hospital",
    description:
      "Families only need to verify once to receive seamless, guided healthcare facilitation at every participating hospital without repeating paperwork.",
    image: "/images/hospitals.jpg",
    imageAlt: "Network of 3 teaching hospitals in Dera Ismail Khan",
    badge: "3 Participating Hospitals",
    primaryCta: {
      label: "Explore Hospitals",
      href: "/hospitals",
      icon: Building2,
    },
    secondaryCta: {
      label: "View All Services",
      href: "/services",
      icon: Stethoscope,
    },
  },
  {
    id: 3,
    kicker: "Uncompromising Medical Priority",
    title: "Emergency Care First • Clinical Triage Always",
    urduMotto: "ایمرجنسی علاج سب سے پہلے • مریض کی حفاظت سب سے مقدم",
    tagline: "Immediate clinical assessment is never delayed for routine verification.",
    description:
      "Dedicated 24/7 Family Health Desks coordinate urgent consultations, trauma care, admissions, and specialist referrals with the utmost dignity.",
    image: "/images/about-mission.jpg",
    imageAlt: "Compassionate medical staff attending patients",
    badge: "24/7 Priority Emergency Care",
    primaryCta: {
      label: "Emergency Protocol",
      href: "/how-it-works",
      icon: HeartPulse,
    },
    secondaryCta: {
      label: "Our Core Principles",
      href: "/about",
      icon: Award,
    },
  },
  {
    id: 4,
    kicker: "Financing & Welfare Integration",
    title: "Sehat Card Plus Facilitation & Free Diagnostics",
    urduMotto: "علاج کی سہولت اور مکمل رہنمائی • بلا تاخیر سروسز",
    tagline: "Facilitated access to specialized procedures, medicines, and diagnostics.",
    description:
      "End-to-end guidance for Sehat Card Plus claims, institutional pharmacy formulary medicines, and critical surgical interventions without financial distress.",
    image: "/images/services.jpg",
    imageAlt: "Advanced diagnostics and clinical healthcare services",
    badge: "Cashless Sehat Card Access",
    primaryCta: {
      label: "Sehat Card Guide",
      href: "/sehat-card-plus",
      icon: CreditCard,
    },
    secondaryCta: {
      label: "Contact Health Desk",
      href: "/contact",
      icon: PhoneCall,
    },
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="relative overflow-hidden bg-slate-950 text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Derajat Shuhada Healthcare Highlights"
    >
      {/* Slides Container */}
      <div className="relative min-h-[540px] sm:min-h-[580px] md:min-h-[620px] lg:min-h-[660px]">
        {SLIDES.map((slide, index) => {
          const isActive = index === current;
          const PrimaryIcon = slide.primaryCta.icon;
          const SecondaryIcon = slide.secondaryCta.icon;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              {/* Slide Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center transform scale-105 transition-transform duration-[7000ms] ease-out motion-safe:scale-100"
                />
                {/* Multi-layered rich dark green / navy gradient overlays */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-950/40 via-transparent to-transparent"
                  aria-hidden="true"
                />
              </div>

              {/* Slide Content with generous padding so text never collides with side controls */}
              <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-10 sm:px-16 md:px-20 lg:px-24 py-16 sm:py-20">
                <div className="max-w-3xl">
                  {/* Badge & Kicker */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
                      <Sparkles className="size-3.5 text-emerald-400" />
                      {slide.badge}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-200/90 hidden sm:inline">
                      {slide.kicker}
                    </span>
                  </div>

                  {/* Urdu Motto / Reverence Banner */}
                  {slide.urduMotto && (
                    <div className="mt-3.5 inline-block">
                      <p
                        dir="rtl"
                        className="rounded-lg border-r-2 border-emerald-400 bg-emerald-950/60 px-3 py-1 font-serif text-xs sm:text-sm md:text-base font-semibold tracking-wide text-emerald-200 shadow-sm backdrop-blur-sm"
                      >
                        {slide.urduMotto}
                      </p>
                    </div>
                  )}

                  {/* Main Title - Responsive fluid typography with no clamping collisions */}
                  <h1 className="mt-3.5 font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.18] tracking-tight text-white">
                    {slide.title}
                  </h1>

                  {/* Tagline */}
                  <p className="mt-3 text-sm sm:text-base md:text-lg font-medium leading-snug text-emerald-100/90">
                    {slide.tagline}
                  </p>

                  {/* Description */}
                  <p className="mt-2.5 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-300">
                    {slide.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3">
                    <Link
                      href={slide.primaryCta.href}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-900/40 transition-all duration-200 hover:bg-emerald-500 hover:shadow-emerald-700/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                    >
                      <PrimaryIcon className="size-4 shrink-0 text-white" />
                      <span>{slide.primaryCta.label}</span>
                      <ArrowRight className="size-3.5 shrink-0 opacity-80" />
                    </Link>

                    <Link
                      href={slide.secondaryCta.href}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-600/80 bg-slate-900/60 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-100 backdrop-blur-md transition-all duration-200 hover:border-slate-400 hover:bg-slate-800/80 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
                    >
                      <SecondaryIcon className="size-4 shrink-0 text-emerald-400" />
                      <span>{slide.secondaryCta.label}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls - Placed at edges with clear safety margin */}
      <div className="absolute inset-y-0 left-0 right-0 z-20 pointer-events-none flex items-center justify-between px-2 sm:px-4">
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="pointer-events-auto cursor-pointer inline-flex size-9 sm:size-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-white/50 hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-emerald-400 shadow-md"
        >
          <ChevronLeft className="size-5 sm:size-6" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="pointer-events-auto cursor-pointer inline-flex size-9 sm:size-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-white/50 hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-emerald-400 shadow-md"
        >
          <ChevronRight className="size-5 sm:size-6" />
        </button>
      </div>

      {/* Bottom Indicators */}
      <div className="absolute bottom-4 inset-x-0 z-20 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3.5 py-1.5 backdrop-blur-md">
          {SLIDES.map((slide, index) => {
            const isActive = index === current;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                className={`cursor-pointer transition-all duration-300 rounded-full focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                  isActive
                    ? "w-7 h-2 bg-emerald-400 shadow-sm shadow-emerald-400/50"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
