"use client";

import { useState } from "react";
import { Plus, Minus, Trophy, Sparkles, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import { BallRoute } from "./FootballMotifs";

const WHY = {
  title: "Why choose On Location?",
  copy:
    "As the official hospitality provider of world-renowned events like the Olympic Games and Super Bowl, On Location has redefined the live event experience across sports, music, fashion, and beyond. On Location believes fandom shouldn\u2019t be limited to just watching an event; as a result, it creates extraordinary experiences for memories that last a lifetime.",
  stat: { value: "2", suffix: "M", label: "Global Guests Hosted Annually" },
  receipts: [
    "Olympic Games",
    "Super Bowl",
    "FIFA World Cup",
    "Ryder Cup",
    "NCAA Final Four",
  ],
  photo:
    "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/68d67ace3a6c8af1a0962d9e_Frame%201321317561.webp",
};

const FAQS = [
  {
    q: "How is hospitality different from a general ticket?",
    a: "FIFA World Cup 26\u2122 hospitality packages are ticket-inclusive offerings and series that provide premium seating, exclusive entertainment, and upscale food and beverages, with service levels ranging from private suites to shared lounges \u2013 and other festive product options within the stadium\u2019s secure perimeter \u2013 along with a variety of additional one-of-a-kind experiences. These packages provide an elevated experience beyond standard event offerings.",
  },
  {
    q: "Can I buy hospitality packages from other companies?",
    a: "On Location is the only Official Hospitality Provider of the FIFA World Cup 26. Ticket-inclusive hospitality packages will be sold exclusively by On Location and its Officially Appointed Sales Agents. Fans are urged to purchase hospitality packages through FIFA.com/hospitality. Hospitality packages and tickets sourced from unofficial sales channels may not be valid. We strongly advise against purchasing packages from unauthorized platforms or sellers.",
  },
  {
    q: "Why are there separate FIFA Hospitality Digital Checkout Stores for each of the three host nations (Canada, Mexico, and the U.S.)?",
    a: "Due to regulations related to processing transactions in the local currency of each host nation, there are three separate ticket shops which each feature their local currency: Canadian Dollars (CAD), Mexican Pesos (MXN), and U.S. Dollars (USD).",
  },
  {
    q: "What do I need to know re: purchasing packages in different host nations?",
    a: "Purchases need to be made in each host nation\u2019s currency (in their related digital checkout store): Match packages in Canada must be paid for in CAD in the Canadian Digital Checkout Store. Match packages in Mexico must be paid for in MXN in the Mexican Digital Checkout Store. Match packages in the U.S. must be paid for in USD in the U.S. Digital Checkout Store. Separate purchases are required for match packages in different host nations.",
  },
  {
    q: "Is it possible for different purchasers \u2013 those who have purchased packages using separate accounts \u2013 to sit together at a match?",
    a: "While not guaranteed, seating requests for separate bookings will be considered on a best-efforts basis and are strictly subject to availability and operational constraints. Please note that exact seating locations are not guaranteed.",
  },
];

export default function WhyChoose() {
  return (
    <section
      id="why"
      className="relative isolate scroll-mt-24 overflow-hidden bg-background font-[family-name:var(--font-display)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -left-40 h-[520px] w-[520px] rounded-full opacity-[0.16]"
        style={{ background: "radial-gradient(closest-side, #d4a843 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-0 h-[520px] w-[60vw] rounded-full opacity-[0.14]"
        style={{ background: "radial-gradient(closest-side, #00c8ff 0%, transparent 70%)" }}
      />
      <BallRoute
        className="bottom-10 right-[4%] hidden h-20 w-[420px] rotate-2 opacity-30 lg:block"
        tone="gold"
      />

      <div className="relative z-[1] px-6 sm:px-10 md:px-20 pt-20 sm:pt-28 pb-24 sm:pb-32">
        <div className="w-full max-w-[1600px] mx-auto">
          <WhyOnLocation />

          <div className="my-20 sm:my-28 flex items-center gap-6">
            <span className="block h-px flex-1 bg-foreground/15" />
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.5em] text-foreground/40">
              Curiosities &amp; questions
            </span>
            <span className="block h-px flex-1 bg-foreground/15" />
          </div>

          <FAQBlock />
        </div>
      </div>
    </section>
  );
}

function WhyOnLocation() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-14 items-center">
      <Reveal as="div" y={24} duration={800} className="xl:col-span-6 relative">
        <WhyWaveImage />

        <div className="hidden xl:flex absolute -bottom-5 -left-5 items-center gap-2 rounded-full border border-foreground/15 bg-background px-4 py-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/60">
          <Sparkles className="h-3 w-3 text-pitch" />
          Official hospitality provider
        </div>
      </Reveal>

      <Reveal as="div" y={24} duration={800} delay={120} className="xl:col-span-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="block h-px w-10 bg-gold" />
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-gold">
            &sect;06 &mdash; The provider
          </span>
        </div>

        <h2 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-foreground text-[12vw] sm:text-[8vw] md:text-[6vw] xl:text-[100px]">
          Why On{" "}
          <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight text-gold">
            Location?
          </span>
        </h2>

        <p className="mt-7 text-foreground/75 text-base sm:text-lg leading-relaxed max-w-xl">
          {WHY.copy}
        </p>

        <ul className="mt-10 grid grid-cols-3 gap-px border border-foreground/10 rounded-2xl overflow-hidden bg-foreground/5">
          {[
            { k: "30+", v: "Years on the field", c: "text-accent" },
            { k: "16", v: "Host venues '26", c: "text-pitch" },
            { k: "104", v: "Matches covered", c: "text-gold" },
          ].map((kpi) => (
            <li key={kpi.k} className="bg-background/60 px-4 sm:px-5 py-4 flex flex-col gap-1">
              <span
                className={`font-[family-name:var(--font-display)] font-bold tabular-nums tracking-tight text-2xl sm:text-3xl ${kpi.c}`}
              >
                {kpi.k}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/55">
                {kpi.v}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

function WhyWaveImage() {
  return (
    <div className="relative mx-auto max-w-[760px] xl:max-w-none">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-foreground/10 bg-background shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={WHY.photo}
          alt="FIFA World Cup match action framed by an abstract wave graphic"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <svg
          viewBox="0 0 965 830"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <mask id="why-wave-window">
              <rect width="965" height="830" fill="white" />
              <path
                d="M207 668V407C207 267 320 154 461 154H720C720 296 608 410 466 410H720V668H207Z"
                fill="black"
              />
            </mask>
            <linearGradient id="why-wave-sheen" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#f0f4f8" stopOpacity="0.18" />
              <stop offset="42%" stopColor="#f0f4f8" stopOpacity="0" />
              <stop offset="100%" stopColor="#050a0f" stopOpacity="0.16" />
            </linearGradient>
          </defs>

          <g mask="url(#why-wave-window)">
            <rect width="965" height="830" fill="#0d1520" />
            <path
              d="M0 0H228C247 88 311 140 462 154C318 154 207 267 207 407V668H0V0Z"
              fill="#1a8a3e"
            />
            <path
              d="M228 0H520C641 40 704 96 720 154H462C339 154 258 102 228 0Z"
              fill="#050a0f"
            />
            <rect x="720" y="0" width="245" height="154" fill="#00c8ff" opacity="0.88" />
            <path
              d="M720 154H965V830H515C645 804 734 690 734 548V410H720V154Z"
              fill="#d4a843"
            />
            <rect x="0" y="668" width="207" height="162" fill="#00c8ff" opacity="0.62" />
            <path
              d="M207 668H469C586 668 690 742 721 830H207V668Z"
              fill="#050a0f"
              opacity="0.96"
            />
            <path
              d="M0 668H207C207 742 232 796 284 830H0V668Z"
              fill="#d4a843"
              opacity="0.72"
            />
            <rect width="965" height="830" fill="url(#why-wave-sheen)" />
          </g>
        </svg>
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_68%,rgba(5,10,15,0.22)_100%)]"
        />


        <div className="absolute right-4 top-4 sm:right-7 sm:top-7 max-w-[240px] rounded-2xl border border-foreground/15 bg-background/92 backdrop-blur-md p-4 sm:p-6 shadow-[0_18px_45px_rgba(0,0,0,0.42)]">
          <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-gold mb-2">
            <Trophy className="h-3.5 w-3.5" />
            Hosted globally
          </div>
          <div className="font-[family-name:var(--font-display)] font-bold tabular-nums leading-none tracking-tight text-foreground text-5xl sm:text-7xl">
            {WHY.stat.value}
            <span className="text-gold">{WHY.stat.suffix}</span>
          </div>
          <div className="mt-3 font-[family-name:var(--font-serif)] italic text-foreground/85 text-sm leading-snug">
            {WHY.stat.label}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-7">
          <div className="rounded-2xl border border-foreground/15 bg-background/88 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.42)] backdrop-blur-md sm:px-5 sm:py-4">
            <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-accent mb-2">
              Track record
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-[family-name:var(--font-display)] font-bold uppercase tracking-tight text-foreground text-sm sm:text-base">
              {WHY.receipts.map((r, i) => (
                <span key={r} className="flex items-center gap-3">
                  <span>{r}</span>
                  {i < WHY.receipts.length - 1 && <span className="text-accent">&bull;</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQBlock() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div id="faq" className="grid scroll-mt-28 grid-cols-1 gap-10 xl:grid-cols-[minmax(320px,0.78fr)_minmax(0,1.22fr)] xl:gap-12 2xl:gap-14">
      <Reveal as="aside" y={20} duration={750} className="xl:sticky xl:top-28 self-start">
        <div className="flex items-center gap-3 mb-5">
          <span className="block h-px w-10 bg-accent" />
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-accent">
            &sect;07 &mdash; FAQ
          </span>
        </div>

        <h3 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-foreground text-5xl sm:text-6xl xl:text-[58px] 2xl:text-[76px]">
          Frequently{" "}
          <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight text-accent">
            asked.
          </span>
        </h3>

        <p className="mt-6 font-[family-name:var(--font-serif)] italic text-foreground/70 text-base sm:text-lg leading-snug max-w-md">
          Short answers to the most common questions about FIFA World Cup
          2026&trade; hospitality.
        </p>

        <a
          href="https://fifaworldcup26.hospitality.fifa.com/en/faq"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-foreground border-b border-foreground/30 pb-1 transition hover:border-accent hover:text-accent"
        >
          <span>See all FAQs</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:rotate-45" />
        </a>
      </Reveal>

      <ol>
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          const accent = ["text-accent", "text-gold", "text-pitch"][i % 3] ?? "text-accent";
          return (
            <Reveal as="li" key={f.q} y={14} duration={600} delay={i * 70}
              className={`block border-t border-foreground/10 ${
                i === FAQS.length - 1 ? "border-b" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full text-left flex items-start gap-5 sm:gap-7 py-6 sm:py-7 group"
              >
                <span
                  className={`shrink-0 font-[family-name:var(--font-mono)] text-[10px] tabular-nums tracking-[0.3em] mt-1 ${accent}`}
                >
                  Q.0{i + 1}
                </span>
                <span
                  className={`flex-1 font-[family-name:var(--font-display)] uppercase font-bold tracking-tight text-foreground text-base sm:text-lg xl:text-xl 2xl:text-2xl leading-tight transition ${
                    isOpen ? "" : "group-hover:translate-x-1"
                  }`}
                >
                  {f.q}
                </span>
                <span
                  className={`shrink-0 mt-0.5 inline-flex items-center justify-center h-9 w-9 rounded-full border transition ${
                    isOpen
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/25 text-foreground group-hover:border-foreground"
                  }`}
                >
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>

              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOpen ? "grid-rows-[1fr] opacity-100 pb-7 sm:pb-8" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pl-12 sm:pl-16 max-w-3xl">
                    <p className="font-[family-name:var(--font-serif)] italic text-foreground/80 text-base sm:text-lg leading-relaxed">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}
