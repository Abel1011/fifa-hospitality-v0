"use client";

import { useState } from "react";
import { ArrowUpRight, Crown, Phone } from "lucide-react";
import Reveal from "./Reveal";
import { BallRoute, CornerFlag } from "./FootballMotifs";
import PrivateSuitesModal from "./PrivateSuitesModal";
import PlatinumAccessModal from "./PlatinumAccessModal";
import AccommodationsModal from "./AccommodationsModal";

const PRIVATE_SUITES = {
  title: "Private Suites",
  copy:
    "Level up with this exclusive offering that includes preferred entry, direct seating access, and dedicated service \u2013 all to be enjoyed privately among you and your guests.",
  cta: {
    label: "Reserve a Suite",
  },
  image:
    "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/68c8434f194725f4b9bd0016_suites-p-800.webp",
};

const ADDITIONAL = {
  title: "Additional Offerings",
  copy:
    "These specialty offerings are only available via inquiry (they cannot be purchased online). Please contact us here or call us at 1-844-652-1685.",
  phone: "1-844-652-1685",
  phoneHref: "tel:+18446521685",
  offerings: [
    {
      id: "platinum" as const,
      title: "Platinum Access",
      tag: "Inquiry only",
      copy:
        "The most exclusive offering. It delivers an all-encompassing experience with full-service customization and the most premium access available.",
      cta: {
        label: "Register Interest",
      },
      image:
        "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/695ff22c837bb7e65d721b77_Rectangle%2040258.webp",
      imagePosition: "object-[center_38%]",
    },
    {
      id: "accommodations" as const,
      title: "Accommodations",
      tag: "Travel package",
      copy:
        "Select your preferred hotels, experiences, and/or car rentals to create your ideal trip package.",
      cta: {
        label: "Book Now",
      },
      image:
        "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/69e79bd516a4bb9a1a811027_la.webp",
      imagePosition: "object-[center_45%]",
    },
  ],
};

export default function PremiumOfferings() {
  const [showSuites, setShowSuites] = useState(false);
  const [showPlatinum, setShowPlatinum] = useState(false);
  const [showAccommodations, setShowAccommodations] = useState(false);

  return (
    <section
      id="premium"
      className="relative isolate overflow-hidden bg-background font-[family-name:var(--font-display)]"
    >
      {/* glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[60vw] rounded-full blur-[140px] opacity-[0.18]"
        style={{
          background:
            "radial-gradient(closest-side, #00c8ff 0%, transparent 70%)",
        }}
      />
      <BallRoute
        className="top-4 right-[4%] hidden h-20 w-[400px] rotate-3 opacity-30 lg:block"
        tone="accent"
      />

      <div className="relative z-[1] px-6 sm:px-10 md:px-20 pt-20 sm:pt-28 pb-20 sm:pb-28">
        <div className="w-full max-w-[1600px] mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <span className="block h-px w-10 bg-accent" />
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-accent">
              &sect;04 &mdash; Premium &amp; Custom
            </span>
          </div>

          {/* Private Suites — featured magazine layout */}
          <Reveal y={22} duration={750}>
            <PrivateSuitesFeature onOpen={() => setShowSuites(true)} />
          </Reveal>

          {/* Additional Offerings */}
          <AdditionalOfferings
            onOpenPlatinum={() => setShowPlatinum(true)}
            onOpenAccommodations={() => setShowAccommodations(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <PrivateSuitesModal
        suite={showSuites ? {
          venueName: "Your Preferred Venue",
          title: "Private Suites",
          copy: PRIVATE_SUITES.copy,
        } : null}
        onClose={() => setShowSuites(false)}
      />
      <PlatinumAccessModal open={showPlatinum} onClose={() => setShowPlatinum(false)} />
      <AccommodationsModal open={showAccommodations} onClose={() => setShowAccommodations(false)} />
    </section>
  );
}

function PrivateSuitesFeature({ onOpen }: { onOpen: () => void }) {
  return (
    <article className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
      {/* LEFT: editorial copy */}
      <div className="lg:col-span-5 flex flex-col">
        <div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-accent mb-6">
            <Crown className="h-3 w-3" />
            Most exclusive
          </span>

          <h2 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-foreground text-[12vw] sm:text-[8vw] md:text-[6vw] xl:text-[96px]">
            Private{" "}
            <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight text-accent">
              suites.
            </span>
          </h2>

          <p className="mt-6 font-[family-name:var(--font-serif)] italic text-foreground/80 text-base sm:text-lg leading-snug max-w-md">
            {PRIVATE_SUITES.copy}
          </p>

          {/* Decorative meta line */}
          <ul className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            <Stat label="Preferred" value="Entry" />
            <Stat label="Direct" value="Seating" />
            <Stat label="Dedicated" value="Service" />
          </ul>

          <button
            onClick={onOpen}
            className="group/cta mt-10 inline-flex w-fit items-center justify-between gap-3 rounded-full bg-accent px-6 py-3.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-background transition hover:bg-foreground cursor-pointer"
          >
            <span>{PRIVATE_SUITES.cta.label}</span>
            <ArrowUpRight className="h-4 w-4 transition group-hover/cta:rotate-45" />
          </button>
        </div>
      </div>

      {/* RIGHT: image */}
      <div className="lg:col-span-7 relative">
        <div className="group relative overflow-hidden rounded-3xl border border-foreground/10 aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[560px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PRIVATE_SUITES.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(220deg,transparent_30%,rgba(5,10,15,0.55)_100%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgba(0,200,255,0.18)_0%,transparent_55%)]"
          />

          <CornerFlag className="bottom-5 right-5 opacity-70" tone="accent" />

          {/* corner caption */}
          <div className="absolute top-5 left-5 right-5 flex items-start justify-between gap-3">
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/80">
              01 / Featured
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/60 text-right">
              FIFA World Cup 2026&trade;
              <br />
              Hospitality
            </span>
          </div>
          <div className="absolute bottom-5 left-5 font-[family-name:var(--font-serif)] italic text-foreground/85 text-sm sm:text-base">
            &mdash; an exclusive retreat for you and your guests.
          </div>
        </div>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <li className="border-t border-foreground/15 pt-3">
      <div className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/45">
        {label}
      </div>
      <div className="mt-1 font-[family-name:var(--font-display)] font-bold uppercase tracking-tight text-foreground text-base sm:text-lg">
        {value}
      </div>
    </li>
  );
}

function AdditionalOfferings({ onOpenPlatinum, onOpenAccommodations }: { onOpenPlatinum: () => void; onOpenAccommodations: () => void }) {
  return (
    <div className="mt-24 sm:mt-32">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-end mb-10 md:mb-14">
        <div className="md:col-span-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="block h-px w-10 bg-gold" />
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-gold">
              By inquiry
            </span>
          </div>
          <h3 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-foreground text-4xl sm:text-5xl xl:text-[64px]">
            Additional{" "}
            <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight text-gold">
              offerings.
            </span>
          </h3>
          <p className="mt-5 font-[family-name:var(--font-serif)] italic text-foreground/75 text-base sm:text-lg leading-snug max-w-lg">
            {ADDITIONAL.copy}
          </p>
        </div>

        {/* Phone CTA */}
        <a
          href={ADDITIONAL.phoneHref}
          className="md:col-span-5 group/phone flex items-center justify-between gap-4 border-t border-foreground/15 pt-5 hover:border-gold transition"
        >
          <div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/45 mb-1">
              Call to inquire
            </div>
            <div className="font-[family-name:var(--font-display)] font-bold tracking-tight text-foreground text-2xl sm:text-3xl tabular-nums group-hover/phone:text-gold transition">
              {ADDITIONAL.phone}
            </div>
          </div>
          <Phone className="h-5 w-5 text-gold transition group-hover/phone:rotate-12" />
        </a>
      </div>

      {/* Two cards with image header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ADDITIONAL.offerings.map((o, i) => (
          <Reveal key={o.title} y={20} duration={700} delay={i * 130} className="h-full">
          <article
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-surface/30 h-full"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-background/40 lg:aspect-[16/9]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={o.image}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 ${o.imagePosition}`}
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,15,0.15)_0%,rgba(5,10,15,0.55)_60%,rgba(5,10,15,0.95)_100%)]"
              />

              <div className="absolute top-5 left-5 right-5 flex items-start justify-between gap-3">
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/80">
                  0{i + 1} / Specialty
                </span>
                <span className="inline-flex items-center rounded-full border border-gold/50 bg-gold/15 backdrop-blur-sm px-2.5 py-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.25em] text-gold">
                  {o.tag}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <h4 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-foreground text-3xl sm:text-4xl xl:text-[44px]">
                  {o.title}
                </h4>
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-6 sm:p-8 border-t border-foreground/10">
              <p className="font-[family-name:var(--font-serif)] italic text-foreground/80 text-base sm:text-lg leading-snug flex-1 max-w-xl">
                {o.copy}
              </p>
              <button
                onClick={o.id === "platinum" ? onOpenPlatinum : onOpenAccommodations}
                className="mt-6 inline-flex w-fit items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-foreground border-b border-foreground/30 pb-1 transition hover:border-gold hover:text-gold cursor-pointer"
              >
                <span>{o.cta.label}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:rotate-45" />
              </button>
            </div>
          </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
