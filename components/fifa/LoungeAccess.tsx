"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import Crossfade from "./Crossfade";
import { PitchBlueprint } from "./FootballMotifs";

const CYCLE_MS = 6500;

const LOUNGES = [
  {
    id: "pitchside",
    name: "Pitchside Lounge",
    seating: "Premier Sideline Seating",
    seatingDetail:
      "Premium seats located along the sidelines, offering an exceptional view of the action.",
    copy:
      "Step into a realm where luxury hospitality and thrilling on-field action converge. Enjoy upscale dining with live-action cooking stations plus other gourmet offerings — as well as premium beverage service — served both pre- and post-match. With unrivaled seat views located near the field along the sidelines, you are not just a spectator – you are part of the action.",
    features: [
      "Dedicated guest relations",
      "Exclusive premium beverage program",
      "Top-tier culinary offerings",
    ],
    image:
      "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/695ea5433ac4fdee2fdea0a3_FWC26_Homepage_Photo_UnrivaledAccess_598x412px.webp",
  },
  {
    id: "vip",
    name: "VIP",
    seating: "Elevated Sideline Seating",
    seatingDetail:
      "Premium sideline seating offering an enhanced view of the match in most venues.",
    copy:
      "Your entry to an exclusive experience that blends luxurious comfort with electrifying energy. Witness the action in premium sideline seats while enjoying elevated amenities — including curated, themed-menu stations and sommelier-guided beverage service. All of which are offered before the match, at halftime, and after the final whistle.",
    features: [
      "City-centric welcome experience",
      "Premium selection of beverages",
      "Curated stations with seasonal, locally sourced ingredients",
    ],
    image:
      "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/695ea55aa3fe1ca1af36072d_FWC26_Homepage_Photo_UnrivaledAccess_598x714px.webp",
  },
  {
    id: "trophy",
    name: "Trophy Lounge",
    seating: "Prime Sideline Seating",
    seatingDetail:
      "Combining comfort and convenience with excellent views and easy access to amenities.",
    copy:
      "This elevated lounge delivers top-tier hospitality with a focus on convenience, comfort, and service. Featuring excellent sideline seat views, it provides a dynamic atmosphere to enjoy premium beverage service and upscale culinary offerings — including a chef-driven menu featuring local flavors and ingredients — all to be enjoyed pre-match, halftime, and post-match.",
    features: [
      "Welcome refreshments",
      "Signature cocktails and mocktails",
      "Signature menu crafted by local chefs",
    ],
    image:
      "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/695ea5835a2ba2d770eefc5a_FWC26_Homepage_Photo_UnrivaledAccess_299x357px.webp",
  },
  {
    id: "champions",
    name: "Champions Club",
    seating: "Preferred Seating",
    seatingDetail:
      "Combining comfort and convenience with excellent views and easy access to amenities.",
    copy:
      "A vibrant, elevated atmosphere designed to balance energy and comfort. Just steps from exclusive hospitality spaces, these seats offer easy access to premium amenities — including beverage service along with a full-course menu featuring chef-carved selections and gourmet shareable plates — all of which are available pre- and post-match.",
    features: [
      "Welcome refreshments",
      "Signature cocktails and mocktails",
      "Signature menu crafted by local chefs",
    ],
    image:
      "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/695ea58ef0888117584ce56c_FWC26_Homepage_Photo_UnrivaledAccess_412x598px.webp",
  },
  {
    id: "pavilion",
    name: "FIFA Pavilion",
    seating: "Preferred Seating",
    seatingDetail:
      "Offering great views and convenient access, available in a variety of locations.",
    copy:
      "Welcome to an exclusive retreat set against the backdrop of the stadium. Within our secure perimeter immediately outside the venue, the excitement of the game extends beyond the pitch with a range of amenities — including elevated dining featuring street food classics infused with local flavors as well as beverage service — all to be enjoyed both pre- and post-match.",
    features: [
      "Vibrant welcome experience",
      "Specialty cocktails (and mocktails)",
      "Gourmet street eats infused with local flair",
    ],
    image:
      "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/68f627eb1272fd31387f0f30_1450090219%201.webp",
  },
];

export default function LoungeAccess() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % LOUNGES.length);
    }, CYCLE_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, active]);

  const handleSelect = (i: number) => {
    setActive(i);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const lounge = LOUNGES[active];

  return (
    <section
      id="lounges"
      className="relative isolate overflow-hidden bg-background font-[family-name:var(--font-display)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Decorative giant pitch arc */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[640px] w-[640px] rounded-full opacity-[0.18]"
        style={{
          background:
            "radial-gradient(closest-side, #1a8a3e 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-30%] right-[-10%] h-[700px] w-[700px] rounded-full opacity-[0.14]"
        style={{
          background:
            "radial-gradient(closest-side, #00c8ff 0%, transparent 70%)",
        }}
      />
      <PitchBlueprint
        className="opacity-[0.07] [mask-image:linear-gradient(115deg,transparent_0%,#000_18%,#000_64%,transparent_100%)]"
        tone="pitch"
      />

      <div className="relative z-[1] px-6 sm:px-10 md:px-20 pt-20 sm:pt-28 pb-24 sm:pb-32">
        <div className="w-full max-w-[1600px] mx-auto">
          {/* Eyebrow + section number rail */}
          <Reveal y={18} duration={700}>
          <div className="flex items-end justify-between gap-6 mb-10 sm:mb-14">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="block h-px w-10 bg-pitch" />
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-pitch">
                  &sect;05 &mdash; Lounge Experience
                </span>
              </div>

              <h2 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.88] tracking-[-0.03em] text-foreground text-[14vw] sm:text-[10vw] md:text-[8vw] xl:text-[120px]">
                Unrivaled
                <br />
                <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight text-pitch">
                  lounge access.
                </span>
              </h2>
            </div>

            {/* Counter + nav */}
            <div className="hidden lg:flex flex-col items-end shrink-0 gap-3">
              <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                Now showing
              </div>
              <div className="font-[family-name:var(--font-display)] font-bold tabular-nums text-foreground text-6xl tracking-tight">
                <Crossfade contentKey={active} duration={400} y={6} className="inline-block">
                  <span className="text-gold">
                    {String(active + 1).padStart(2, "0")}
                  </span>
                </Crossfade>
                <span className="text-foreground/30">
                  /{String(LOUNGES.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
          </Reveal>

          {/* Intro copy */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-24">
            <p className="md:col-span-6 lg:col-span-5 font-[family-name:var(--font-serif)] italic text-foreground/80 text-lg sm:text-xl leading-snug">
              After selecting your series, choose from a selection of dynamic
              lounge offerings at every venue.
            </p>
            <p className="md:col-span-6 lg:col-span-6 lg:col-start-7 text-foreground/55 text-sm sm:text-base leading-relaxed max-w-xl">
              Each of the <span className="text-foreground font-semibold">16 host venues</span> offers
              multiple lounge options, all of which blend luxury comfort with
              extraordinary viewing access. Lounge quantities, sizes, and
              features vary by venue.
            </p>
          </div>

          {/* MAIN: Lounge selector + active panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* LEFT: Vertical track list */}
            <ol className="lg:col-span-4 flex flex-col">
              {LOUNGES.map((l, i) => {
                const isActive = i === active;
                return (
                  <li
                    key={l.id}
                    className={`group relative border-t border-foreground/10 ${
                      i === LOUNGES.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(i)}
                      className="w-full text-left flex items-center gap-5 py-5 sm:py-6 transition"
                    >
                      {/* Number */}
                      <span
                        className={`font-[family-name:var(--font-mono)] text-[10px] tabular-nums tracking-[0.3em] transition ${
                          isActive ? "text-gold" : "text-foreground/30"
                        }`}
                      >
                        0{i + 1}
                      </span>

                      {/* Name */}
                      <span
                        className={`flex-1 font-[family-name:var(--font-display)] font-bold uppercase tracking-tight transition text-xl sm:text-2xl ${
                          isActive ? "text-foreground" : "text-foreground/35"
                        }`}
                      >
                        {l.name}
                      </span>

                      {/* Indicator */}
                      <span
                        className={`shrink-0 h-2.5 w-2.5 rounded-full transition ${
                          isActive
                            ? "bg-pitch shadow-[0_0_18px_2px_rgba(26,138,62,0.55)]"
                            : "bg-foreground/15"
                        }`}
                      />
                    </button>

                    {/* Auto-cycle progress bar */}
                    {isActive && (
                      <div className="absolute left-0 right-0 -bottom-px h-px overflow-hidden">
                        <div
                          key={`prog-${active}-${paused}`}
                          className="h-full bg-pitch origin-left"
                          style={{
                            animation: paused
                              ? "none"
                              : `loungeProgress ${CYCLE_MS}ms linear forwards`,
                          }}
                        />
                      </div>
                    )}
                  </li>
                );
              })}

              {/* Hint */}
              <div className="mt-6 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/35">
                <Sparkles className={`h-3 w-3 ${paused ? "text-foreground/30" : "text-pitch"}`} />
                <span>{paused ? "Hover to browse" : "Auto-cycling · hover to pause"}</span>
              </div>
            </ol>

            {/* RIGHT: Active lounge spotlight */}
            <article
              className="lg:col-span-8 relative overflow-hidden rounded-3xl border border-foreground/10 bg-surface/40"
            >
              <Crossfade contentKey={lounge.id} duration={650} y={10}>
              <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1fr] min-h-[480px]">
                {/* Image side */}
                <div className="relative min-h-[320px] sm:min-h-[420px] xl:min-h-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lounge.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-[1200ms] scale-105 hover:scale-110"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(120deg,transparent_50%,rgba(5,10,15,0.45)_100%)]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle_at_20%_85%,rgba(212,168,67,0.22)_0%,transparent_55%)]"
                  />

                  {/* Top labels */}
                  <div className="absolute top-5 left-5 right-5 flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/15 backdrop-blur-sm px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                      Lounge {String(active + 1).padStart(2, "0")}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/70 text-right">
                      FIFA World Cup 2026&trade;
                    </span>
                  </div>

                  {/* Bottom seat tag */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/60 mb-1">
                      Seating
                    </div>
                    <div className="font-[family-name:var(--font-display)] font-bold uppercase tracking-tight text-foreground text-lg sm:text-xl">
                      {lounge.seating}
                    </div>
                  </div>
                </div>

                {/* Content side */}
                <div className="relative p-7 sm:p-9 flex flex-col">
                  <div>
                    <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-gold mb-3">
                      Now featured
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-foreground text-3xl sm:text-4xl xl:text-[44px]">
                      {lounge.name}
                    </h3>
                    <div className="mt-3 font-[family-name:var(--font-serif)] italic text-foreground/70 text-sm sm:text-base leading-snug">
                      {lounge.seatingDetail}
                    </div>
                  </div>

                  <p className="mt-6 text-foreground/80 text-sm sm:text-base leading-relaxed flex-1 max-w-prose">
                    {lounge.copy}
                  </p>

                  {/* Features — cycle through accent / gold / pitch */}
                  <ul className="mt-7 grid grid-cols-1 gap-px border border-foreground/10 rounded-2xl overflow-hidden bg-foreground/5">
                    {lounge.features.map((f, i) => {
                      const num = ["text-accent", "text-gold", "text-pitch"][i % 3];
                      return (
                        <li
                          key={`${lounge.id}-feat-${i}`}
                          className="flex items-center gap-4 bg-background/60 px-4 sm:px-5 py-3"
                        >
                          <span className={`font-[family-name:var(--font-mono)] text-[10px] tabular-nums tracking-[0.3em] shrink-0 ${num}`}>
                            F.0{i + 1}
                          </span>
                          <span className="font-[family-name:var(--font-display)] uppercase font-semibold tracking-tight text-foreground text-sm sm:text-base leading-tight">
                            {f}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              </Crossfade>
            </article>
          </div>

          {/* Bottom marquee */}
          <div className="mt-16 sm:mt-20 border-t border-b border-foreground/10 py-5 overflow-hidden">
            <div className="flex gap-12 whitespace-nowrap animate-[loungeMarquee_45s_linear_infinite] font-[family-name:var(--font-display)] font-bold uppercase tracking-tight text-foreground/15 text-3xl sm:text-4xl">
              {Array.from({ length: 2 }).map((_, k) => (
                <div key={k} className="flex gap-12 shrink-0">
                  {LOUNGES.map((l) => (
                    <span key={`${l.id}-${k}`} className="flex items-center gap-12">
                      <span>{l.name}</span>
                      <span className="text-pitch">&bull;</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <p className="font-[family-name:var(--font-serif)] italic text-foreground/55 text-sm sm:text-base max-w-xl">
              Each lounge is paired with curated culinary, beverage, and service
              programs designed venue by venue.
            </p>
            <a
              href="https://fifaworldcup26.hospitality.fifa.com/us/en/choose-matches?src=home_lounges_explore"
              target="_blank"
              rel="noopener noreferrer"
              className="group/cta inline-flex items-center gap-3 rounded-full border border-foreground/25 px-5 py-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-foreground transition hover:border-pitch hover:text-pitch"
            >
              <span>Explore venue lounges</span>
              <ArrowUpRight className="h-4 w-4 transition group-hover/cta:rotate-45" />
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loungeProgress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        @keyframes loungeFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes loungeMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
