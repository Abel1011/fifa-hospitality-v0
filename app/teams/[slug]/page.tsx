"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowRight,
  Globe,
  Plane,
  Shield,
  Ticket,
} from "lucide-react";
import Header from "@/components/fifa/Header";
import Footer from "@/components/fifa/Footer";
import Reveal from "@/components/fifa/Reveal";
import { PitchBlueprint, BallRoute } from "@/components/fifa/FootballMotifs";
import teamsData from "@content/teams.json";
import matchData from "@content/hospitality-pricing-usd.json";

type Team = (typeof teamsData.teams)[number];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function getTeamFlag(code: string): string {
  if (!code) return "";
  return `https://api.fifa.com/api/v3/picture/flags-sq-3/${code.toUpperCase()}`;
}

function getTeamCode(team: Team): string {
  const codeMap: Record<string, string> = {
    "korea-republic": "KOR",
    "ir-iran": "IRN",
    "cote-d-ivoire": "CIV",
    "bosnia-herzegovina": "BIH",
    "cabo-verde": "CPV",
    "congo-dr": "COD",
    "united-states": "USA",
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
    "canada": "CAN",
    "mexico": "MEX",
  };
  return codeMap[team.slug] || team.name.substring(0, 3).toUpperCase();
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

export default function TeamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const team = teamsData.teams.find((t) => t.slug === slug);

  if (!team) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 text-center px-4">
          <Shield className="h-16 w-16 text-foreground/10 mx-auto mb-6" />
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-3">
            Team Not Found
          </h1>
          <p className="text-foreground/50 mb-6">
            The team &ldquo;{slug}&rdquo; doesn&apos;t exist in our records.
          </p>
          <Link
            href="/bundles?view=follow-team"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all teams
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const teamCode = getTeamCode(team);
  const groupColor = GROUP_COLORS[team.group] || "#00c8ff";

  // Find matches where this team plays
  const teamMatches = matchData.singleMatch.filter(
    (m) =>
      m.homeTeam.code === teamCode ||
      m.awayTeam.code === teamCode ||
      m.homeTeam.name === team.name ||
      m.awayTeam.name === team.name
  );

  // Group mates
  const groupMates = teamsData.teams.filter(
    (t) => t.group === team.group && t.slug !== team.slug
  );

  // Unique venues for this team
  const teamVenues = Array.from(new Set(teamMatches.map((m) => m.venue.city)));

  // Price range
  const prices = teamMatches.map((m) => m.usdStartingPrice).filter(Boolean);
  const minPrice = prices.length ? Math.min(...prices) : 0;

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* ━━━ HERO ━━━ */}
      <section className="relative isolate pt-24 sm:pt-28 pb-16 overflow-hidden">
        <PitchBlueprint
          className="opacity-[0.06] [mask-image:linear-gradient(160deg,transparent_0%,#000_25%,#000_75%,transparent_100%)]"
          tone="pitch"
        />

        {/* Dramatic radial glow with group color — larger and more prominent */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[120vw] h-[600px] rounded-full opacity-[0.15]"
          style={{
            background: `radial-gradient(closest-side, ${groupColor} 0%, transparent 70%)`,
          }}
        />

        {/* Secondary gold glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-10 right-0 w-[50vw] h-[400px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(closest-side, #d4a843 0%, transparent 70%)",
          }}
        />

        {/* Tertiary cyan glow — bottom left */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 -left-20 w-[40vw] h-[300px] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(closest-side, #00c8ff 0%, transparent 70%)",
          }}
        />

        {/* Ball route animation */}
        <BallRoute
          className="top-20 right-[5%] hidden h-16 w-[350px] -rotate-2 opacity-20 lg:block"
          tone="gold"
        />

        {/* Decorative circular outlines */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.04]">
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] border border-foreground rounded-full" />
          <div className="absolute -top-40 -right-40 w-[800px] h-[800px] border border-foreground rounded-full" />
        </div>

        {/* Top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px bg-foreground/5" />

        <div className="relative z-[1] px-4 sm:px-6 md:px-10 max-w-[1200px] mx-auto">
          <Link
            href="/bundles?view=follow-team"
            className="inline-flex items-center gap-2 text-sm text-foreground/35 hover:text-accent transition mb-10 group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            <span className="group-hover:underline underline-offset-4">All Teams</span>
          </Link>

          <Reveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
              {/* Flag with dramatic glow + ring */}
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -inset-4 rounded-[2rem] blur-3xl opacity-25 animate-pulse"
                  style={{ backgroundColor: groupColor, animationDuration: "3s" }}
                />
                <div
                  aria-hidden
                  className="absolute -inset-2 rounded-[2rem] border opacity-20"
                  style={{ borderColor: groupColor }}
                />
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-surface-light overflow-hidden flex items-center justify-center border-2 border-foreground/10 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getTeamFlag(teamCode)}
                    alt={team.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: groupColor + "18",
                      color: groupColor,
                      border: `1px solid ${groupColor}40`,
                    }}
                  >
                    Group {team.group}
                  </span>
                  <span className="text-[10px] text-foreground/25 font-[family-name:var(--font-mono)] uppercase tracking-wider">
                    FIFA World Cup 2026™
                  </span>
                </div>

                <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl font-black text-foreground mb-4 leading-[0.9]">
                  {team.name}
                </h1>

                <div className="flex flex-wrap items-center gap-5">
                  <span className="inline-flex items-center gap-2 text-sm text-foreground/50">
                    <div className="w-6 h-6 rounded-md bg-gold/10 flex items-center justify-center">
                      <Star className="h-3.5 w-3.5 text-gold" />
                    </div>
                    FIFA Ranking <span className="font-bold text-foreground text-lg">#{team.ranking}</span>
                  </span>
                  <span className="w-px h-5 bg-foreground/10" />
                  <span className="inline-flex items-center gap-2 text-sm text-foreground/50">
                    <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center">
                      <Globe className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <span className="font-bold text-foreground text-lg">{team.appearances}</span> World Cup{team.appearances !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Stats bar — glassmorphism style */}
          <Reveal delay={100}>
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: teamMatches.length, label: "Group Matches", icon: Calendar, color: groupColor },
                { value: team.group, label: "Group", icon: Shield, color: groupColor },
                { value: `#${team.ranking}`, label: "FIFA Rank", icon: Star, color: "#d4a843" },
                { value: teamVenues.length, label: "Host Cities", icon: Plane, color: "#00c8ff" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="relative bg-card/80 backdrop-blur-sm border border-border/60 rounded-2xl p-5 sm:p-6 text-center overflow-hidden group hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {/* Hover glow */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(ellipse at 50% 100%, ${stat.color}10 0%, transparent 70%)`,
                      }}
                    />
                    {/* Top edge gradient */}
                    <div
                      aria-hidden
                      className="absolute top-0 left-1/4 right-1/4 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: stat.color + "60" }}
                    />
                    <Icon className="h-5 w-5 mx-auto mb-3" style={{ color: stat.color + "80" }} />
                    <p className="text-3xl sm:text-4xl font-black text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-foreground/35 font-[family-name:var(--font-mono)] mt-1">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━ GROUP OPPONENTS ━━━ */}
      <section className="relative px-4 sm:px-6 md:px-10 max-w-[1200px] mx-auto py-14">
        {/* Section background gradient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${groupColor}, transparent 60%)`,
          }}
        />

        <Reveal>
          <div className="relative flex items-center gap-4 mb-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-[family-name:var(--font-display)] text-2xl font-black overflow-hidden"
              style={{ color: groupColor }}
            >
              <div
                aria-hidden
                className="absolute inset-0 rounded-xl opacity-15"
                style={{ backgroundColor: groupColor }}
              />
              <span className="relative">{team.group}</span>
            </div>
            <div className="flex-1">
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/30">
                § Group {team.group} Opponents
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
                Your <span className="font-[family-name:var(--font-serif)] italic" style={{ color: groupColor }}>Rivals</span>
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px] text-foreground/25 font-[family-name:var(--font-mono)] uppercase tracking-wider">
              <Users className="h-3.5 w-3.5" />
              {groupMates.length + 1} teams in group
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {groupMates.map((gm, i) => {
            const gmCode = getTeamCode(gm);
            return (
              <Reveal key={gm.slug} delay={i * 80}>
                <Link
                  href={`/teams/${gm.slug}`}
                  className="group relative flex flex-col items-center p-6 sm:p-8 bg-card border border-border/60 rounded-3xl overflow-hidden transition-all duration-500 hover:border-transparent hover:-translate-y-1 hover:shadow-[0_8px_60px_-15px_rgba(0,200,255,0.1)]"
                >
                  {/* Gradient border effect */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      padding: "1px",
                      background: `linear-gradient(180deg, ${groupColor}50, transparent 60%)`,
                      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      maskComposite: "xor",
                      WebkitMaskComposite: "xor",
                    }}
                  />

                  {/* Background glow */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(ellipse at 50% 0%, ${groupColor}08 0%, transparent 60%)`,
                    }}
                  />

                  {/* Flag with glow */}
                  <div className="relative mb-5">
                    <div
                      aria-hidden
                      className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                      style={{ backgroundColor: groupColor }}
                    />
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-surface-light overflow-hidden flex items-center justify-center border border-border/50 group-hover:scale-110 group-hover:border-transparent transition-all duration-400">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getTeamFlag(gmCode)}
                        alt={gm.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="relative text-center">
                    <p className="text-lg font-bold text-foreground group-hover:text-white transition mb-1">
                      {gm.name}
                    </p>
                    <div className="flex items-center justify-center gap-3 text-xs text-foreground/40">
                      <span className="inline-flex items-center gap-1 font-[family-name:var(--font-mono)]">
                        <Star className="h-3 w-3 text-gold/60" />
                        #{gm.ranking}
                      </span>
                      <span className="w-0.5 h-0.5 rounded-full bg-foreground/20" />
                      <span className="font-[family-name:var(--font-mono)]">
                        {gm.appearances} WC{gm.appearances !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Hover arrow */}
                  <div className="mt-4 flex items-center gap-1.5 text-[11px] text-transparent group-hover:text-accent transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="font-medium">View Team</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ━━━ MATCH JOURNEY ━━━ */}
      {teamMatches.length > 0 && (
        <section className="relative isolate overflow-hidden px-4 sm:px-6 md:px-10 max-w-[1200px] mx-auto py-14 border-t border-border/30">
          {/* Background decoration */}
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-20 w-[50vw] h-[500px] rounded-full opacity-[0.06]"
            style={{
              background: `radial-gradient(closest-side, ${groupColor}, transparent)`,
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 bottom-20 w-[400px] h-[400px] rounded-full opacity-[0.05]"
            style={{
              background: "radial-gradient(closest-side, #d4a843, transparent)",
            }}
          />
          <BallRoute
            className="bottom-20 right-[3%] hidden h-12 w-[280px] rotate-3 opacity-15 lg:block"
            tone="accent"
          />

          <Reveal>
            <div className="mb-10">
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-accent mb-2">
                § Match Journey
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-black text-foreground">
                <span className="font-[family-name:var(--font-serif)] italic text-accent font-normal">Follow</span>{" "}
                {team.name}
              </h2>
              <p className="text-sm text-foreground/35 mt-3 max-w-lg leading-relaxed">
                Every group stage match on the road to glory. Secure premium hospitality across all venues.
              </p>
            </div>
          </Reveal>

          {/* Timeline-style match cards */}
          <div className="relative">
            {/* Vertical timeline line with gradient */}
            <div
              aria-hidden
              className="absolute left-7 sm:left-9 top-6 bottom-6 w-px hidden sm:block"
              style={{
                background: `linear-gradient(to bottom, transparent, ${groupColor}50 20%, ${groupColor}50 80%, transparent)`,
              }}
            />

            <div className="space-y-5">
              {teamMatches.map((m, i) => {
                const isHome = m.homeTeam.code === teamCode || m.homeTeam.name === team.name;
                const opponent = isHome ? m.awayTeam : m.homeTeam;
                const matchDate = new Date(m.date + "T12:00:00");

                return (
                  <Reveal key={m.matchNumber} delay={i * 100}>
                    <Link
                      href={`/matches/${m.matchNumber}`}
                      className="group relative flex items-stretch gap-5 sm:gap-7 ml-0 sm:ml-4"
                    >
                      {/* Timeline dot with pulse */}
                      <div className="hidden sm:flex flex-col items-center flex-shrink-0">
                        <div className="relative">
                          <div
                            aria-hidden
                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-60 blur-sm transition-opacity"
                            style={{ backgroundColor: groupColor }}
                          />
                          <div
                            className="relative w-5 h-5 rounded-full border-2 bg-background z-[1] group-hover:scale-125 transition-all duration-300"
                            style={{ borderColor: groupColor }}
                          >
                            <div
                              className="absolute inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ backgroundColor: groupColor }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card */}
                      <div className="flex-1 relative bg-card border border-border/60 rounded-3xl overflow-hidden transition-all duration-400 hover:border-transparent hover:-translate-y-0.5 hover:shadow-[0_8px_60px_-15px_rgba(0,200,255,0.08)]">
                        {/* Gradient border on hover */}
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            padding: "1px",
                            background: `linear-gradient(135deg, ${groupColor}40, transparent 40%, transparent 60%, ${groupColor}20)`,
                            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            maskComposite: "xor",
                            WebkitMaskComposite: "xor",
                          }}
                        />

                        <div className="relative flex flex-col sm:flex-row">
                          {/* Date column — stronger visual */}
                          <div
                            className="sm:w-32 flex-shrink-0 p-5 sm:p-6 flex sm:flex-col items-center sm:items-center justify-start gap-2 sm:gap-0.5 border-b sm:border-b-0 sm:border-r border-border/30"
                            style={{
                              background: `linear-gradient(135deg, ${groupColor}05, transparent)`,
                            }}
                          >
                            <p className="text-[10px] uppercase tracking-wider text-foreground/35 font-[family-name:var(--font-mono)]">
                              {matchDate.toLocaleDateString("en-US", { month: "short" })}
                            </p>
                            <p className="text-3xl sm:text-4xl font-black text-foreground">
                              {matchDate.getDate()}
                            </p>
                            <p className="text-[10px] text-foreground/25 font-[family-name:var(--font-mono)]">
                              {matchDate.toLocaleDateString("en-US", { weekday: "long" })}
                            </p>
                          </div>

                          {/* Match content */}
                          <div className="flex-1 p-5 sm:p-6 flex items-center gap-5">
                            <div className="flex-1 min-w-0">
                              {/* Teams — larger and bolder */}
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-lg sm:text-xl font-black text-foreground group-hover:text-white transition">
                                  {team.name}
                                </span>
                                <span
                                  className="text-[10px] px-2 py-0.5 rounded font-[family-name:var(--font-mono)] uppercase"
                                  style={{ color: groupColor + "90" }}
                                >
                                  vs
                                </span>
                                <span className="text-lg sm:text-xl font-black text-foreground group-hover:text-white transition">
                                  {opponent.name || "TBD"}
                                </span>
                              </div>

                              {/* Meta row */}
                              <div className="flex flex-wrap items-center gap-3">
                                <span
                                  className="text-[10px] px-3 py-1 rounded-full font-[family-name:var(--font-mono)] uppercase tracking-wider font-semibold"
                                  style={{
                                    backgroundColor: groupColor + "15",
                                    color: groupColor,
                                    border: `1px solid ${groupColor}25`,
                                  }}
                                >
                                  {m.stageLabel}
                                </span>
                                <span className="text-xs text-foreground/35 flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {m.venue.city}
                                </span>
                                <span className="text-xs text-foreground/35 flex items-center gap-1.5">
                                  <Ticket className="h-3.5 w-3.5" />
                                  Match #{m.matchNumber}
                                </span>
                              </div>
                            </div>

                            {/* Price — more prominent */}
                            <div className="text-right flex-shrink-0">
                              <p className="text-[9px] text-foreground/25 uppercase font-[family-name:var(--font-mono)] tracking-wider mb-0.5">
                                From
                              </p>
                              <p className="text-xl sm:text-2xl font-black text-gold">
                                {formatPrice(m.usdStartingPrice)}
                              </p>
                              <p className="text-[10px] text-foreground/25">/person</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Journey summary — more visual */}
          {teamVenues.length > 1 && (
            <Reveal delay={teamMatches.length * 100 + 100}>
              <div className="mt-10 relative p-5 sm:p-6 bg-card border border-accent/15 rounded-2xl overflow-hidden">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{
                    background: "radial-gradient(ellipse at 0% 50%, #00c8ff, transparent 60%)",
                  }}
                />
                <div className="relative flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                    <Plane className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-0.5">
                      {team.name} travels across{" "}
                      <span className="text-accent font-bold">{teamVenues.length} cities</span>
                    </p>
                    <p className="text-xs text-foreground/40">
                      {teamVenues.join(" → ")}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </section>
      )}

      {/* ━━━ FOLLOW MY TEAM CTA ━━━ */}
      {"host" in team && team.host ? null : (
        <section className="px-4 sm:px-6 md:px-10 max-w-[1200px] mx-auto py-16 border-t border-border/30">
          <Reveal>
            <div className="relative rounded-[2rem] overflow-hidden">
              {/* Multi-layer background */}
              <div className="absolute inset-0 bg-gradient-to-br from-pitch/8 via-card to-gold/5" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at 20% 100%, ${groupColor}15, transparent 50%), radial-gradient(ellipse at 80% 0%, #d4a84320, transparent 50%)`,
                }}
              />

              {/* Grid decoration */}
              <div aria-hidden className="absolute inset-0 opacity-[0.025]">
                <div className="absolute top-0 left-1/4 w-px h-full bg-foreground" />
                <div className="absolute top-0 left-2/4 w-px h-full bg-foreground" />
                <div className="absolute top-0 left-3/4 w-px h-full bg-foreground" />
                <div className="absolute top-1/3 left-0 w-full h-px bg-foreground" />
                <div className="absolute top-2/3 left-0 w-full h-px bg-foreground" />
              </div>

              <div className="relative z-[1] p-8 sm:p-12 lg:p-14 border border-border/20 rounded-[2rem]">
                <div className="flex flex-col lg:flex-row items-center gap-10">
                  {/* Left: flag + content */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                      <div className="relative">
                        <div
                          aria-hidden
                          className="absolute inset-0 rounded-2xl blur-xl opacity-30"
                          style={{ backgroundColor: groupColor }}
                        />
                        <div className="relative w-14 h-14 rounded-2xl bg-surface-light overflow-hidden border border-border/50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getTeamFlag(teamCode)}
                            alt={team.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                        <Trophy className="h-6 w-6 text-gold" />
                      </div>
                    </div>

                    <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-pitch mb-3">
                      § Follow My Team Bundle
                    </p>
                    <h3 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-black text-foreground mb-4 leading-tight">
                      Never Miss a{" "}
                      <span className="font-[family-name:var(--font-serif)] italic font-normal" style={{ color: groupColor }}>
                        {team.name}
                      </span>{" "}
                      Moment
                    </h3>
                    <p className="text-sm text-foreground/40 max-w-lg leading-relaxed">
                      Premium hospitality covering every {team.name} group stage match.
                      One bundle, every venue, total peace of mind.
                    </p>

                    {/* Bundle highlights — visual pills */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-8">
                      <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-xs text-foreground/60">
                        <Calendar className="h-3.5 w-3.5 text-pitch" />
                        <span className="font-medium">{teamMatches.length} matches</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-xs text-foreground/60">
                        <MapPin className="h-3.5 w-3.5 text-accent" />
                        <span className="font-medium">{teamVenues.length} cities</span>
                      </div>
                      {minPrice > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-xs text-foreground/60">
                          <Ticket className="h-3.5 w-3.5 text-gold" />
                          <span className="font-medium">From {formatPrice(minPrice)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: CTA */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-4">
                    <a
                      href="https://fifaworldcup26.hospitality.fifa.com/us/en/choose-bundle?id=FMT"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 px-10 py-5 bg-pitch text-background font-bold text-base rounded-full hover:bg-pitch/90 transition-all shadow-[0_0_50px_-10px_rgba(26,138,62,0.4)] hover:shadow-[0_0_70px_-5px_rgba(26,138,62,0.5)] hover:scale-[1.02]"
                    >
                      <Trophy className="h-5 w-5" />
                      Follow {team.name}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                    <p className="text-[10px] text-foreground/25 font-[family-name:var(--font-mono)]">
                      Official FIFA Hospitality
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      <Footer />
    </main>
  );
}
