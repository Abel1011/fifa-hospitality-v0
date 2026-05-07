"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Ticket,
} from "lucide-react";
import Header from "@/components/fifa/Header";
import Footer from "@/components/fifa/Footer";
import Reveal from "@/components/fifa/Reveal";
import { PitchBlueprint, BallRoute } from "@/components/fifa/FootballMotifs";

import PrivateSuitesModal from "@/components/fifa/PrivateSuitesModal";
import venuesData from "@content/venues-and-matches.json";
import matchData from "@content/hospitality-pricing-usd.json";
import venuePages from "@content/venue-pages.json";

type VenuePage = (typeof venuePages.venues)[number];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function cityToSlug(city: string): string {
  return city
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const teamCodeMap: Record<string, string> = {
  spain: "ESP", netherlands: "NED", morocco: "MAR", japan: "JPN",
  "saudi-arabia": "KSA", "south-africa": "RSA", "new-zealand": "NZL",
  austria: "AUT", curacao: "CUW", iraq: "IRQ", switzerland: "SUI",
  canada: "CAN", mexico: "MEX", "united-states": "USA", "costa-rica": "CRC",
  "korea-republic": "KOR", iran: "IRN", "ir-iran": "IRN", australia: "AUS",
  croatia: "CRO", serbia: "SRB", denmark: "DEN", nigeria: "NGA",
  cameroon: "CMR", "ivory-coast": "CIV", "cote-divoire": "CIV",
  ghana: "GHA", senegal: "SEN", mali: "MLI", "burkina-faso": "BFA",
  egypt: "EGY", tunisia: "TUN", algeria: "ALG", wales: "WAL",
  scotland: "SCO", "northern-ireland": "NIR", "republic-of-ireland": "IRL",
  iceland: "ISL", norway: "NOR", sweden: "SWE", finland: "FIN",
  "czech-republic": "CZE", czechia: "CZE", slovakia: "SVK",
  hungary: "HUN", poland: "POL", ukraine: "UKR", romania: "ROU",
  bulgaria: "BUL", greece: "GRE", turkey: "TUR", turkiye: "TUR",
  russia: "RUS", "bosnia-and-herzegovina": "BIH", slovenia: "SVN",
  albania: "ALB", "north-macedonia": "MKD", montenegro: "MNE",
  "trinidad-and-tobago": "TRI", jamaica: "JAM", honduras: "HON",
  "el-salvador": "SLV", panama: "PAN", colombia: "COL", chile: "CHI",
  peru: "PER", venezuela: "VEN", bolivia: "BOL", ecuador: "ECU",
  paraguay: "PAR", uruguay: "URU", qatar: "QAT", belgium: "BEL",
  "cape-verde-islands": "CPV", "dr-congo": "COD", haiti: "HAI",
  jordan: "JOR", uzbekistan: "UZB", brazil: "BRA", france: "FRA",
  germany: "GER", england: "ENG", portugal: "POR", argentina: "ARG",
  "ee-uu-": "USA",
};

function getFlagUrl(teamName: string): string {
  const slug = cityToSlug(teamName);
  const code = teamCodeMap[slug] || teamName.slice(0, 3).toUpperCase();
  return `https://api.fifa.com/api/v3/picture/flags-sq-3/${code}`;
}

// Country to flag for venue countries
function getCountryFlag(country: string): string {
  const map: Record<string, string> = { USA: "USA", Mexico: "MEX", Canada: "CAN" };
  return `https://api.fifa.com/api/v3/picture/flags-sq-3/${map[country] || "USA"}`;
}

export default function VenueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const venue = venuesData.venues.find((v) => cityToSlug(v.city) === slug);
  const page: VenuePage | undefined = venuePages.venues.find(
    (p) => p.slug === slug
  );

  if (!venue) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 text-center px-4">
          <MapPin className="h-16 w-16 text-foreground/20 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Venue Not Found
          </h1>
          <p className="text-foreground/50 mb-6">
            The venue &ldquo;{slug}&rdquo; doesn&apos;t exist in our records.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // Find venue code by matching stadium name from singleMatch data
  const venueCode = matchData.singleMatch.find(
    (sm) =>
      sm.venue.stadium.toLowerCase().replace(/[^a-z]/g, "") ===
      venue.stadium.toLowerCase().replace(/[^a-z]/g, "")
  )?.venue.code;

  const venueSeries = venueCode
    ? matchData.venueSeries.find((vs) => vs.venueCode === venueCode)
    : null;

  const teamsPlaying = Array.from(
    new Set(
      venue.matches
        .flatMap((m) => m.teams.split(" vs "))
        .filter((t) => t !== "TBD")
    )
  ).sort();

  const heroDescription =
    page?.hero?.description || venue.description || "";
  const heroTitle = page?.hero?.title || venue.city;
  const heroEyebrow =
    page?.hero?.eyebrow || "YOUR JOURNEY TO FIFA WORLD CUP 2026™ STARTS HERE";
  const heroVideoUrl = page?.hero?.videoUrl || "";
  const heroImageUrl = page?.hero?.imageUrl || "";
  const singleMatchImageUrl = page?.singleMatches?.imageUrl || "";

  // Reference pricing based on stage (derived from US average prices)
  function getReferencePrice(stage: string): number {
    if (stage.includes("Final") && !stage.includes("Quarter") && !stage.includes("Semi")) return 8500;
    if (stage.includes("Semi")) return 6200;
    if (stage.includes("Quarter")) return 4800;
    if (stage.includes("Round of 16") || stage.includes("R16")) return 3500;
    return 2200; // Group stage
  }

  // Bundle slug derived from venueSeries productCode
  const bundleSlug = venueSeries?.productCode?.replace("_VS", "").toLowerCase() || null;

  // Private Suites modal state
  const [showSuitesModal, setShowSuitesModal] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* ─── HERO ─── */}
      <section className="relative pt-20 overflow-hidden">
        {/* Background video/image */}
        <div className="absolute inset-0 z-0">
          {heroVideoUrl ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={heroVideoUrl} type="video/mp4" />
            </video>
          ) : heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt={heroTitle}
              fill
              className="object-cover"
              priority
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="relative z-[1] px-4 sm:px-6 md:px-10 max-w-[1200px] mx-auto pt-20 pb-16 sm:pt-28 sm:pb-24">
          <Link
            href="/#cities"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-accent transition mb-10"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Venues
          </Link>

          <Reveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="block h-px w-10 bg-accent" />
              <p className="font-[family-name:var(--font-mono)] text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-accent">
                {heroEyebrow}
              </p>
            </div>
            <h1 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.03em] text-foreground text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              {heroTitle}
            </h1>
          </Reveal>

          {heroDescription && (
            <Reveal delay={100}>
              <p className="font-[family-name:var(--font-serif)] italic text-foreground/80 text-lg sm:text-xl leading-snug max-w-2xl mt-6">
                {heroDescription}
              </p>
            </Reveal>
          )}

          {/* Hero CTAs */}
          <Reveal delay={150}>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link
                href="/matches"
                className="group relative flex items-center gap-3 rounded-full bg-gold px-5 py-3 text-background transition hover:bg-gold/90"
              >
                <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.25em]">
                  {venue.city} Matches
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground transition group-hover:rotate-45">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              {venueSeries && (
                <Link
                  href={`/bundles/${venueSeries.productCode.replace("_VS", "").toLowerCase()}`}
                  className="group flex items-center gap-2 rounded-full border border-foreground/30 px-4 py-2.5 text-foreground/85 hover:border-gold hover:text-gold transition"
                >
                  <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.25em]">
                    Venue Series
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:rotate-45" />
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── VENUE STATS (editorial row like landing hero) ─── */}
      <section className="px-6 sm:px-10 md:px-20 max-w-[1600px] mx-auto pt-12 pb-6 relative z-10">
        <Reveal>
          <div className="flex flex-wrap items-end gap-6 sm:gap-10 border-t border-foreground/10 pt-6">
            {[
              { v: String(venue.matches.length), l: "Matches" },
              { v: String(teamsPlaying.length), l: "Teams" },
              { v: venue.country, l: "Host Nation" },
              ...(venueSeries
                ? [{ v: formatPrice(venueSeries.usdStartingPrice), l: "Series From" }]
                : []),
            ].map((stat) => (
              <div key={stat.l} className="flex flex-col leading-none">
                <span className="font-[family-name:var(--font-display)] tabular-nums text-3xl sm:text-4xl font-bold text-foreground">
                  {stat.v}
                </span>
                <span className="mt-1.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/45">
                  {stat.l}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ─── MATCH SCHEDULE + OFFERINGS ─── */}
      <section className="relative isolate overflow-hidden px-6 sm:px-10 md:px-20 pt-16 pb-20 sm:pt-20 sm:pb-28">
        {/* Background texture */}
        <PitchBlueprint
          className="opacity-[0.04] [mask-image:linear-gradient(180deg,transparent_0%,#000_20%,#000_80%,transparent_100%)]"
          tone="accent"
        />
        {/* Subtle glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-0 h-[400px] w-[50vw] rounded-full blur-[140px] opacity-[0.12]"
          style={{ background: "radial-gradient(closest-side, #00c8ff 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[40vw] rounded-full blur-[120px] opacity-[0.08]"
          style={{ background: "radial-gradient(closest-side, #d4a843 0%, transparent 70%)" }}
        />

        <div className="w-full max-w-[1600px] mx-auto">
          {/* Section header */}
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-end mb-12 md:mb-16">
              <div className="md:col-span-7">
                <div className="flex items-center gap-3 mb-5">
                  <span className="block h-px w-10 bg-accent" />
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-accent">
                    Schedule &amp; Offerings
                  </span>
                </div>
                <h2 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.03em] text-foreground text-3xl sm:text-4xl md:text-5xl">
                  {page?.singleMatches?.title || "Your Matches"}
                </h2>
                {page?.singleMatches?.copy && (
                  <p className="mt-4 font-[family-name:var(--font-serif)] italic text-foreground/75 text-base sm:text-lg leading-snug max-w-lg">
                    {page.singleMatches.copy}
                  </p>
                )}
              </div>

              {/* Two offering options as editorial cards */}
              <div className="md:col-span-5 grid grid-cols-2 gap-3">
                <a
                  href="#match-list"
                  className="group relative flex flex-col gap-3 border border-foreground/15 rounded-2xl p-4 hover:border-accent/50 transition"
                >
                  <span className="absolute -top-px left-4 h-px w-8 bg-accent" />
                  <span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums uppercase tracking-[0.3em] text-accent">
                    01
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-foreground/85 text-sm font-semibold leading-tight">
                    Single Match
                  </span>
                  <span className="text-[11px] text-foreground/45">Pick any game</span>
                </a>
                {(venueSeries || page?.venueSeries) ? (
                  <Link
                    href={venueSeries ? `/bundles/${venueSeries.productCode.replace("_VS", "").toLowerCase()}` : "#venue-series"}
                    className="group relative flex flex-col gap-3 border border-foreground/15 rounded-2xl p-4 hover:border-gold/50 transition"
                  >
                    <span className="absolute -top-px left-4 h-px w-8 bg-gold" />
                    <span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums uppercase tracking-[0.3em] text-gold">
                      02
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-foreground/85 text-sm font-semibold leading-tight">
                      Venue Series
                    </span>
                    <span className="text-[11px] text-foreground/45">All matches here</span>
                  </Link>
                ) : (
                  <div className="relative flex flex-col gap-3 border border-foreground/10 rounded-2xl p-4 opacity-50">
                    <span className="absolute -top-px left-4 h-px w-8 bg-foreground/20" />
                    <span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums uppercase tracking-[0.3em] text-foreground/40">
                      02
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-foreground/50 text-sm font-semibold leading-tight">
                      Venue Series
                    </span>
                    <span className="text-[11px] text-foreground/30">Coming soon</span>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          {/* Match grid — compact, editorial rows */}
          <div id="match-list" className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-24">
            <div className="lg:col-span-8">
              <div className="space-y-2">
                {venue.matches.map((m, i) => {
                  const pricingMatch = matchData.singleMatch.find(
                    (pm) =>
                      pm.date === m.date &&
                      (pm.venue.city
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .includes(venue.city.toLowerCase().split(" ")[0]) ||
                        venue.city
                          .toLowerCase()
                          .includes(
                            pm.venue.city
                              .toLowerCase()
                              .normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "")
                              .split(" ")[0]
                          ))
                  );

                  const price = pricingMatch
                    ? pricingMatch.usdStartingPrice
                    : getReferencePrice(m.stage);

                  return (
                    <Reveal key={i} delay={i * 30}>
                      <Link
                        href={pricingMatch ? `/matches/${pricingMatch.matchNumber}` : "/matches"}
                        className="group w-full flex items-center gap-4 sm:gap-6 py-4 border-b border-foreground/8 hover:border-accent/30 transition text-left cursor-pointer"
                      >
                        {/* Date column */}
                        <div className="w-16 flex-shrink-0">
                          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-foreground/40">
                            {new Date(m.date + "T12:00:00").toLocaleDateString("en-US", { month: "short" })}
                          </p>
                          <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground tabular-nums">
                            {new Date(m.date + "T12:00:00").getDate()}
                          </p>
                        </div>

                        {/* Match info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-[family-name:var(--font-display)] text-sm sm:text-base font-semibold text-foreground truncate">
                            {m.teams}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-[family-name:var(--font-mono)] uppercase tracking-wider ${
                                m.stage.includes("Group")
                                  ? "bg-pitch/10 text-pitch"
                                  : "bg-gold/10 text-gold"
                              }`}
                            >
                              {m.stage}
                            </span>
                            <span className="text-[11px] text-foreground/35 font-[family-name:var(--font-mono)]">
                              {m.time}
                            </span>
                          </div>
                        </div>

                        {/* Price pill */}
                        <span className="flex items-center gap-2 rounded-full border border-foreground/15 px-3 py-1.5 text-foreground/70 group-hover:border-gold group-hover:text-gold transition flex-shrink-0">
                          <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wide">
                            {formatPrice(price)}
                          </span>
                          <Ticket className="h-3 w-3 transition group-hover:scale-110" />
                        </span>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </div>

            {/* Sidebar: city image */}
            {singleMatchImageUrl && (
              <div className="lg:col-span-4 hidden lg:block">
                <Reveal delay={200}>
                  <div className="sticky top-28 rounded-3xl overflow-hidden border border-foreground/10 aspect-[3/4]">
                    <Image
                      src={singleMatchImageUrl}
                      alt={`${venue.city} stadium`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <p className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground">
                        {venue.city}
                      </p>
                      <p className="text-xs text-foreground/50 font-[family-name:var(--font-mono)] uppercase tracking-wider">
                        {venue.country}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── VENUE SERIES (details) ─── */}
      {page?.venueSeries && (
        <section id="venue-series" className="relative isolate overflow-hidden px-6 sm:px-10 md:px-20 py-20 sm:py-28 border-t border-foreground/8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-0 h-[360px] w-[50vw] rounded-full blur-[140px] opacity-[0.12]"
            style={{ background: "radial-gradient(closest-side, #d4a843 0%, transparent 70%)" }}
          />
          <div className="w-full max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              {/* Left — copy + CTA */}
              <div className="lg:col-span-5">
                <Reveal>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="block h-px w-10 bg-gold" />
                    <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-gold">
                      Venue Series
                    </span>
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-foreground text-2xl sm:text-3xl md:text-4xl mb-5">
                    {page.venueSeries.title}
                  </h2>
                  <p className="font-[family-name:var(--font-serif)] italic text-foreground/70 text-base leading-snug max-w-md mb-6">
                    {page.venueSeries.intro}
                  </p>
                </Reveal>

                {/* Includes */}
                {page.venueSeries.seriesIncludes.length > 0 && (
                  <Reveal delay={60}>
                    <div className="mb-5">
                      <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/50 mb-3">
                        {page.venueSeries.seriesLabel}
                      </p>
                      <ul className="space-y-2">
                        {page.venueSeries.seriesIncludes.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-foreground/65 text-[13px] leading-snug"
                          >
                            <span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums text-pitch mt-0.5 w-5 shrink-0">
                              /{String(i + 1).padStart(2, "0")}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                )}

                {/* Hospitality */}
                {page.venueSeries.hospitalityIncludes.length > 0 && (
                  <Reveal delay={100}>
                    <div className="mb-8">
                      <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/50 mb-3">
                        {page.venueSeries.hospitalityLabel}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {page.venueSeries.hospitalityIncludes.map((opt, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 border border-gold/20 rounded-full text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-gold"
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                )}

                {/* CTA */}
                {bundleSlug && (
                  <Reveal delay={140}>
                    <Link
                      href={`/bundles/${bundleSlug}`}
                      className="group relative inline-flex items-center gap-3 rounded-full bg-gold px-5 py-3 text-background transition hover:bg-gold/90"
                    >
                      <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.25em]">
                        Buy Venue Series
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground transition group-hover:rotate-45">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </Reveal>
                )}
              </div>

              {/* Right — match timeline */}
              <div className="lg:col-span-7">
                <Reveal delay={80}>
                  <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/50 mb-4">
                    {page.venueSeries.matchesIncludedLabel}
                  </p>
                </Reveal>
                <div className="relative pl-6 border-l border-foreground/10">
                  {page.venueSeries.matches.map((match, i) => (
                    <Reveal key={i} delay={100 + i * 40}>
                      <div className="relative flex items-center gap-4 py-3">
                        {/* Timeline dot */}
                        <div
                          className="absolute -left-[25px] w-2.5 h-2.5 rounded-full border-2 border-background"
                          style={{ backgroundColor: match.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground truncate">
                            {match.label}
                          </p>
                          <p className="font-[family-name:var(--font-mono)] text-[11px] text-foreground/40 mt-0.5">
                            {match.date} · {match.day}
                          </p>
                        </div>
                        <div
                          className="w-3 h-3 rounded-full opacity-40 flex-shrink-0"
                          style={{ backgroundColor: match.color }}
                        />
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── PRIVATE SUITES ─── */}
      {page?.privateSuites && (
        <section className="relative isolate overflow-hidden px-6 sm:px-10 md:px-20 py-24 sm:py-32 border-t border-foreground/8">
          {/* Background effects */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-28 right-0 h-[400px] w-[40vw] rounded-full blur-[150px] opacity-[0.08]"
            style={{ background: "radial-gradient(closest-side, #00c8ff 0%, transparent 70%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-1/4 h-[250px] w-[30vw] rounded-full blur-[100px] opacity-[0.05]"
            style={{ background: "radial-gradient(closest-side, #6b21a8 0%, transparent 70%)" }}
          />

          <div className="w-full max-w-[1600px] mx-auto">
            {/* Top: full-width image with overlay content */}
            <div className="relative rounded-3xl overflow-hidden mb-10">
              {page.privateSuites.imageUrl && (
                <div className="relative aspect-[21/9] sm:aspect-[2.5/1]">
                  <Image
                    src={page.privateSuites.imageUrl}
                    alt="Private Suites"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  {/* Content over image */}
                  <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12 max-w-2xl">
                    <Reveal>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent/15 border border-accent/25">
                          <MapPin className="h-3.5 w-3.5 text-accent" />
                        </span>
                        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-accent">
                          Private Suites
                        </span>
                      </div>
                      <h2 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4">
                        The Ultimate<br />Matchday Experience
                      </h2>
                      <p className="font-[family-name:var(--font-serif)] italic text-foreground/70 text-base sm:text-lg leading-snug max-w-lg">
                        {page.privateSuites.copy}
                      </p>
                    </Reveal>
                  </div>
                </div>
              )}
              {!page.privateSuites.imageUrl && (
                <Reveal>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="block h-px w-10 bg-accent" />
                    <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-accent">
                      Private Suites
                    </span>
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-foreground text-2xl sm:text-3xl md:text-4xl mb-4">
                    {page.privateSuites.title}
                  </h2>
                  <p className="font-[family-name:var(--font-serif)] italic text-foreground/70 text-base leading-snug max-w-md">
                    {page.privateSuites.copy}
                  </p>
                </Reveal>
              )}
            </div>

            {/* Feature cards + CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Reveal delay={0}>
                <div className="relative p-5 rounded-2xl border border-foreground/8 bg-foreground/[0.02] group hover:border-accent/20 transition">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/15 mb-3">
                    <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                  </div>
                  <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground/85 mb-1">Private Group</p>
                  <p className="text-[11px] text-foreground/45 leading-snug">Exclusive space for 20–30 guests in your own luxury suite</p>
                </div>
              </Reveal>
              <Reveal delay={50}>
                <div className="relative p-5 rounded-2xl border border-foreground/8 bg-foreground/[0.02] group hover:border-accent/20 transition">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/15 mb-3">
                    <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                  </div>
                  <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground/85 mb-1">Dedicated Service</p>
                  <p className="text-[11px] text-foreground/45 leading-snug">Personal suite host, concierge, and VIP stadium entry</p>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="relative p-5 rounded-2xl border border-foreground/8 bg-foreground/[0.02] group hover:border-accent/20 transition">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/15 mb-3">
                    <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" /></svg>
                  </div>
                  <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground/85 mb-1">Premium Dining</p>
                  <p className="text-[11px] text-foreground/45 leading-snug">Gourmet catering by local chefs with open premium bar</p>
                </div>
              </Reveal>
              <Reveal delay={150}>
                <div className="relative p-5 rounded-2xl border border-foreground/8 bg-foreground/[0.02] group hover:border-accent/20 transition">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/15 mb-3">
                    <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground/85 mb-1">Premium Views</p>
                  <p className="text-[11px] text-foreground/45 leading-snug">Elevated sideline views with direct seating access</p>
                </div>
              </Reveal>
            </div>

            {/* CTA row */}
            <Reveal delay={200}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-accent/15 bg-accent/[0.03]">
                <div>
                  <p className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground mb-1">
                    Ready to elevate your World Cup?
                  </p>
                  <p className="text-[12px] text-foreground/45 font-[family-name:var(--font-mono)]">
                    Starting from $85,000 per match · 20–30 guests
                  </p>
                </div>
                <button
                  onClick={() => setShowSuitesModal(true)}
                  className="group relative inline-flex items-center gap-3 rounded-full bg-accent px-6 py-3 text-background transition hover:bg-accent/90 cursor-pointer shrink-0"
                >
                  <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.25em]">
                    Reserve a Suite
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-foreground transition group-hover:rotate-45">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ─── TEAMS PLAYING ─── */}
      {teamsPlaying.length > 0 && (
        <section className="relative isolate overflow-hidden px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto py-20 border-t border-foreground/8">
          {/* Background layers */}
          <PitchBlueprint
            className="opacity-[0.04] [mask-image:linear-gradient(180deg,transparent_0%,#000_30%,#000_70%,transparent_100%)]"
            tone="pitch"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 left-1/3 h-[400px] w-[500px] rounded-full opacity-[0.08]"
            style={{ background: "radial-gradient(closest-side, #1a8a3e 0%, transparent 70%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[40vw] rounded-full opacity-[0.06]"
            style={{ background: "radial-gradient(closest-side, #00c8ff 0%, transparent 70%)" }}
          />
          <BallRoute
            className="top-10 right-[5%] hidden h-12 w-[280px] -rotate-3 opacity-15 lg:block"
            tone="pitch"
          />

          <Reveal>
            <div className="flex items-center gap-3 mb-3">
              <span className="block h-px w-10 bg-pitch" />
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-pitch">
                §04 — Featured Teams
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.03em] text-foreground text-3xl sm:text-4xl md:text-5xl mb-3">
              Teams Playing in{" "}
              <span className="font-[family-name:var(--font-serif)] italic normal-case text-pitch">
                {venue.city}
              </span>
            </h2>
            <p className="font-[family-name:var(--font-serif)] italic text-foreground/60 text-base sm:text-lg max-w-lg mb-10">
              {teamsPlaying.length} nations will compete at this venue during the tournament
            </p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {teamsPlaying.map((team, i) => (
              <Reveal key={team} delay={i * 40}>
                <Link
                  href={`/teams/${cityToSlug(team)}`}
                  className="group relative flex items-center gap-3 p-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] backdrop-blur-sm hover:border-pitch/40 hover:bg-pitch/[0.04] transition-all duration-300"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at center, rgba(26,138,62,0.06) 0%, transparent 70%)" }}
                  />
                  {/* Flag */}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-foreground/10 group-hover:border-pitch/30 transition shrink-0">
                    <Image
                      src={getFlagUrl(team)}
                      alt={team}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground/90 group-hover:text-foreground truncate transition">
                      {team}
                    </p>
                    <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider text-foreground/35 group-hover:text-pitch/70 transition">
                      View Profile →
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ─── BROWSE OTHER VENUES ─── */}
      {page?.otherVenues && page.otherVenues.items.length > 0 && (
        <section className="relative isolate overflow-hidden px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto py-20 border-t border-foreground/8">
          {/* Background layers */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 right-10 h-[500px] w-[500px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(closest-side, #d4a843 0%, transparent 70%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-10 -left-20 h-[400px] w-[400px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(closest-side, #00c8ff 0%, transparent 70%)" }}
          />
          <BallRoute
            className="bottom-20 left-[3%] hidden h-14 w-[320px] rotate-2 opacity-15 lg:block"
            tone="gold"
          />

          <Reveal>
            <div className="flex items-center gap-3 mb-3">
              <span className="block h-px w-10 bg-gold" />
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-gold">
                §05 — Explore
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.03em] text-foreground text-3xl sm:text-4xl md:text-5xl mb-3">
              Browse Other{" "}
              <span className="font-[family-name:var(--font-serif)] italic normal-case text-gold">
                Venues
              </span>
            </h2>
            <p className="font-[family-name:var(--font-serif)] italic text-foreground/60 text-base sm:text-lg max-w-lg mb-10">
              16 world-class stadiums across 3 nations — find your next destination
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {page.otherVenues.items
              .filter((v) => v.href !== `/venues/${slug}`)
              .map((v, i) => {
                const venueSlug = v.href.replace("/venues/", "");
                const otherVenue = venuesData.venues.find(
                  (ven) => cityToSlug(ven.city) === venueSlug
                );
                return (
                  <Reveal key={venueSlug} delay={i * 40}>
                    <Link
                      href={`/venues/${venueSlug}`}
                      className="group relative flex flex-col h-full rounded-2xl border border-foreground/10 bg-surface/30 overflow-hidden transition-all duration-500 hover:border-foreground/25 hover:shadow-[0_0_60px_-12px_rgba(212,168,67,0.15)]"
                    >
                      {/* Top accent hairline */}
                      <span className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

                      <div className="p-5 sm:p-6 flex flex-col gap-4">
                        {/* Country flag + city name */}
                        <div className="flex items-center gap-4">
                          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-foreground/10 group-hover:border-gold/30 transition-all duration-500 group-hover:scale-105 shrink-0">
                            {otherVenue ? (
                              <Image
                                src={getCountryFlag(otherVenue.country)}
                                alt={otherVenue.country}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-surface">
                                <MapPin className="h-4 w-4 text-foreground/30" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-[family-name:var(--font-display)] text-base font-bold text-foreground group-hover:text-gold transition truncate">
                              {v.name}
                            </p>
                            {otherVenue && (
                              <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-foreground/40 mt-0.5">
                                {otherVenue.country}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Stats row */}
                        {otherVenue && (
                          <div className="flex items-center gap-4 pt-3 border-t border-foreground/5">
                            <div className="flex flex-col">
                              <span className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground tabular-nums">
                                {otherVenue.matches.length}
                              </span>
                              <span className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.25em] text-foreground/35">
                                Matches
                              </span>
                            </div>
                            <div className="w-px h-8 bg-foreground/8" />
                            <div className="flex flex-col">
                              <span className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground tabular-nums">
                                {Array.from(new Set(otherVenue.matches.flatMap(m => m.teams.split(" vs ")).filter(t => t !== "TBD"))).length}
                              </span>
                              <span className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.25em] text-foreground/35">
                                Teams
                              </span>
                            </div>
                            <div className="ml-auto">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 group-hover:border-gold/40 group-hover:bg-gold/10 transition">
                                <ArrowUpRight className="h-3.5 w-3.5 text-foreground/30 group-hover:text-gold transition group-hover:rotate-45" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
          </div>
        </section>
      )}

      <Footer />



      {/* Private Suites Modal */}
      <PrivateSuitesModal
        suite={showSuitesModal ? {
          venueName: venue.city,
          title: page?.privateSuites?.title || "Private Suites",
          copy: page?.privateSuites?.copy || "",
          imageUrl: page?.privateSuites?.imageUrl,
        } : null}
        onClose={() => setShowSuitesModal(false)}
      />
    </main>
  );
}
