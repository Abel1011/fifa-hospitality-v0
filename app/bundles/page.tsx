"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Users, Calendar, ArrowRight, Trophy, Sparkles, Star, Globe, Flame } from "lucide-react";
import Header from "@/components/fifa/Header";
import Footer from "@/components/fifa/Footer";
import Reveal from "@/components/fifa/Reveal";
import { PitchBlueprint, BallRoute } from "@/components/fifa/FootballMotifs";
import matchData from "@content/hospitality-pricing-usd.json";
import teamsData from "@content/teams.json";

type VenueSeries = (typeof matchData.venueSeries)[number];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

const BUNDLE_TYPES = [
  { id: "venue-series", label: "Venue Series", icon: MapPin },
  { id: "follow-team", label: "Follow My Team", icon: Users },
] as const;

type BundleType = (typeof BUNDLE_TYPES)[number]["id"];

export default function BundlesPage() {
  const [activeTab, setActiveTab] = useState<BundleType>("venue-series");

  useEffect(() => {
    const view = new URLSearchParams(window.location.search).get("view");
    setActiveTab(view === "follow-team" ? "follow-team" : "venue-series");
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative isolate pt-24 sm:pt-32 pb-12 overflow-hidden">
        {/* Landing-style multi-layer background */}
        <PitchBlueprint
          className="opacity-[0.06] [mask-image:linear-gradient(160deg,transparent_0%,#000_30%,#000_70%,transparent_100%)]"
          tone="gold"
        />

        {/* Primary gold glow — top */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[90vw] h-[450px] rounded-full opacity-[0.14]"
          style={{
            background:
              "radial-gradient(closest-side, #d4a843 0%, transparent 70%)",
          }}
        />

        {/* Secondary cyan glow — bottom right */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-40 -right-20 w-[50vw] h-[400px] rounded-full opacity-[0.08]"
          style={{
            background:
              "radial-gradient(closest-side, #00c8ff 0%, transparent 70%)",
          }}
        />

        {/* Pitch green glow — bottom left */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 -left-20 w-[40vw] h-[300px] rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(closest-side, #1a8a3e 0%, transparent 70%)",
          }}
        />

        {/* Ball route animation */}
        <BallRoute
          className="top-16 right-[6%] hidden h-16 w-[360px] -rotate-3 opacity-25 lg:block"
          tone="gold"
        />

        {/* Top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-foreground/5" />

        <div className="relative z-[1] px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="block h-px w-10 bg-gold" />
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-gold">
                &sect;02 &mdash; Bundles
              </span>
            </div>
            <h1 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.02em] text-foreground text-[10vw] sm:text-[7vw] md:text-[5vw] xl:text-[72px]">
              Maximize Your{" "}
              <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight text-gold">
                World Cup.
              </span>
            </h1>
            <p className="mt-6 font-[family-name:var(--font-serif)] italic text-foreground/60 text-base sm:text-lg leading-snug max-w-lg">
              Lock in multiple matches with a single bundle. Choose a venue or
              follow your national team across all group stage matches.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Tab selector */}
      <section className="relative z-[2] px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto pb-8">
        <div className="flex gap-2 p-1 bg-surface border border-border rounded-xl w-fit">
          {BUNDLE_TYPES.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gold/15 text-gold border border-gold/30"
                    : "text-foreground/50 hover:text-foreground/80"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Content */}
      {activeTab === "venue-series" ? (
        <VenueSeriesGrid />
      ) : (
        <FollowMyTeamGrid />
      )}

      <Footer />
    </main>
  );
}

/* ─────────────────────────────── Venue Series ──────────────────────── */
function VenueSeriesGrid() {
  const venues = matchData.venueSeries.sort(
    (a, b) => a.usdStartingPrice - b.usdStartingPrice
  );

  return (
    <section className="px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {venues.map((vs, i) => (
          <Reveal key={vs.productCode} delay={i * 50}>
            <VenueSeriesCard venue={vs} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function VenueSeriesCard({ venue }: { venue: VenueSeries }) {
  const slug = venue.productCode.replace("_VS", "").toLowerCase();

  return (
    <Link
      href={`/bundles/${slug}`}
      className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-gold/40 transition-all duration-300 hover:shadow-[0_0_30px_-8px_rgba(212,168,67,0.15)]"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 bg-surface-light/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gold" />
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground group-hover:text-gold transition">
              {venue.venue.city}
            </h3>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-foreground/40 font-[family-name:var(--font-mono)]">
            {venue.country}
          </span>
        </div>
        <p className="text-sm text-foreground/50 mt-1">{venue.venue.stadium}</p>
      </div>

      {/* Stats */}
      <div className="px-5 py-5 flex-1">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-foreground/40 font-[family-name:var(--font-mono)] mb-1">
              Matches
            </p>
            <p className="text-2xl font-bold text-foreground">
              {venue.totalMatches}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-foreground/40 font-[family-name:var(--font-mono)] mb-1">
              Tiers Available
            </p>
            <p className="text-2xl font-bold text-foreground">
              {venue.offerings.length}
            </p>
          </div>
        </div>

        {/* Offerings preview */}
        <div className="flex flex-wrap gap-1.5">
          {venue.offerings.map((o) => (
            <span
              key={o.id}
              className="text-[10px] px-2 py-1 rounded-full bg-surface-light text-foreground/60 border border-border/50"
            >
              {o.name}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom price bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-surface/80 border-t border-border/50">
        <div>
          <p className="text-[10px] text-foreground/40 uppercase font-[family-name:var(--font-mono)]">
            Starting at
          </p>
          <p className="text-lg font-bold text-gold">
            {formatPrice(venue.usdStartingPrice)}
            <span className="text-[11px] text-foreground/40 font-normal">
              {" "}
              /pp
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1 text-foreground/40 group-hover:text-gold transition">
          <span className="text-xs font-medium">View Details</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition" />
        </div>
      </div>

      {/* Hover glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.04) 0%, transparent 70%)",
        }}
      />
    </Link>
  );
}

/* ─────────────────────────────── Follow My Team ──────────────────────── */
function FollowMyTeamGrid() {
  const [search, setSearch] = useState("");
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const teams = teamsData.teams.filter((t) => !("host" in t && t.host));

  // Group by FIFA group
  const groups = teams.reduce<Record<string, typeof teams>>((acc, team) => {
    const g = team.group;
    if (!acc[g]) acc[g] = [];
    acc[g].push(team);
    return acc;
  }, {});

  const sortedGroupKeys = Object.keys(groups).sort();

  const filteredGroups = search.trim()
    ? sortedGroupKeys.reduce<Record<string, typeof teams>>((acc, g) => {
        const filtered = groups[g].filter((t) =>
          t.name.toLowerCase().includes(search.toLowerCase())
        );
        if (filtered.length) acc[g] = filtered;
        return acc;
      }, {})
    : groups;

  const filteredKeys = Object.keys(filteredGroups).sort();

  // Featured teams (top 8 by ranking)
  const featuredTeams = [...teams].sort((a, b) => a.ranking - b.ranking).slice(0, 8);

  function getTeamCode(slug: string, name: string) {
    const codeMap: Record<string, string> = {
      "korea-republic": "KOR",
      "ir-iran": "IRN",
      "cote-d-ivoire": "CIV",
      "bosnia-herzegovina": "BIH",
      "cabo-verde": "CPV",
      "congo-dr": "COD",
      "spain": "ESP",
      "netherlands": "NED",
      "morocco": "MAR",
      "japan": "JPN",
      "saudi-arabia": "KSA",
      "south-africa": "RSA",
      "new-zealand": "NZL",
      "austria": "AUT",
      "curacao": "CUW",
      "iraq": "IRQ",
      "switzerland": "SUI",
      "united-states": "USA",
      "canada": "CAN",
      "mexico": "MEX",
    };
    return codeMap[slug] || name.substring(0, 3).toUpperCase();
  }

  const GROUP_COLORS: Record<string, string> = {
    A: "#00c8ff",
    B: "#d4a843",
    C: "#1a8a3e",
    D: "#8b5cf6",
    E: "#f43f5e",
    F: "#06b6d4",
    G: "#f59e0b",
    H: "#10b981",
    I: "#6366f1",
    J: "#ec4899",
    K: "#14b8a6",
    L: "#f97316",
  };

  return (
    <section className="relative isolate overflow-hidden px-4 sm:px-6 md:px-10 max-w-[1400px] mx-auto pb-20">
      {/* Landing-style layered glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-20 h-[520px] w-[520px] rounded-full opacity-[0.10]"
        style={{ background: "radial-gradient(closest-side, #1a8a3e 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[40%] -right-32 h-[500px] w-[50vw] rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(closest-side, #00c8ff 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[20%] left-[10%] h-[400px] w-[400px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(closest-side, #d4a843 0%, transparent 70%)" }}
      />

      {/* Decorative ball route */}
      <BallRoute
        className="top-[300px] left-[2%] hidden h-14 w-[320px] rotate-6 opacity-20 lg:block"
        tone="pitch"
      />

      {/* ── Featured Nations ── */}
      <Reveal>
        <div className="relative mb-14">
          <div className="flex items-center gap-3 mb-6">
            <Flame className="h-5 w-5 text-gold" />
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-foreground">
              Featured <span className="font-[family-name:var(--font-serif)] italic text-gold">Nations</span>
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-gold/20 to-transparent" />
          </div>

          {/* Large featured cards - horizontal scroll on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredTeams.map((team, i) => {
              const code = getTeamCode(team.slug, team.name);
              const color = GROUP_COLORS[team.group];
              return (
                <Reveal key={team.slug} delay={i * 50}>
                  <Link
                    href={`/teams/${team.slug}`}
                    className="group relative flex flex-col items-center p-6 rounded-3xl border border-border bg-card overflow-hidden transition-all duration-500 hover:border-transparent hover:shadow-[0_0_60px_-10px_rgba(0,200,255,0.12)]"
                  >
                    {/* Animated gradient border on hover */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${color}25, transparent 40%, transparent 60%, ${color}25)`,
                      }}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-[1px] rounded-3xl bg-card"
                    />

                    {/* Flag */}
                    <div className="relative z-[1] mb-4">
                      <div
                        aria-hidden
                        className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                        style={{ backgroundColor: color }}
                      />
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-surface-light overflow-hidden flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform duration-500">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://api.fifa.com/api/v3/picture/flags-sq-3/${code}`}
                          alt={team.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="relative z-[1] text-center">
                      <p className="text-sm sm:text-base font-bold text-foreground group-hover:text-white transition mb-1 truncate max-w-[120px]">
                        {team.name}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className="text-[9px] px-2 py-0.5 rounded-full font-[family-name:var(--font-mono)] uppercase tracking-wider font-semibold"
                          style={{
                            backgroundColor: color + "20",
                            color: color,
                          }}
                        >
                          Grp {team.group}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 mt-2">
                        <Star className="h-3 w-3 text-gold" />
                        <span className="text-[10px] text-foreground/40 font-[family-name:var(--font-mono)]">
                          #{team.ranking}
                        </span>
                      </div>
                    </div>

                    {/* Bottom hover bar */}
                    <div className="relative z-[1] mt-4 flex items-center gap-1 text-[10px] text-foreground/0 group-hover:text-accent transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <span className="font-medium">View Journey</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* ── Divider ── */}
      <div className="relative mb-12">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-[10px] uppercase tracking-[0.3em] text-foreground/30 font-[family-name:var(--font-mono)]">
            All 45 Nations by Group
          </span>
        </div>
      </div>

      {/* ── Search ── */}
      <Reveal delay={50}>
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for your team..."
              className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-2xl text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-accent/50 focus:shadow-[0_0_20px_-5px_rgba(0,200,255,0.15)] transition-all"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/25"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx={11} cy={11} r={8} />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>

          {/* Group quick-filter pills */}
          <div className="flex flex-wrap gap-1.5">
            {sortedGroupKeys.map((g) => (
              <button
                key={g}
                onClick={() => setSearch(groups[g][0]?.name?.substring(0, 2) || "")}
                onMouseEnter={() => setHoveredGroup(g)}
                onMouseLeave={() => setHoveredGroup(null)}
                className="w-7 h-7 rounded-lg text-[10px] font-bold font-[family-name:var(--font-mono)] transition-all duration-200 border"
                style={{
                  backgroundColor: hoveredGroup === g ? GROUP_COLORS[g] + "25" : "transparent",
                  borderColor: hoveredGroup === g ? GROUP_COLORS[g] + "50" : "rgba(255,255,255,0.08)",
                  color: hoveredGroup === g ? GROUP_COLORS[g] : "rgba(255,255,255,0.3)",
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Grouped teams ── */}
      <div className="space-y-8">
        {filteredKeys.map((groupKey, gi) => (
          <Reveal key={groupKey} delay={gi * 30}>
            <div className="relative">
              {/* Group header with gradient line */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center font-[family-name:var(--font-display)] text-xl font-black overflow-hidden"
                  style={{ color: GROUP_COLORS[groupKey] }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-15"
                    style={{ backgroundColor: GROUP_COLORS[groupKey] }}
                  />
                  {groupKey}
                </div>
                <div className="flex-1">
                  <div
                    className="h-px w-full"
                    style={{
                      background: `linear-gradient(to right, ${GROUP_COLORS[groupKey]}40, transparent 80%)`,
                    }}
                  />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-foreground/25 font-[family-name:var(--font-mono)]">
                  Group {groupKey} · {filteredGroups[groupKey].length} teams
                </span>
              </div>

              {/* Team cards — tall, flag-forward, dramatic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {filteredGroups[groupKey]
                  .sort((a, b) => a.ranking - b.ranking)
                  .map((team, ti) => {
                    const code = getTeamCode(team.slug, team.name);
                    return (
                      <Link
                        key={team.slug}
                        href={`/teams/${team.slug}`}
                        className="group relative flex items-center gap-4 p-4 sm:p-5 bg-card border border-border/60 rounded-2xl overflow-hidden transition-all duration-400 hover:border-transparent hover:shadow-[0_4px_50px_-12px_rgba(0,200,255,0.1)] hover:-translate-y-0.5"
                      >
                        {/* Background glow */}
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: `linear-gradient(135deg, ${GROUP_COLORS[groupKey]}08 0%, transparent 50%), radial-gradient(ellipse at 0% 80%, ${GROUP_COLORS[groupKey]}10 0%, transparent 60%)`,
                          }}
                        />

                        {/* Gradient border effect on hover */}
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            padding: "1px",
                            background: `linear-gradient(135deg, ${GROUP_COLORS[groupKey]}50, transparent 40%, transparent 60%, ${GROUP_COLORS[groupKey]}30)`,
                            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            maskComposite: "xor",
                            WebkitMaskComposite: "xor",
                          }}
                        />

                        {/* Flag */}
                        <div className="relative flex-shrink-0">
                          <div
                            aria-hidden
                            className="absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                            style={{ backgroundColor: GROUP_COLORS[groupKey] }}
                          />
                          <div className="relative w-14 h-14 rounded-xl bg-surface-light overflow-hidden flex items-center justify-center border border-border/50 group-hover:scale-110 group-hover:border-transparent transition-all duration-400">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`https://api.fifa.com/api/v3/picture/flags-sq-3/${code}`}
                              alt={team.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="relative flex-1 min-w-0 z-[1]">
                          <p className="text-sm font-bold text-foreground group-hover:text-white transition truncate">
                            {team.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center gap-1 text-[10px] text-foreground/35 font-[family-name:var(--font-mono)]">
                              <Star className="h-2.5 w-2.5 text-gold/60" />
                              #{team.ranking}
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-foreground/15" />
                            <span className="text-[10px] text-foreground/35 font-[family-name:var(--font-mono)]">
                              {team.appearances} WC{team.appearances !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="relative z-[1] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                          <ArrowRight className="h-4 w-4 text-accent" />
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* No results */}
      {filteredKeys.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-light flex items-center justify-center">
            <Users className="h-8 w-8 text-foreground/15" />
          </div>
          <p className="text-foreground/40 text-sm font-medium">
            No teams match &ldquo;{search}&rdquo;
          </p>
          <button
            onClick={() => setSearch("")}
            className="mt-3 text-xs text-accent hover:text-accent/80 transition"
          >
            Clear search
          </button>
        </div>
      )}

      {/* ── Bottom CTA ── */}
      <Reveal delay={200}>
        <div className="mt-16 relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-pitch/10 via-card to-accent/5" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 20% 100%, rgba(26,138,62,0.12), transparent 50%), radial-gradient(ellipse at 80% 0%, rgba(0,200,255,0.08), transparent 50%)",
            }}
          />

          {/* Grid lines decoration */}
          <div aria-hidden className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-0 left-1/4 w-px h-full bg-foreground" />
            <div className="absolute top-0 left-2/4 w-px h-full bg-foreground" />
            <div className="absolute top-0 left-3/4 w-px h-full bg-foreground" />
            <div className="absolute top-1/3 left-0 w-full h-px bg-foreground" />
            <div className="absolute top-2/3 left-0 w-full h-px bg-foreground" />
          </div>

          <div className="relative z-[1] p-8 sm:p-12 flex flex-col lg:flex-row items-center gap-8 border border-border/30 rounded-3xl">
            {/* Left: icon cluster */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gold/20 rounded-2xl blur-xl" />
                <div className="relative w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-gold" />
                </div>
              </div>
            </div>

            {/* Center: text */}
            <div className="flex-1 text-center lg:text-left">
              <h3 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Ready to Follow Your{" "}
                <span className="font-[family-name:var(--font-serif)] italic text-pitch">Team?</span>
              </h3>
              <p className="text-sm text-foreground/45 max-w-lg leading-relaxed">
                Secure your premium hospitality package. Every group stage match,
                every host city, one unforgettable World Cup journey.
              </p>
            </div>

            {/* Right: CTA */}
            <a
              href="https://fifaworldcup26.hospitality.fifa.com/us/en/choose-bundle?id=FMT"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-accent text-background font-bold text-sm rounded-full hover:bg-accent/90 transition-all shadow-[0_0_40px_-8px_rgba(0,200,255,0.35)] hover:shadow-[0_0_60px_-5px_rgba(0,200,255,0.45)] hover:scale-[1.02]"
            >
              Browse on FIFA.com
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
