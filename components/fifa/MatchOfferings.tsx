"use client";

import { ArrowUpRight, Sparkles, Trophy } from "lucide-react";
import Reveal from "./Reveal";
import { CornerFlag, PitchBlueprint } from "./FootballMotifs";

type CTA = { label: string; href: string };

type Offering = {
  title: string;
  badge?: string;
  copy: string;
  note?: string;
  bullets: string[];
  cta: CTA;
  image: string;
};

const SECTION = {
  title: "Match Offerings",
  copy: "Every offering features premium seats and hospitality.",
  steps: [
    "Choose Offerings",
    "Choose Hospitality",
    "Configure & Check Out",
  ],
};

const OFFERINGS: Offering[] = [
  {
    title: "Single Match",
    badge: "Now Available",
    copy: "See the beautiful game on its greatest stage at your match of choice.",
    note: "Now available: Team USA and Semi-Final matches!",
    bullets: [
      "Group Stage: Any 1 match, including Team USA",
      "Knockout Stages: Any 1 match, except the Final (eligible: R32/R16/QFs/SFs/Bronze Final)",
      "Hospitality options: Pitchside Lounge, VIP, Trophy Lounge, Champions Club, FIFA Pavilion",
    ],
    cta: {
      label: "Buy Now",
      href: "/matches",
    },
    image:
      "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c32/68e520a0ca5637eed2191a66_Frame%201321317772.webp",
  },
  {
    title: "Venue Series",
    copy: "Watch every match at the venue of your choice.",
    bullets: [
      "Includes 4-9 matches, depending on venue",
      "All match days and stages eligible",
      "Hospitality options: Pitchside Lounge, VIP, Trophy Lounge, Champions Club, FIFA Pavilion",
    ],
    cta: {
      label: "Buy Now",
      href: "/bundles?view=venue-series",
    },
    image:
      "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/69d95f9874e2be75aaa7fb27_FWC26_Ecomm_Photo_Update_C_800x800.webp",
  },
  {
    title: "Follow My Team",
    copy: "See your team in action at every early-stage match, regardless of location.",
    bullets: [
      "All match days and locations eligible",
      "Follow My Team is not available at this time for host nation teams (Canada, Mexico, U.S.)",
      "Hospitality options: Pitchside Lounge, VIP, Trophy Lounge, Champions Club FIFA Pavilion",
    ],
    cta: {
      label: "Buy Now",
      href: "/bundles?view=follow-team",
    },
    image:
      "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/69d95f1cd329a58ab5240e4b_FWC26_Ecomm_Photo_Update_A_788x1000.webp",
  },
];

const MULTI = {
  title: "Multi-Match Series",
  badge: "Your path to the Final Match!",
  copy: "Customize your ultimate FIFA World Cup 2026\u2122 experience. Must purchase 4-5 matches (see details).",
  note: "All matches subject to availability.",
  pathToFinal: [
    "Choose from any Group Stage (except Team USA) or Round of 32",
    "Choose from all previous options or Round of 16 or Bronze Final",
    "Choose from all previous options or Team USA Group Stage or Quarter-Finals or Semi-Finals",
    "Choose from all previous options (incl. Team USA Group Stage or QFs or SFs)",
    "Choose from all matches, including the FINAL!",
  ],
  cta: {
    label: "Buy Now",
    href: "/matches",
  },
  image:
    "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/68f627eb1272fd31387f0f30_1450090219%201.webp",
};

export default function MatchOfferings() {
  const [featuredOffering, ...secondaryOfferings] = OFFERINGS;

  return (
    <section
      id="offerings"
      className="relative isolate overflow-hidden bg-background font-[family-name:var(--font-display)]"
    >
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-foreground/10" />

      {/* glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-0 h-[420px] w-[60vw] rounded-full blur-[140px] opacity-[0.18]"
        style={{
          background:
            "radial-gradient(closest-side, #d4a843 0%, transparent 70%)",
        }}
      />
      <PitchBlueprint
        className="opacity-[0.06] [mask-image:linear-gradient(100deg,transparent_0%,#000_24%,#000_76%,transparent_100%)]"
        tone="gold"
      />

      <div className="relative z-[1] px-6 sm:px-10 md:px-20 pt-20 sm:pt-28 pb-20 sm:pb-28">
        <div className="w-full max-w-[1600px] mx-auto">
          {/* Header */}
          <Reveal y={20} duration={750}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-end mb-12 md:mb-20">
            <div className="md:col-span-7">
              <div className="flex items-center gap-3 mb-5">
                <span className="block h-px w-10 bg-gold" />
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-gold">
                  &sect;03 &mdash; Offerings
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.03em] text-foreground text-[12vw] sm:text-[8vw] md:text-[6vw] xl:text-[96px]">
                Pick the{" "}
                <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight text-gold">
                  experience.
                </span>
              </h2>
              <p className="mt-6 font-[family-name:var(--font-serif)] italic text-foreground/75 text-base sm:text-lg leading-snug max-w-md">
                {SECTION.copy}
              </p>
            </div>

            {/* Steps as horizontal flow — palette signal: cyan / gold / pitch */}
            <ol className="md:col-span-5 grid grid-cols-3 gap-2">
              {SECTION.steps.map((step, idx) => {
                const palette = [
                  { bar: "bg-accent", text: "text-accent" },
                  { bar: "bg-gold", text: "text-gold" },
                  { bar: "bg-pitch", text: "text-pitch" },
                ][idx];
                return (
                  <li
                    key={step}
                    className="relative flex flex-col gap-2 border-t border-foreground/15 pt-3"
                  >
                    <span className={`absolute -top-px left-0 h-px w-1/2 ${palette.bar}`} />
                    <span className={`font-[family-name:var(--font-mono)] text-[10px] tabular-nums uppercase tracking-[0.3em] ${palette.text}`}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-foreground/85 text-sm leading-tight tracking-tight">
                      {step}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
          </Reveal>

          {/* Asymmetric offering layout for clearer hierarchy */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
            <Reveal y={22} duration={700} className="xl:col-span-7 h-full flex">
              <FeaturedOfferingCard offering={featuredOffering} />
            </Reveal>

            <div className="xl:col-span-5 grid grid-cols-1 gap-5">
              {secondaryOfferings.map((offering, index) => (
                <Reveal
                  key={offering.title}
                  y={22}
                  duration={700}
                  delay={(index + 1) * 110}
                  className="h-full flex"
                >
                  <CompactOfferingCard offering={offering} index={index + 2} />
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <Reveal y={18} duration={700}>
              <MultiMatchBanner />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Offering cards ---------- */

function FeaturedOfferingCard({ offering }: { offering: Offering }) {
  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-surface/30">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="relative min-h-[320px] overflow-hidden lg:min-h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={offering.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,15,0.22)_0%,rgba(5,10,15,0.5)_48%,rgba(5,10,15,0.92)_100%)] lg:bg-[linear-gradient(90deg,rgba(5,10,15,0.18)_0%,rgba(5,10,15,0.22)_35%,rgba(5,10,15,0.86)_100%)]"
          />
          <CornerFlag
            tone="accent"
            className="bottom-4 right-4 opacity-0 transition duration-500 group-hover:opacity-80"
          />

          <div className="absolute top-5 left-5 right-5 flex items-start justify-between gap-3">
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/75">
              01 / Signature
            </span>
            {offering.badge && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/15 backdrop-blur-sm px-2.5 py-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.25em] text-accent">
                <Sparkles className="h-3 w-3" />
                {offering.badge}
              </span>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:hidden">
            <h3 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-foreground text-3xl sm:text-4xl">
              {offering.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-col border-t border-foreground/10 p-5 sm:p-6 lg:border-l lg:border-t-0 lg:p-8 xl:p-10">
          <div className="hidden lg:block">
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-accent/80">
              01 / Signature Offering
            </span>
            <h3 className="mt-4 font-[family-name:var(--font-display)] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-foreground text-4xl xl:text-5xl">
              {offering.title}
            </h3>
          </div>

          <p className="mt-3 font-[family-name:var(--font-serif)] italic text-foreground/80 text-base sm:text-lg leading-snug">
            {offering.copy}
          </p>

          {offering.note && (
            <div className="mt-5 rounded-2xl border border-gold/20 bg-gold/8 px-4 py-3">
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-gold leading-relaxed">
                {offering.note}
              </p>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2 flex-1">
            {offering.bullets.map((bullet, index) => (
              <div
                key={bullet}
                className="rounded-2xl border border-foreground/10 bg-background/35 px-4 py-4"
              >
                <span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums uppercase tracking-[0.25em] text-accent">
                  /{String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-[13px] leading-snug text-foreground/70">
                  {bullet}
                </p>
              </div>
            ))}
          </div>

          <a
            href={offering.cta.href}
            className="group/cta mt-6 inline-flex w-fit items-center justify-between gap-3 rounded-full border border-foreground/20 px-5 py-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-foreground transition hover:border-accent hover:bg-accent hover:text-background"
          >
            <span>{offering.cta.label}</span>
            <ArrowUpRight className="h-4 w-4 transition group-hover/cta:rotate-45" />
          </a>
        </div>
      </div>
    </article>
  );
}

function CompactOfferingCard({
  offering,
  index,
}: {
  offering: Offering;
  index: number;
}) {
  const tone = index === 2 ? "gold" : "pitch";

  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-surface/30">
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={offering.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <CornerFlag
          tone={tone}
          className="bottom-4 right-4 opacity-0 transition duration-500 group-hover:opacity-80"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,15,0.15)_0%,rgba(5,10,15,0.55)_60%,rgba(5,10,15,0.95)_100%)]"
        />

        {/* TL meta */}
        <div className="absolute top-5 left-5 right-5 flex items-start justify-between gap-3">
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/75">
            0{index} / Offering
          </span>
          {offering.badge && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/15 backdrop-blur-sm px-2.5 py-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.25em] text-accent">
              <Sparkles className="h-3 w-3" />
              {offering.badge}
            </span>
          )}
        </div>

        {/* Title overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <h3 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-foreground text-3xl sm:text-4xl">
            {offering.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 border-t border-foreground/10 p-5 sm:p-6">
        <p className="font-[family-name:var(--font-serif)] italic text-foreground/80 text-base leading-snug">
          {offering.copy}
        </p>
        {offering.note && (
          <p className="mt-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-gold leading-relaxed">
            {offering.note}
          </p>
        )}

        <ul className="mt-5 space-y-2.5 flex-1">
          {offering.bullets.map((b, i) => (
            <li
              key={b}
              className="flex items-start gap-3 text-foreground/65 text-[12.5px] leading-snug"
            >
              <span className={`font-[family-name:var(--font-mono)] mt-0.5 w-5 shrink-0 text-[10px] tabular-nums ${tone === "gold" ? "text-gold" : "text-pitch"}`}>
                /{String(i + 1).padStart(2, "0")}
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <a
          href={offering.cta.href}
          className="mt-6 inline-flex items-center justify-between gap-3 rounded-full border border-foreground/20 px-5 py-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-foreground transition hover:border-accent hover:bg-accent hover:text-background"
        >
          <span>{offering.cta.label}</span>
          <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
        </a>
      </div>
    </article>
  );
}

/* ---------- Multi-Match banner ---------- */

function MultiMatchBanner() {
  return (
    <article className="relative mt-5 overflow-hidden rounded-3xl border border-gold/30">
      {/* Background image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={MULTI.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(105deg,rgba(5,10,15,0.95)_0%,rgba(5,10,15,0.85)_45%,rgba(5,10,15,0.55)_75%,rgba(212,168,67,0.25)_100%)]"
        />


      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 p-6 sm:p-10 md:p-14">
        {/* LEFT: title + cta */}
        <div className="lg:col-span-5 flex flex-col">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/60 bg-gold/15 backdrop-blur-sm px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-gold mb-6">
            <Trophy className="h-3 w-3" />
            {MULTI.badge}
          </span>

          <h3 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-foreground text-4xl sm:text-5xl xl:text-[72px]">
            Multi-Match{" "}
            <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight text-gold">
              series.
            </span>
          </h3>

          <p className="mt-5 font-[family-name:var(--font-serif)] italic text-foreground/85 text-base sm:text-lg leading-snug max-w-md">
            {MULTI.copy}
          </p>
          <p className="mt-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-foreground/55">
            {MULTI.note}
          </p>

          <a
            href={MULTI.cta.href}
            className="group/cta mt-8 inline-flex w-fit items-center justify-between gap-3 rounded-full bg-gold px-6 py-3.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-background transition hover:bg-foreground"
          >
            <span>{MULTI.cta.label}</span>
            <ArrowUpRight className="h-4 w-4 transition group-hover/cta:rotate-45" />
          </a>
        </div>

        {/* RIGHT: vertical timeline of 5 steps */}
        <div className="lg:col-span-7">
          <div className="flex items-end justify-between border-b border-foreground/20 pb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/55 mb-4">
            <span>Path to the Final</span>
            <span>Match 1 &mdash; 5</span>
          </div>

          <ol className="relative">
            {/* connector */}
            <span
              aria-hidden
              className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-foreground/20 via-gold/40 to-gold"
            />
            {MULTI.pathToFinal.map((step, idx) => {
              const isFinal = idx === MULTI.pathToFinal.length - 1;
              return (
                <li
                  key={step}
                  className="relative flex items-start gap-5 py-3"
                >
                  <span
                    className={`relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-[family-name:var(--font-mono)] text-[12px] tabular-nums tracking-tight backdrop-blur-sm ${
                      isFinal
                        ? "border-gold bg-gold text-background font-bold"
                        : "border-foreground/30 bg-background/60 text-foreground/85"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span
                    className={`pt-2 text-[13px] sm:text-[14px] leading-snug ${
                      isFinal
                        ? "font-[family-name:var(--font-display)] font-bold uppercase tracking-tight text-gold"
                        : "text-foreground/80"
                    }`}
                  >
                    {step}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </article>
  );
}
