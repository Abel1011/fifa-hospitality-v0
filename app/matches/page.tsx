"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  CalendarDays,
  MapPin,
  Users,
  Trophy,
  X,
  ChevronDown,
  ArrowUpRight,
  Sparkles,
  Globe,
  Clock,
  Plus,
  Minus,
  Check,
  ShoppingCart,
  Lock,
  Unlock,
  ChevronRight,
  Loader2,
  CreditCard,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import Header from "@/components/fifa/Header";
import Footer from "@/components/fifa/Footer";
import Reveal from "@/components/fifa/Reveal";
import { PitchBlueprint } from "@/components/fifa/FootballMotifs";
import matchData from "@content/hospitality-pricing-usd.json";

type Match = (typeof matchData.singleMatch)[number];

const STAGES = [
  { code: "GST", label: "Group Stage", color: "accent" },
  { code: "R32", label: "Round of 32", color: "accent" },
  { code: "R16", label: "Round of 16", color: "pitch" },
  { code: "QF", label: "Quarter-Finals", color: "pitch" },
  { code: "SF", label: "Semi-Finals", color: "gold" },
  { code: "BF", label: "Bronze Final", color: "gold" },
  { code: "F", label: "Final", color: "gold" },
];

const CITIES = Array.from(
  new Set(matchData.singleMatch.map((m) => m.venue.city))
).sort();

const TEAMS = Array.from(
  new Set(
    matchData.singleMatch.flatMap((m) => [m.homeTeam.name, m.awayTeam.name])
  )
)
  .filter(Boolean)
  .sort();

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getTeamFlag(code: string): string {
  if (!code) return "";
  const base = "https://api.fifa.com/api/v3/picture/flags-sq-3/";
  return `${base}${code.toUpperCase()}`;
}

function getStageColor(stageCode: string): string {
  const stage = STAGES.find((s) => s.code === stageCode);
  if (!stage) return "accent";
  return stage.color;
}

const colorMap: Record<string, { text: string; border: string; bg: string; glow: string }> = {
  accent: {
    text: "text-accent",
    border: "border-accent/40",
    bg: "bg-accent/10",
    glow: "rgba(0,200,255,0.08)",
  },
  pitch: {
    text: "text-pitch",
    border: "border-pitch/40",
    bg: "bg-pitch/10",
    glow: "rgba(26,138,62,0.08)",
  },
  gold: {
    text: "text-gold",
    border: "border-gold/40",
    bg: "bg-gold/10",
    glow: "rgba(212,168,67,0.08)",
  },
};

export default function MatchesPage() {
  return (
    <Suspense>
      <MatchesPageContent />
    </Suspense>
  );
}

function MatchesPageContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Multi-Match Series state
  type Mode = "single" | "multi";
  type CheckoutStep = "idle" | "checkout" | "processing" | "success";
  const [mode, setMode] = useState<Mode>(searchParams.get("mode") === "multi" ? "multi" : "single");
  const [cart, setCart] = useState<number[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("idle");

  const MAX_MATCHES = 5;
  const MIN_MATCHES = 4;

  // Stage unlock rules for Multi-Match Series:
  // Step 1: Group Stage (excl. USA) or Round of 32
  // Step 2: + Round of 16 or Bronze Final
  // Step 3: + USA Group Stage or Quarter-Finals or Semi-Finals
  // Step 4-5: + all matches including the Final
  const getUnlockedStages = (selectedCount: number): string[] => {
    const stages: string[] = ["GST", "R32"];
    if (selectedCount >= 1) {
      stages.push("R16", "BF");
    }
    if (selectedCount >= 2) {
      stages.push("QF", "SF");
    }
    if (selectedCount >= 3) {
      stages.push("F");
    }
    return stages;
  };

  const unlockedStages = getUnlockedStages(cart.length);

  const isMatchUnlocked = (match: Match): boolean => {
    if (mode !== "multi") return true;
    return unlockedStages.includes(match.stageCode);
  };

  const isInCart = (matchNumber: number) => cart.includes(matchNumber);

  const toggleCart = (matchNumber: number) => {
    if (isInCart(matchNumber)) {
      setCart(cart.filter((n) => n !== matchNumber));
    } else if (cart.length < MAX_MATCHES) {
      setCart([...cart, matchNumber]);
    }
  };

  const matches = matchData.singleMatch;

  const cartMatches = matches.filter((m) => cart.includes(m.matchNumber));
  const cartTotal = cartMatches.reduce((sum, m) => sum + m.usdStartingPrice, 0);

  const filtered = useMemo(() => {
    let result = [...matches];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.homeTeam.name.toLowerCase().includes(term) ||
          m.awayTeam.name.toLowerCase().includes(term) ||
          m.venue.stadium.toLowerCase().includes(term) ||
          m.venue.city.toLowerCase().includes(term)
      );
    }

    if (selectedStage) {
      result = result.filter((m) => m.stageCode === selectedStage);
    }

    if (selectedCity) {
      result = result.filter((m) => m.venue.city === selectedCity);
    }

    if (selectedTeam) {
      result = result.filter(
        (m) =>
          m.homeTeam.name === selectedTeam ||
          m.awayTeam.name === selectedTeam
      );
    }

    return result.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [matches, searchTerm, selectedStage, selectedCity, selectedTeam]);

  const activeFilterCount = [selectedStage, selectedCity, selectedTeam].filter(
    Boolean
  ).length;

  const clearFilters = () => {
    setSelectedStage("");
    setSelectedCity("");
    setSelectedTeam("");
    setSearchTerm("");
  };

  // Stats
  const totalVenues = new Set(matches.map((m) => m.venue.stadium)).size;
  const totalCities = new Set(matches.map((m) => m.venue.city)).size;
  const minPrice = Math.min(...matches.map((m) => m.usdStartingPrice));

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* ─── Hero Section ─── */}
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden">
        <PitchBlueprint className="opacity-[0.05]" />

        {/* Decorative glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[90vw] h-[500px] rounded-full opacity-[0.14]"
          style={{
            background:
              "radial-gradient(closest-side, #1a8a3e 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.10]"
          style={{
            background:
              "radial-gradient(closest-side, #00c8ff 0%, transparent 70%)",
          }}
        />

        <div className="relative z-[1] px-6 sm:px-10 md:px-20 max-w-[1600px] mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="block h-px w-10 bg-accent" />
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-accent">
                §01 — Match Calendar
              </span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="font-[family-name:var(--font-display)] text-[10vw] sm:text-[7vw] md:text-[5.5vw] xl:text-[84px] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-foreground mb-6">
              Choose Your{" "}
              <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight text-gold">
                Match.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-foreground/60 max-w-2xl text-base sm:text-lg leading-relaxed mb-10">
              Browse all 104 matches of the FIFA World Cup 26™ across 16
              world-class venues in 3 host nations. Secure your premium
              hospitality experience.
            </p>
          </Reveal>

          {/* Stats bar */}
          <Reveal delay={300}>
            <div className="inline-flex items-stretch gap-px rounded-2xl border border-foreground/10 bg-foreground/5 overflow-hidden">
              <div className="flex flex-col items-center justify-center px-6 sm:px-8 py-4">
                <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-foreground">
                  104
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/45 mt-1">
                  Matches
                </span>
              </div>
              <div className="w-px bg-foreground/10" />
              <div className="flex flex-col items-center justify-center px-6 sm:px-8 py-4">
                <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-foreground">
                  {totalVenues}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/45 mt-1">
                  Venues
                </span>
              </div>
              <div className="w-px bg-foreground/10" />
              <div className="flex flex-col items-center justify-center px-6 sm:px-8 py-4">
                <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-foreground">
                  {totalCities}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/45 mt-1">
                  Cities
                </span>
              </div>
              <div className="w-px bg-foreground/10" />
              <div className="flex flex-col items-center justify-center px-6 sm:px-8 py-4">
                <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-gold">
                  {formatPrice(minPrice)}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/45 mt-1">
                  From / person
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Mode Toggle ─── */}
      <section className="px-6 sm:px-10 md:px-20 max-w-[1600px] mx-auto pb-6">
        <Reveal delay={350}>
          <div className="inline-flex items-center gap-1 p-1 rounded-full border border-foreground/10 bg-surface/40 backdrop-blur-sm">
            <button
              onClick={() => { setMode("single"); setCart([]); setCheckoutStep("idle"); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-[0.2em] transition-all ${
                mode === "single"
                  ? "bg-accent/15 border border-accent/40 text-accent shadow-sm"
                  : "text-foreground/50 hover:text-foreground/70"
              }`}
            >
              <Ticket className="h-3.5 w-3.5" />
              Single Match
            </button>
            <button
              onClick={() => setMode("multi")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-[0.2em] transition-all ${
                mode === "multi"
                  ? "bg-gold/15 border border-gold/40 text-gold shadow-sm"
                  : "text-foreground/50 hover:text-foreground/70"
              }`}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Multi-Match Series
              {cart.length > 0 && (
                <span className="ml-1 bg-gold text-background text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {mode === "multi" && (
            <div className="mt-4 p-4 rounded-xl border border-gold/15 bg-gold/[0.03]">
              <p className="text-xs text-foreground/60 leading-relaxed">
                <strong className="text-gold">Multi-Match Series:</strong> Select 4–5 matches to build your custom path to the Final.
                Each match you add unlocks higher tournament stages.
              </p>
              {/* Stage unlock indicators */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  { label: "Group & R32", unlocked: true },
                  { label: "R16 & Bronze", unlocked: cart.length >= 1 },
                  { label: "QF & SF", unlocked: cart.length >= 2 },
                  { label: "Final", unlocked: cart.length >= 3 },
                ].map((step, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-[family-name:var(--font-mono)] uppercase tracking-wider border transition-all ${
                      step.unlocked
                        ? "border-gold/30 bg-gold/10 text-gold"
                        : "border-foreground/10 bg-foreground/[0.02] text-foreground/30"
                    }`}
                  >
                    {step.unlocked ? <Unlock className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
                    {step.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Reveal>
      </section>

      {/* ─── Divider ─── */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 md:px-20">
        <div className="flex items-center gap-6">
          <span className="block h-px flex-1 bg-foreground/10" />
          <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.4em] text-foreground/30">
            Filter & Explore
          </span>
          <span className="block h-px flex-1 bg-foreground/10" />
        </div>
      </div>

      {/* ─── Filters Section ─── */}
      <section className="relative z-[2] px-6 sm:px-10 md:px-20 max-w-[1600px] mx-auto py-10">
        <div className="flex flex-col gap-5">
          {/* Search + filter toggle */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <input
                type="text"
                placeholder="Search teams, cities, stadiums..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-5 py-3.5 bg-surface/60 backdrop-blur-sm border border-foreground/10 rounded-full text-foreground placeholder:text-foreground/35 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-full border text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-[0.2em] transition-all ${
                showFilters || activeFilterCount > 0
                  ? "bg-accent/10 border-accent/40 text-accent"
                  : "bg-surface/40 border-foreground/15 text-foreground/60 hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-accent text-background text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] text-foreground/50 hover:text-foreground border border-foreground/10 hover:border-foreground/20 transition-all"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>

          {/* Filter dropdowns panel */}
          {showFilters && (
            <Reveal duration={300} y={8}>
              <div className="flex flex-wrap gap-4 p-5 sm:p-6 bg-surface/30 backdrop-blur-md border border-foreground/10 rounded-2xl">
                {/* Stage */}
                <div className="relative min-w-[160px]">
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/45 mb-2 font-[family-name:var(--font-mono)]">
                    Tournament Stage
                  </label>
                  <div className="relative">
                    <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/40" />
                    <select
                      value={selectedStage}
                      onChange={(e) => setSelectedStage(e.target.value)}
                      className="appearance-none w-full pl-9 pr-9 py-2.5 bg-surface border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer transition-all hover:border-foreground/20"
                    >
                      <option value="">All Stages</option>
                      {STAGES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/40 pointer-events-none" />
                  </div>
                </div>

                {/* City */}
                <div className="relative min-w-[160px]">
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/45 mb-2 font-[family-name:var(--font-mono)]">
                    Host City
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/40" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="appearance-none w-full pl-9 pr-9 py-2.5 bg-surface border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer transition-all hover:border-foreground/20"
                    >
                      <option value="">All Cities</option>
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/40 pointer-events-none" />
                  </div>
                </div>

                {/* Team */}
                <div className="relative min-w-[160px]">
                  <label className="block text-[9px] uppercase tracking-[0.3em] text-foreground/45 mb-2 font-[family-name:var(--font-mono)]">
                    Team
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/40" />
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="appearance-none w-full pl-9 pr-9 py-2.5 bg-surface border border-foreground/10 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer transition-all hover:border-foreground/20"
                    >
                      <option value="">All Teams</option>
                      {TEAMS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground/40 pointer-events-none" />
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* Results count */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-foreground/50">
              <CalendarDays className="h-4 w-4" />
              <span>
                <strong className="text-foreground/80">{filtered.length}</strong>{" "}
                match{filtered.length !== 1 ? "es" : ""} found
              </span>
            </div>
            {selectedStage && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-accent">
                <Trophy className="h-2.5 w-2.5" />
                {STAGES.find((s) => s.code === selectedStage)?.label}
              </span>
            )}
            {selectedCity && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-pitch/30 bg-pitch/5 px-3 py-1 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-pitch">
                <MapPin className="h-2.5 w-2.5" />
                {selectedCity}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ─── Stage Quick Nav ─── */}
      <section className="px-6 sm:px-10 md:px-20 max-w-[1600px] mx-auto pb-8">
        <div className="flex flex-wrap gap-2">
          {STAGES.map((stage) => {
            const count = filtered.filter(
              (m) => m.stageCode === stage.code
            ).length;
            if (count === 0) return null;
            const colors = colorMap[stage.color];
            return (
              <button
                key={stage.code}
                onClick={() =>
                  setSelectedStage(
                    selectedStage === stage.code ? "" : stage.code
                  )
                }
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-[0.2em] transition-all ${
                  selectedStage === stage.code
                    ? `${colors.bg} ${colors.border} ${colors.text}`
                    : "border-foreground/10 text-foreground/50 hover:border-foreground/25 hover:text-foreground/70"
                }`}
              >
                {stage.label}
                <span
                  className={`text-[9px] font-bold ${
                    selectedStage === stage.code
                      ? colors.text
                      : "text-foreground/35"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── Match Grid ─── */}
      <section className={`relative px-6 sm:px-10 md:px-20 max-w-[1600px] mx-auto ${mode === "multi" && cart.length > 0 ? "pb-40" : "pb-28"}`}>
        {/* Subtle background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[80vw] h-[600px] rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(closest-side, #d4a843 0%, transparent 70%)",
          }}
        />

        <div className="relative z-[1] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((match, i) => (
            <Reveal key={match.matchNumber} delay={Math.min(i * 50, 400)} y={16}>
              <MatchCard
                match={match}
                multiMode={mode === "multi"}
                inCart={isInCart(match.matchNumber)}
                locked={!isMatchUnlocked(match)}
                cartFull={cart.length >= MAX_MATCHES}
                onToggle={() => toggleCart(match.matchNumber)}
              />
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="relative z-[1] text-center py-28">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-foreground/10 bg-surface/40 mb-6">
              <Trophy className="h-8 w-8 text-foreground/20" />
            </div>
            <p className="text-foreground/50 text-lg font-[family-name:var(--font-serif)] italic mb-4">
              No matches found with current filters.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-foreground/20 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-foreground transition hover:border-accent hover:bg-accent hover:text-background"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* ─── Multi-Match Sticky Cart ─── */}
      {mode === "multi" && cart.length > 0 && checkoutStep === "idle" && (
        <div className="fixed bottom-0 left-0 right-0 z-[80] border-t border-gold/20 bg-[#020608]/95 backdrop-blur-xl shadow-[0_-12px_60px_rgba(0,0,0,0.5)]">
          <div className="max-w-[1600px] mx-auto px-6 sm:px-10 md:px-20 py-4">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Slot indicators */}
              <div className="flex items-center gap-2">
                {Array.from({ length: MAX_MATCHES }).map((_, i) => {
                  const m = cartMatches[i];
                  return (
                    <div
                      key={i}
                      className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl border transition-all ${
                        m
                          ? "border-gold/40 bg-gold/10"
                          : i < MIN_MATCHES
                          ? "border-foreground/15 bg-foreground/[0.03] border-dashed"
                          : "border-foreground/8 bg-foreground/[0.02] border-dashed"
                      }`}
                    >
                      {m ? (
                        <button
                          onClick={() => toggleCart(m.matchNumber)}
                          className="flex flex-col items-center justify-center w-full h-full group"
                          title={`Remove M${m.matchNumber}`}
                        >
                          <span className="font-[family-name:var(--font-mono)] text-[9px] text-gold font-medium">
                            M{m.matchNumber}
                          </span>
                          <Minus className="h-2.5 w-2.5 text-red-400 opacity-0 group-hover:opacity-100 absolute -top-1 -right-1 bg-red-400/20 rounded-full p-0.5" />
                        </button>
                      ) : (
                        <span className="font-[family-name:var(--font-mono)] text-[9px] text-foreground/25">
                          {i + 1}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground/60">
                  <strong className="text-foreground/80">{cart.length}</strong> of {MIN_MATCHES}–{MAX_MATCHES} matches selected
                </p>
                <p className="text-sm font-bold text-gold font-[family-name:var(--font-display)]">
                  {formatPrice(cartTotal)}
                  <span className="text-[10px] font-normal text-foreground/40 ml-1">estimated total</span>
                </p>
              </div>

              {/* Checkout button */}
              <button
                onClick={() => cart.length >= MIN_MATCHES && setCheckoutStep("checkout")}
                disabled={cart.length < MIN_MATCHES}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] font-bold transition-all ${
                  cart.length >= MIN_MATCHES
                    ? "bg-gold text-background hover:bg-gold/90 shadow-lg shadow-gold/20"
                    : "bg-foreground/10 text-foreground/30 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                {cart.length >= MIN_MATCHES ? "Checkout" : `Select ${MIN_MATCHES - cart.length} more`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Checkout Overlay ─── */}
      {checkoutStep !== "idle" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/88 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl rounded-3xl border border-foreground/[0.07] shadow-2xl shadow-black/60 overflow-hidden max-h-[92vh] animate-in zoom-in-95 fade-in duration-300">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0510] via-[#0d1220] to-[#080612]" />
            {/* Diamond pattern */}
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full text-gold/[0.03] pointer-events-none" preserveAspectRatio="xMidYMid slice">
              {Array.from({ length: 8 }).map((_, row) =>
                Array.from({ length: 8 }).map((_, col) => (
                  <path key={`${row}-${col}`} d={`M ${col * 25 + 12.5} ${row * 25} L ${col * 25 + 25} ${row * 25 + 12.5} L ${col * 25 + 12.5} ${row * 25 + 25} L ${col * 25} ${row * 25 + 12.5} Z`} stroke="currentColor" strokeWidth="0.3" />
                ))
              )}
            </svg>
            {/* Radial glows */}
            <div className="absolute -top-20 left-1/3 w-[350px] h-[250px] rounded-full bg-gold/[0.05] blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-20 w-[300px] h-[300px] rounded-full bg-pitch/[0.03] blur-[80px] pointer-events-none" />
            <div className="absolute top-1/2 -left-16 w-[200px] h-[200px] rounded-full bg-gold/[0.03] blur-[60px] pointer-events-none" />

            {/* Close */}
            <button
              onClick={() => setCheckoutStep("idle")}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-foreground/50 hover:text-foreground transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative overflow-y-auto max-h-[92vh]">

            {checkoutStep === "checkout" && (
              <div className="relative">
                {/* Header */}
                <div className="relative px-6 sm:px-8 pt-7 pb-6">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gold/10 border border-gold/20">
                      <ShoppingCart className="h-4 w-4 text-gold" />
                    </div>
                    <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-gold/80">
                      Multi-Match Series · Checkout
                    </span>
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                    Complete Your Series
                  </h2>
                  <p className="mt-2 font-[family-name:var(--font-serif)] italic text-foreground/50 text-base">
                    {cart.length} matches selected · Your path to the FIFA World Cup 2026™ Final
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />
                </div>

                <div className="relative px-6 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-7 gap-8">
                  {/* Form */}
                  <form onSubmit={(e) => { e.preventDefault(); setCheckoutStep("processing"); setTimeout(() => setCheckoutStep("success"), 2500); }} className="md:col-span-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Full Name</label>
                        <input type="text" required placeholder="John Doe" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-gold/40 focus:bg-gold/[0.02] focus:shadow-[0_0_0_3px_rgba(212,168,67,0.06)] transition" />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Email</label>
                        <input type="email" required placeholder="john@example.com" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-gold/40 focus:bg-gold/[0.02] focus:shadow-[0_0_0_3px_rgba(212,168,67,0.06)] transition" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Card Number</label>
                      <div className="relative">
                        <input type="text" required placeholder="4242 4242 4242 4242" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-gold/40 focus:bg-gold/[0.02] focus:shadow-[0_0_0_3px_rgba(212,168,67,0.06)] transition font-[family-name:var(--font-mono)]" />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Expiry</label>
                        <input type="text" required placeholder="MM/YY" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-gold/40 focus:bg-gold/[0.02] focus:shadow-[0_0_0_3px_rgba(212,168,67,0.06)] transition font-[family-name:var(--font-mono)]" />
                      </div>
                      <div>
                        <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">CVV</label>
                        <input type="text" required placeholder="123" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-gold/40 focus:bg-gold/[0.02] focus:shadow-[0_0_0_3px_rgba(212,168,67,0.06)] transition font-[family-name:var(--font-mono)]" />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="group w-full py-4 rounded-xl bg-gradient-to-r from-gold to-[#c49a38] text-background font-[family-name:var(--font-display)] font-bold text-sm tracking-wide hover:from-gold/90 hover:to-[#b8903a] transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(212,168,67,0.15)]">
                        <span className="flex items-center justify-center gap-2">
                          <ShieldCheck className="h-4 w-4 opacity-70" />
                          Confirm {formatPrice(cartTotal)}
                        </span>
                      </button>
                      <p className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-foreground/30 font-[family-name:var(--font-mono)]">
                        <span className="w-1 h-1 rounded-full bg-gold/50" />
                        Simulated transaction · No real charge
                        <span className="w-1 h-1 rounded-full bg-gold/50" />
                      </p>
                    </div>
                  </form>

                  {/* Order summary */}
                  <div className="md:col-span-3">
                    <div className="sticky top-4 p-5 rounded-2xl bg-foreground/[0.03] border border-foreground/8">
                      <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-4">Your Series</p>
                      <div className="space-y-2.5 max-h-52 overflow-y-auto">
                        {cartMatches
                          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                          .map((m) => (
                          <div key={m.matchNumber} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-foreground/[0.03] border border-foreground/5">
                            <span className="font-[family-name:var(--font-mono)] text-[9px] text-gold px-1.5 py-0.5 bg-gold/10 border border-gold/20 rounded font-bold shrink-0">
                              M{m.matchNumber}
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="block text-[11px] text-foreground/70 truncate">
                                {m.homeTeam.name || "TBD"} vs {m.awayTeam.name || "TBD"}
                              </span>
                              <span className="block text-[10px] text-foreground/35 font-[family-name:var(--font-mono)]">
                                {formatDate(m.date)} · {m.venue.city}
                              </span>
                            </div>
                            <span className="text-[11px] text-foreground/50 font-[family-name:var(--font-mono)] shrink-0">
                              {formatPrice(m.usdStartingPrice)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between pt-4 mt-4 border-t border-foreground/8">
                        <span className="text-foreground/70 font-semibold text-sm">Total</span>
                        <span className="font-[family-name:var(--font-display)] font-bold text-lg text-foreground">{formatPrice(cartTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {checkoutStep === "processing" && (
              <div className="relative px-6 py-24 flex flex-col items-center justify-center text-center">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-72 h-72 rounded-full bg-gold/[0.04] blur-[60px] animate-pulse" />
                </div>
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full border border-gold/15 flex items-center justify-center">
                    <div className="absolute w-24 h-24 rounded-full border-2 border-transparent border-t-gold/40 animate-spin" />
                    <div className="w-16 h-16 rounded-full bg-gold/[0.06] border border-gold/20 flex items-center justify-center">
                      <Loader2 className="h-7 w-7 text-gold animate-spin [animation-duration:1.5s]" />
                    </div>
                  </div>
                </div>
                <h3 className="relative font-[family-name:var(--font-display)] text-xl font-bold text-foreground mb-2">
                  Processing Payment
                </h3>
                <p className="relative text-sm text-foreground/45 max-w-sm font-[family-name:var(--font-serif)] italic">
                  Securing your {cart.length}-match series package...
                </p>
                <div className="relative mt-8 flex items-center gap-1.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                  ))}
                </div>
              </div>
            )}

            {checkoutStep === "success" && (
              <div className="relative px-6 sm:px-8 py-16 flex flex-col items-center justify-center text-center">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-56 h-56 rounded-full bg-pitch/[0.05] blur-[50px]" />
                </div>

                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-pitch/20 to-pitch/5 border border-pitch/30 flex items-center justify-center mb-8 animate-in zoom-in duration-500 shadow-[0_0_40px_rgba(26,138,62,0.12)]">
                  <div className="absolute inset-1.5 rounded-full border border-pitch/10" />
                  <Trophy className="h-10 w-10 text-pitch" />
                  <Check className="absolute -bottom-1 -right-1 h-7 w-7 text-pitch bg-[#0d1220] rounded-full p-1 border border-pitch/30" />
                </div>

                <h3 className="relative font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-2">
                  Series Confirmed!
                </h3>
                <p className="relative text-sm text-foreground/45 max-w-md mb-8 font-[family-name:var(--font-serif)] italic">
                  Your <strong className="text-foreground/70 not-italic">{cart.length}-match series</strong> package is confirmed. See you at the World Cup!
                </p>

                {/* Confirmation card */}
                <div className="relative w-full max-w-sm">
                  <div className="absolute top-1/2 -left-2.5 w-5 h-5 rounded-full bg-[#0a0510]" />
                  <div className="absolute top-1/2 -right-2.5 w-5 h-5 rounded-full bg-[#0a0510]" />
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-foreground/[0.06] to-foreground/[0.02] border border-foreground/10">
                    <div className="flex items-center justify-center gap-2 mb-5 pb-3 border-b border-dashed border-foreground/10">
                      <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.4em] text-gold/70">
                        FIFA World Cup 2026™ · Multi-Match Series
                      </span>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Conf #</span>
                        <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">
                          MMS-{Math.random().toString(36).slice(2, 8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Matches</span>
                        <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{cart.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Venues</span>
                        <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{new Set(cartMatches.map(m => m.venue.city)).size} cities</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-foreground/8">
                        <span className="text-foreground/50 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider font-semibold">Total</span>
                        <span className="font-[family-name:var(--font-display)] font-bold text-lg text-foreground">{formatPrice(cartTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => { setCheckoutStep("idle"); setCart([]); setMode("single"); }}
                  className="relative mt-8 px-8 py-3 rounded-xl bg-foreground/[0.05] border border-foreground/15 text-sm text-foreground/80 hover:border-pitch/40 hover:text-pitch hover:bg-pitch/[0.04] transition font-[family-name:var(--font-display)] font-semibold"
                >
                  Done
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

/* ─────────────────────────────── Match Card ──────────────────────── */
function MatchCard({
  match,
  multiMode = false,
  inCart = false,
  locked = false,
  cartFull = false,
  onToggle,
}: {
  match: Match;
  multiMode?: boolean;
  inCart?: boolean;
  locked?: boolean;
  cartFull?: boolean;
  onToggle?: () => void;
}) {
  const stageLabel =
    STAGES.find((s) => s.code === match.stageCode)?.label || match.stageLabel;
  const stageColor = getStageColor(match.stageCode);
  const colors = colorMap[stageColor] || colorMap.accent;

  const isKnockout = ["R16", "QF", "SF", "BF", "F"].includes(match.stageCode);

  const cardContent = (
    <>
      {/* Knockout badge */}
      {isKnockout && !multiMode && (
        <div className="absolute top-3 right-3 z-[2]">
          <span
            className={`inline-flex items-center gap-1 rounded-full ${colors.bg} ${colors.border} border backdrop-blur-sm px-2 py-0.5 font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.2em] ${colors.text}`}
          >
            <Sparkles className="h-2.5 w-2.5" />
            Knockout
          </span>
        </div>
      )}

      {/* Multi-mode: locked overlay */}
      {multiMode && locked && (
        <div className="absolute inset-0 z-[3] flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-2xl">
          <div className="text-center px-4">
            <Lock className="h-6 w-6 text-foreground/25 mx-auto mb-2" />
            <p className="text-[10px] text-foreground/40 font-[family-name:var(--font-mono)] uppercase tracking-wider">
              Select more matches to unlock
            </p>
          </div>
        </div>
      )}

      {/* Top section: match number + stage pill + added badge */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-foreground/40">
          Match {match.matchNumber}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] ${colors.text}`}
          >
            {stageLabel}
          </span>
          {multiMode && inCart && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 border border-gold/40 backdrop-blur-sm px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.15em] text-gold">
              <Check className="h-2.5 w-2.5" />
              Added
            </span>
          )}
        </div>
      </div>

      {/* Teams confrontation */}
      <div className="flex items-center justify-between px-5 py-6 flex-1">
        {/* Home */}
        <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
          <div className="relative w-14 h-14 rounded-full bg-surface overflow-hidden flex items-center justify-center border border-foreground/10 group-hover:border-foreground/20 transition-all duration-500 group-hover:scale-105">
            {match.homeTeam.code ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getTeamFlag(match.homeTeam.code)}
                alt={match.homeTeam.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <Globe className="h-5 w-5 text-foreground/30" />
            )}
          </div>
          <span className="text-[11px] text-foreground/80 text-center font-medium truncate max-w-[90px]">
            {match.homeTeam.name || "TBD"}
          </span>
        </div>

        {/* VS divider */}
        <div className="flex flex-col items-center px-4">
          <div className="w-px h-6 bg-foreground/10 mb-2" />
          <span className="font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.3em] text-foreground/25">
            VS
          </span>
          <div className="w-px h-6 bg-foreground/10 mt-2" />
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
          <div className="relative w-14 h-14 rounded-full bg-surface overflow-hidden flex items-center justify-center border border-foreground/10 group-hover:border-foreground/20 transition-all duration-500 group-hover:scale-105">
            {match.awayTeam.code ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getTeamFlag(match.awayTeam.code)}
                alt={match.awayTeam.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <Globe className="h-5 w-5 text-foreground/30" />
            )}
          </div>
          <span className="text-[11px] text-foreground/80 text-center font-medium truncate max-w-[90px]">
            {match.awayTeam.name || "TBD"}
          </span>
        </div>
      </div>

      {/* Bottom info panel */}
      <div className="relative px-5 py-4 border-t border-foreground/[0.06] bg-surface/50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-foreground/35" />
              <span className="text-[11px] text-foreground/60 font-medium">
                {formatDate(match.date)}
                {match.kickoffLabel?.split(",")[1]?.trim()
                  ? ` · ${match.kickoffLabel.split(",")[1].trim()}`
                  : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-foreground/35" />
              <span className="text-[11px] text-foreground/45 truncate max-w-[180px]">
                {match.venue.stadium}, {match.venue.city}
              </span>
            </div>
          </div>
          {multiMode ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!locked) onToggle?.();
              }}
              disabled={locked || (!inCart && cartFull)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                inCart
                  ? "bg-gold/15 border border-gold/30 text-gold hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400"
                  : locked || cartFull
                  ? "bg-foreground/5 border border-foreground/10 text-foreground/25 cursor-not-allowed"
                  : "bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20 hover:border-gold/40"
              }`}
            >
              {inCart ? (
                <><Minus className="h-3 w-3" /> Remove</>
              ) : (
                <><Plus className="h-3 w-3" /> Add</>
              )}
            </button>
          ) : (
            <div className="text-right flex flex-col items-end gap-1">
              <p className="text-[9px] text-foreground/35 uppercase font-[family-name:var(--font-mono)] tracking-[0.2em]">
                From
              </p>
              <p className="text-base font-bold text-gold font-[family-name:var(--font-display)]">
                {formatPrice(match.usdStartingPrice)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hover arrow indicator (single mode only) */}
      {!multiMode && (
        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
          {!isKnockout && (
            <ArrowUpRight className="h-4 w-4 text-foreground/40 group-hover:rotate-45 transition-transform duration-300" />
          )}
        </div>
      )}

      {/* Hover glow overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${colors.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Bottom accent line on hover */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[2px] ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        style={{
          background: `linear-gradient(90deg, transparent, ${
            stageColor === "gold"
              ? "#d4a843"
              : stageColor === "pitch"
              ? "#1a8a3e"
              : "#00c8ff"
          }, transparent)`,
        }}
      />
    </>
  );

  // In multi-match mode, use a div instead of Link
  if (multiMode) {
    return (
      <div
        onClick={() => !locked && onToggle?.()}
        className={`group relative flex flex-col h-full rounded-2xl border overflow-hidden transition-all duration-500 cursor-pointer ${
          inCart
            ? "border-gold/40 bg-gold/[0.03] shadow-[0_0_30px_-8px_rgba(212,168,67,0.15)]"
            : locked
            ? "border-foreground/5 bg-surface/20 cursor-not-allowed"
            : "border-foreground/10 bg-surface/30 hover:border-foreground/25 hover:shadow-[0_0_60px_-12px_rgba(212,168,67,0.12)]"
        }`}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/matches/${match.matchNumber}`}
      className="group relative flex flex-col h-full rounded-2xl border border-foreground/10 bg-surface/30 overflow-hidden transition-all duration-500 hover:border-foreground/25 hover:shadow-[0_0_60px_-12px_rgba(0,200,255,0.12)]"
    >
      {cardContent}
    </Link>
  );
}
