"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import { HOSPITALITY_SOURCE } from "@/lib/fifaLanding";

const FootballScene = dynamic(() => import("./FootballScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#020608]" />,
});

const TARGET_DATE = new Date("2026-06-11T14:00:00-06:00").getTime();

function getTimeRemaining() {
  const now = Date.now();
  const diff = Math.max(0, TARGET_DATE - now);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Hero() {
  const [time, setTime] = useState<ReturnType<typeof getTimeRemaining> | null>(null);
  const [textIn, setTextIn] = useState(false);

  useEffect(() => {
    setTime(getTimeRemaining());
    const id = setInterval(() => setTime(getTimeRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const trigger = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => setTextIn(true), 1000);
    };
    window.addEventListener("fifa:ball-ready", trigger as EventListener);
    // Safety fallback in case event was missed (e.g., reduced motion / quick load)
    const fallback = setTimeout(() => setTextIn(true), 4500);
    return () => {
      window.removeEventListener("fifa:ball-ready", trigger as EventListener);
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden font-[family-name:var(--font-display)]">
      {/* 3D scene */}
      <FootballScene />

      {/* Readability gradient */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,6,8,0.55) 0%, rgba(2,6,8,0) 22%, rgba(2,6,8,0) 55%, rgba(2,6,8,0.92) 100%)",
        }}
      />

      {/* Editorial 12-col grid overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 calc(8.333% - 1px), rgba(255,255,255,0.5) calc(8.333% - 1px) 8.333%)",
        }}
      />

      {/* Top bar removed — Navbar handles masthead. Keep only the flag swatches at top-right for editorial accent on md+. */}
      <div className="absolute top-3 right-4 sm:right-6 z-[3] hidden md:flex items-center gap-1 pt-14">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/40 mr-2">
          CAN · MEX · USA
        </span>
        <span className="block h-3 w-3 bg-[#ff3030]" />
        <span className="block h-3 w-3 bg-white" />
        <span className="block h-3 w-3 bg-[#1a8a3e]" />
        <span className="block h-3 w-3 bg-[#0a2e6e]" />
      </div>

      {/* Left rail — vertical type */}
      <aside className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-[3] hidden md:flex flex-col items-center gap-6">
        <span
          className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-foreground/40"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Canada · Mexico · USA
        </span>
        <div className="h-16 w-px bg-foreground/20" />
        <span className="font-[family-name:var(--font-serif)] italic text-foreground/60 text-sm">
          2026
        </span>
      </aside>

      {/* MAIN — bottom-left editorial block */}
      <div
        className="relative z-[2] min-h-screen flex flex-col justify-end px-6 sm:px-10 md:px-20 pb-10 sm:pb-14 pt-24"
        style={{
          opacity: textIn ? 1 : 0,
          transform: textIn ? "translate3d(0,0,0)" : "translate3d(0,16px,0)",
          filter: textIn ? "blur(0px)" : "blur(6px)",
          transition:
            "opacity 1100ms cubic-bezier(0.22,1,0.36,1), transform 1100ms cubic-bezier(0.22,1,0.36,1), filter 900ms ease-out",
          willChange: "opacity, transform, filter",
        }}
      >
       <div className="w-full max-w-[1600px] mx-auto flex flex-col">
        {/* Caption above title */}
        <div className="flex items-center gap-3 mb-5">
          <span className="block h-px w-10 bg-accent" />
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-accent">
            {HOSPITALITY_SOURCE.hero.eyebrow}
          </span>
        </div>

        {/* Title — editorial mix of display + italic serif */}
        <h1 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-foreground select-none">
          <span className="block text-[18vw] sm:text-[14vw] md:text-[11vw] lg:text-[10vw] xl:text-[160px]">
            FIFA World
          </span>
          <span className="block text-[18vw] sm:text-[14vw] md:text-[11vw] lg:text-[10vw] xl:text-[160px]">
            Cup{" "}
            <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight bg-gradient-to-br from-accent via-foreground to-gold bg-clip-text text-transparent">
              2026
              <sup className="align-super text-[0.35em] not-italic font-[family-name:var(--font-display)] text-foreground/40 ml-1">™</sup>
            </span>
          </span>
        </h1>

        {/* Countdown — prominent on every breakpoint, the centerpiece of the hero */}
        <div className="mt-6 sm:mt-8 flex items-center gap-4 sm:gap-6">
          <span className="font-[family-name:var(--font-mono)] text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-accent whitespace-nowrap">
            Kickoff
            <br className="hidden sm:inline" />
            <span className="sm:hidden"> </span>
            in
          </span>
          <div className="flex items-baseline gap-3 sm:gap-5">
            {[
              { v: time?.days ?? 0, l: "Days" },
              { v: time?.hours ?? 0, l: "Hrs" },
              { v: time?.minutes ?? 0, l: "Min" },
              { v: time?.seconds ?? 0, l: "Sec" },
            ].map((u, i) => (
              <div key={u.l} className="flex items-baseline">
                {i > 0 && (
                  <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl text-foreground/20 mr-3 sm:mr-5">:</span>
                )}
                <div className="flex flex-col items-start leading-none">
                  <span className="font-[family-name:var(--font-display)] tabular-nums text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                    {String(u.v).padStart(2, "0")}
                  </span>
                  <span className="mt-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.25em] text-foreground/45">
                    {u.l}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <span className="hidden md:inline font-[family-name:var(--font-serif)] italic text-foreground/45 text-sm whitespace-nowrap">
            — 11 jun 2026
          </span>
        </div>

        {/* Lower row — 3 cols: tagline / stats / CTAs */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-5">
            <p className="font-[family-name:var(--font-serif)] italic text-foreground/80 text-lg sm:text-xl leading-snug max-w-md">
              {HOSPITALITY_SOURCE.hero.copy}
            </p>
          </div>

          <div className="md:col-span-3 flex items-end gap-5 font-[family-name:var(--font-mono)]">
            {[
              ["48", "Teams"],
              ["104", "Matches"],
              ["16", "Venues"],
            ].map(([n, l]) => (
              <div key={l} className="flex flex-col leading-none">
                <span className="text-3xl font-bold text-foreground tabular-nums">
                  {n}
                </span>
                <span className="mt-1 text-[9px] uppercase tracking-[0.3em] text-foreground/50">
                  {l}
                </span>
              </div>
            ))}
          </div>

          <div className="md:col-span-4 flex flex-wrap md:justify-end items-center gap-3">
            <a
              href={HOSPITALITY_SOURCE.hero.ctas[1].href}
              target="_blank"
              rel="noopener noreferrer"
              title="Browse private suites"
              className="group flex items-center gap-2 rounded-full border border-foreground/30 px-4 py-2.5 text-foreground/85 hover:border-gold hover:text-gold transition"
            >
              <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.25em]">
                {HOSPITALITY_SOURCE.hero.ctas[1].label}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:rotate-45" />
            </a>
            <a
              href={HOSPITALITY_SOURCE.hero.ctas[0].href}
              title="Browse hospitality matches"
              className="group relative flex items-center gap-3 rounded-full bg-gold px-5 py-3 text-background transition hover:bg-gold/90"
            >
              <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.25em]">
                {HOSPITALITY_SOURCE.hero.ctas[0].label}
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground transition group-hover:rotate-45">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>
        </div>

        {/* Footer ticker — opening + final venues (no metric duplication with stats row) */}
        <div className="mt-10 grid grid-cols-2 items-center gap-3 border-t border-foreground/10 pt-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/40">
          <div className="flex flex-col gap-0.5">
            <span className="text-accent">Opening Match</span>
            <span className="text-foreground/55 normal-case tracking-normal font-[family-name:var(--font-serif)] italic text-xs">
              Estadio Azteca, México City · 11 Jun
            </span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-gold">Final</span>
            <span className="text-foreground/55 normal-case tracking-normal font-[family-name:var(--font-serif)] italic text-xs">
              MetLife Stadium, NY/NJ · 19 Jul
            </span>
          </div>
        </div>
       </div>
      </div>
    </section>
  );
}
