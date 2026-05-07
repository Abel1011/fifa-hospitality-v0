"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  MapPin,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Crown,
  Clock,
} from "lucide-react";
import Header from "@/components/fifa/Header";
import Footer from "@/components/fifa/Footer";
import Reveal from "@/components/fifa/Reveal";
import { PitchBlueprint } from "@/components/fifa/FootballMotifs";
import bracketData from "@content/knockout-bracket.json";

type BracketMatch = (typeof bracketData.matches)[number];

const STAGE_ORDER = ["R32", "R16", "QTR", "SMF", "FNL"] as const;
const STAGE_LABELS: Record<string, string> = {
  R32: "Round of 32",
  R16: "Round of 16",
  QTR: "Quarter-Finals",
  SMF: "Semi-Finals",
  BRZ: "Bronze Final",
  FNL: "Final",
};

const STAGE_COLORS: Record<string, string> = {
  R32: "#00c8ff",
  R16: "#1a8a3e",
  QTR: "#d4a843",
  SMF: "#8b5cf6",
  BRZ: "#ef4444",
  FNL: "#d4a843",
};

/**
 * Build the bracket tree by splitting matches into left/right halves
 * based on which semi-final they feed into.
 */
function buildBracketHalves(matches: BracketMatch[]) {
  const byNumber: Record<number, BracketMatch> = {};
  matches.forEach((m) => {
    byNumber[m.matchNumber] = m;
  });

  // Semi-finals
  const semis = matches.filter((m) => m.stageCode === "SMF").sort((a, b) => a.matchNumber - b.matchNumber);
  const final = matches.find((m) => m.stageCode === "FNL");
  const bronze = matches.find((m) => m.stageCode === "BRZ");

  // Recursively find all source matches for a given match
  function getSourceTree(matchNum: number): number[] {
    const sources = matches
      .filter((m) => m.nextMatchNumber === matchNum)
      .map((m) => m.matchNumber);
    const all = [...sources];
    sources.forEach((s) => {
      all.push(...getSourceTree(s));
    });
    return all;
  }

  // Left half = all matches feeding into semi 1
  // Right half = all matches feeding into semi 2
  const leftSemiNum = semis[0]?.matchNumber;
  const rightSemiNum = semis[1]?.matchNumber;

  const leftMatchNums = new Set(leftSemiNum ? [leftSemiNum, ...getSourceTree(leftSemiNum)] : []);
  const rightMatchNums = new Set(rightSemiNum ? [rightSemiNum, ...getSourceTree(rightSemiNum)] : []);

  function getStageMatches(half: Set<number>, stageCode: string) {
    return matches
      .filter((m) => half.has(m.matchNumber) && m.stageCode === stageCode)
      .sort((a, b) => a.matchNumber - b.matchNumber);
  }

  return {
    left: {
      R32: getStageMatches(leftMatchNums, "R32"),
      R16: getStageMatches(leftMatchNums, "R16"),
      QTR: getStageMatches(leftMatchNums, "QTR"),
      SMF: getStageMatches(leftMatchNums, "SMF"),
    },
    right: {
      R32: getStageMatches(rightMatchNums, "R32"),
      R16: getStageMatches(rightMatchNums, "R16"),
      QTR: getStageMatches(rightMatchNums, "QTR"),
      SMF: getStageMatches(rightMatchNums, "SMF"),
    },
    final,
    bronze,
  };
}

export default function BracketPage() {
  const [hoveredMatch, setHoveredMatch] = useState<number | null>(null);

  const bracket = useMemo(
    () => buildBracketHalves(bracketData.matches),
    []
  );

  const totalMatches = bracketData.matches.length;

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* ─── Cinematic Hero with Trophy Video ─── */}
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-24 overflow-hidden">
        <PitchBlueprint className="opacity-[0.04]" />

        {/* Trophy video background */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full max-h-[90vh] w-auto object-contain opacity-[0.18] mix-blend-lighten"
          >
            <source
              src="/videos/world-cup-black-background.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_75%)]" />
        </div>

        {/* Decorative glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[100vw] h-[600px] rounded-full opacity-[0.12]"
          style={{
            background:
              "radial-gradient(closest-side, #d4a843 0%, transparent 70%)",
          }}
        />

        <div className="relative z-[1] px-6 sm:px-10 md:px-20 max-w-[1600px] mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="block h-px w-10 bg-gold" />
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-gold">
                §02 — Knockout Bracket
              </span>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="font-[family-name:var(--font-display)] text-[10vw] sm:text-[7vw] md:text-[5.5vw] xl:text-[90px] font-bold uppercase leading-[0.9] tracking-[-0.03em] text-foreground mb-6">
              Road to the{" "}
              <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight text-gold">
                Final.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-foreground/60 max-w-2xl text-base sm:text-lg leading-relaxed mb-10">
              {totalMatches} knockout matches. From the Round of 32 to the Final
              at MetLife Stadium. Follow the path to glory.
            </p>
          </Reveal>

          {/* Stats */}
          <Reveal delay={300}>
            <div className="inline-flex items-stretch gap-px rounded-2xl border border-foreground/10 bg-foreground/5 overflow-hidden">
              {STAGE_ORDER.map((stage) => {
                const count = bracketData.matches.filter(
                  (m) => m.stageCode === stage
                ).length;
                if (!count) return null;
                return (
                  <div key={stage} className="flex flex-col items-center justify-center px-5 sm:px-7 py-4">
                    <span
                      className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold"
                      style={{ color: STAGE_COLORS[stage] }}
                    >
                      {count}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-foreground/40 mt-1">
                      {STAGE_LABELS[stage]}
                    </span>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Bracket Visualization ─── */}
      <section className="relative px-4 sm:px-6 md:px-10 max-w-[1800px] mx-auto pb-16 overflow-x-auto">
        {/* Section header */}
        <div className="flex items-center gap-6 mb-10 px-2">
          <span className="block h-px flex-1 bg-foreground/10" />
          <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.4em] text-foreground/30">
            Tournament Bracket
          </span>
          <span className="block h-px flex-1 bg-foreground/10" />
        </div>

        {/* The actual bracket - horizontal layout */}
        <div className="min-w-[1100px]">
          {/* Stage headers */}
          <div className="grid grid-cols-9 gap-1 mb-4 px-1">
            <div className="text-center">
              <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em]" style={{ color: STAGE_COLORS.R32 }}>
                R32
              </span>
            </div>
            <div className="text-center">
              <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em]" style={{ color: STAGE_COLORS.R16 }}>
                R16
              </span>
            </div>
            <div className="text-center">
              <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em]" style={{ color: STAGE_COLORS.QTR }}>
                QF
              </span>
            </div>
            <div className="text-center">
              <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em]" style={{ color: STAGE_COLORS.SMF }}>
                SF
              </span>
            </div>
            <div className="text-center">
              <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-gold">
                <Crown className="inline h-3 w-3 mr-1" />
                FINAL
              </span>
            </div>
            <div className="text-center">
              <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em]" style={{ color: STAGE_COLORS.SMF }}>
                SF
              </span>
            </div>
            <div className="text-center">
              <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em]" style={{ color: STAGE_COLORS.QTR }}>
                QF
              </span>
            </div>
            <div className="text-center">
              <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em]" style={{ color: STAGE_COLORS.R16 }}>
                R16
              </span>
            </div>
            <div className="text-center">
              <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em]" style={{ color: STAGE_COLORS.R32 }}>
                R32
              </span>
            </div>
          </div>

          {/* Bracket grid */}
          <div className="grid grid-cols-9 gap-1 items-center">
            {/* LEFT SIDE: R32 */}
            <div className="flex flex-col gap-1">
              {bracket.left.R32.map((m) => (
                <MiniMatchCell
                  key={m.matchNumber}
                  match={m}
                  hovered={hoveredMatch}
                  onHover={setHoveredMatch}
                />
              ))}
            </div>

            {/* LEFT SIDE: R16 */}
            <div className="flex flex-col gap-3 justify-around h-full">
              {bracket.left.R16.map((m) => (
                <MiniMatchCell
                  key={m.matchNumber}
                  match={m}
                  hovered={hoveredMatch}
                  onHover={setHoveredMatch}
                />
              ))}
            </div>

            {/* LEFT SIDE: QF */}
            <div className="flex flex-col gap-8 justify-around h-full">
              {bracket.left.QTR.map((m) => (
                <MiniMatchCell
                  key={m.matchNumber}
                  match={m}
                  hovered={hoveredMatch}
                  onHover={setHoveredMatch}
                />
              ))}
            </div>

            {/* LEFT SIDE: SF */}
            <div className="flex flex-col justify-center h-full">
              {bracket.left.SMF.map((m) => (
                <MiniMatchCell
                  key={m.matchNumber}
                  match={m}
                  hovered={hoveredMatch}
                  onHover={setHoveredMatch}
                  large
                />
              ))}
            </div>

            {/* CENTER: FINAL */}
            <div className="flex flex-col items-center justify-center h-full gap-4">
              {bracket.final && (
                <FinalMatchCell
                  match={bracket.final}
                  hovered={hoveredMatch}
                  onHover={setHoveredMatch}
                />
              )}
              {bracket.bronze && (
                <div className="mt-4">
                  <span className="block text-center font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.2em] text-foreground/30 mb-1">
                    Bronze
                  </span>
                  <MiniMatchCell
                    match={bracket.bronze}
                    hovered={hoveredMatch}
                    onHover={setHoveredMatch}
                  />
                </div>
              )}
            </div>

            {/* RIGHT SIDE: SF */}
            <div className="flex flex-col justify-center h-full">
              {bracket.right.SMF.map((m) => (
                <MiniMatchCell
                  key={m.matchNumber}
                  match={m}
                  hovered={hoveredMatch}
                  onHover={setHoveredMatch}
                  large
                />
              ))}
            </div>

            {/* RIGHT SIDE: QF */}
            <div className="flex flex-col gap-8 justify-around h-full">
              {bracket.right.QTR.map((m) => (
                <MiniMatchCell
                  key={m.matchNumber}
                  match={m}
                  hovered={hoveredMatch}
                  onHover={setHoveredMatch}
                />
              ))}
            </div>

            {/* RIGHT SIDE: R16 */}
            <div className="flex flex-col gap-3 justify-around h-full">
              {bracket.right.R16.map((m) => (
                <MiniMatchCell
                  key={m.matchNumber}
                  match={m}
                  hovered={hoveredMatch}
                  onHover={setHoveredMatch}
                />
              ))}
            </div>

            {/* RIGHT SIDE: R32 */}
            <div className="flex flex-col gap-1">
              {bracket.right.R32.map((m) => (
                <MiniMatchCell
                  key={m.matchNumber}
                  match={m}
                  hovered={hoveredMatch}
                  onHover={setHoveredMatch}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Detailed Stage View ─── */}
      <section className="px-6 sm:px-10 md:px-20 max-w-[1600px] mx-auto py-16">
        <div className="flex items-center gap-6 mb-10">
          <span className="block h-px flex-1 bg-foreground/10" />
          <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.4em] text-foreground/30">
            All Knockout Matches
          </span>
          <span className="block h-px flex-1 bg-foreground/10" />
        </div>

        {/* Render each stage */}
        {[...STAGE_ORDER, "BRZ" as const].map((stageCode) => {
          const stageMatches = bracketData.matches
            .filter((m) => m.stageCode === stageCode)
            .sort(
              (a, b) =>
                new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
            );
          if (stageMatches.length === 0) return null;
          const color = STAGE_COLORS[stageCode] || "#ef4444";

          return (
            <div key={stageCode} className="mb-14">
              <Reveal>
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <h3
                    className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold uppercase"
                    style={{ color }}
                  >
                    {STAGE_LABELS[stageCode] || stageCode}
                  </h3>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-foreground/40">
                    — {stageMatches.length} match
                    {stageMatches.length !== 1 ? "es" : ""}
                  </span>
                </div>
              </Reveal>

              <div
                className={`grid gap-4 ${
                  stageCode === "FNL" || stageCode === "BRZ"
                    ? "grid-cols-1 max-w-md"
                    : stageCode === "SMF"
                    ? "grid-cols-1 sm:grid-cols-2 max-w-2xl"
                    : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
                }`}
              >
                {stageMatches.map((match, i) => (
                  <Reveal key={match.matchNumber} delay={Math.min(i * 60, 400)} y={12}>
                    <DetailedMatchCard match={match} />
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ─── CTA Section ─── */}
      <section className="relative px-6 sm:px-10 md:px-20 max-w-[1600px] mx-auto py-20 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[400px] rounded-full opacity-[0.08]"
          style={{
            background:
              "radial-gradient(closest-side, #d4a843 0%, transparent 70%)",
          }}
        />
        <Reveal>
          <div className="relative z-[1] flex flex-col items-center text-center">
            <Crown className="h-10 w-10 text-gold mb-6" />
            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-foreground mb-4">
              Secure Your Knockout{" "}
              <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight text-gold">
                Experience.
              </span>
            </h2>
            <p className="text-foreground/50 max-w-lg text-base mb-8">
              Premium hospitality packages for every knockout match. Be there
              when history is made.
            </p>
            <Link
              href="/matches"
              className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-4 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-background transition hover:bg-foreground"
            >
              Browse All Matches
              <ArrowUpRight className="h-4 w-4 group-hover:rotate-45 transition-transform duration-300" />
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}

/* ─────────── Mini Match Cell (bracket view) ─────────── */
function MiniMatchCell({
  match,
  hovered,
  onHover,
  large,
}: {
  match: BracketMatch;
  hovered: number | null;
  onHover: (n: number | null) => void;
  large?: boolean;
}) {
  const color = STAGE_COLORS[match.stageCode] || "#d4a843";
  const isHovered = hovered === match.matchNumber;

  return (
    <Link
      href={`/matches/${match.matchNumber}`}
      onMouseEnter={() => onHover(match.matchNumber)}
      onMouseLeave={() => onHover(null)}
      className={`group relative block rounded-lg border transition-all duration-300 ${
        large ? "px-3 py-3" : "px-2 py-1.5"
      } ${
        isHovered
          ? "border-foreground/30 bg-surface/80 scale-[1.03] z-10"
          : "border-foreground/[0.07] bg-surface/20 hover:bg-surface/50 hover:border-foreground/15"
      }`}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-2 right-2 h-[1px] rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}${isHovered ? "80" : "30"}, transparent)`,
        }}
      />

      {/* Match number */}
      <div className="flex items-center justify-between mb-1">
        <span
          className="font-[family-name:var(--font-mono)] text-[8px] font-bold"
          style={{ color: isHovered ? color : undefined }}
        >
          M{match.matchNumber}
        </span>
        {large && (
          <span className="font-[family-name:var(--font-mono)] text-[7px] text-foreground/30">
            {match.matchDateLabel}
          </span>
        )}
      </div>

      {/* Slots */}
      <div className={`flex flex-col ${large ? "gap-1.5" : "gap-0.5"}`}>
        <div className="flex items-center gap-1.5">
          <div
            className={`${large ? "w-5 h-5" : "w-4 h-4"} rounded flex items-center justify-center font-[family-name:var(--font-mono)] font-bold`}
            style={{
              fontSize: large ? "7px" : "6px",
              backgroundColor: `${color}12`,
              color,
              border: `1px solid ${color}20`,
            }}
          >
            {match.homeSlot.substring(0, 2)}
          </div>
          <span className={`${large ? "text-[10px]" : "text-[9px]"} text-foreground/70 truncate`}>
            {match.homeSlot}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className={`${large ? "w-5 h-5" : "w-4 h-4"} rounded flex items-center justify-center font-[family-name:var(--font-mono)] font-bold`}
            style={{
              fontSize: large ? "7px" : "6px",
              backgroundColor: `${color}12`,
              color,
              border: `1px solid ${color}20`,
            }}
          >
            {match.awaySlot.substring(0, 2)}
          </div>
          <span className={`${large ? "text-[10px]" : "text-[9px]"} text-foreground/70 truncate`}>
            {match.awaySlot}
          </span>
        </div>
      </div>

      {/* Venue on hover/large */}
      {large && (
        <div className="flex items-center gap-1 mt-2">
          <MapPin className="h-2.5 w-2.5 text-foreground/25" />
          <span className="text-[8px] text-foreground/35 truncate">
            {match.venue.city}
          </span>
        </div>
      )}
    </Link>
  );
}

/* ─────────── Final Match Cell ─────────── */
function FinalMatchCell({
  match,
  hovered,
  onHover,
}: {
  match: BracketMatch;
  hovered: number | null;
  onHover: (n: number | null) => void;
}) {
  const isHovered = hovered === match.matchNumber;

  return (
    <Link
      href={`/matches/${match.matchNumber}`}
      onMouseEnter={() => onHover(match.matchNumber)}
      onMouseLeave={() => onHover(null)}
      className={`group relative block rounded-2xl border px-5 py-5 transition-all duration-500 ${
        isHovered
          ? "border-gold/50 bg-surface/80 scale-105 shadow-[0_0_40px_-8px_rgba(212,168,67,0.3)]"
          : "border-gold/20 bg-surface/30 hover:border-gold/40"
      }`}
    >
      {/* Crown */}
      <div className="flex justify-center mb-3">
        <Crown className="h-6 w-6 text-gold" />
      </div>

      {/* Top accent gradient */}
      <div
        className="absolute top-0 left-3 right-3 h-[2px] rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, #d4a843, transparent)",
        }}
      />

      <div className="text-center mb-3">
        <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-gold/80">
          Match {match.matchNumber} · Final
        </span>
      </div>

      {/* Slots */}
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-[family-name:var(--font-mono)] text-[9px] font-bold"
            style={{
              backgroundColor: "#d4a84315",
              color: "#d4a843",
              border: "1px solid #d4a84330",
            }}
          >
            {match.homeSlot.substring(0, 3)}
          </div>
          <span className="text-[11px] text-foreground/80 font-medium">
            {match.homeSlot}
          </span>
        </div>

        <span className="font-[family-name:var(--font-display)] text-[9px] uppercase tracking-[0.2em] text-foreground/25 px-2">
          VS
        </span>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-foreground/80 font-medium">
            {match.awaySlot}
          </span>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-[family-name:var(--font-mono)] text-[9px] font-bold"
            style={{
              backgroundColor: "#d4a84315",
              color: "#d4a843",
              border: "1px solid #d4a84330",
            }}
          >
            {match.awaySlot.substring(0, 3)}
          </div>
        </div>
      </div>

      {/* Venue */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        <MapPin className="h-3 w-3 text-gold/50" />
        <span className="text-[10px] text-foreground/45">
          {match.venue.stadium}, {match.venue.city}
        </span>
      </div>

      {/* Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.08) 0%, transparent 70%)",
        }}
      />
    </Link>
  );
}

/* ─────────── Detailed Match Card (list view) ─────────── */
function DetailedMatchCard({ match }: { match: BracketMatch }) {
  const color = STAGE_COLORS[match.stageCode] || "#d4a843";
  const isFinalOrSemi = ["SMF", "BRZ", "FNL"].includes(match.stageCode);

  function formatSlotLabel(slot: string): string {
    if (slot.startsWith("W")) return `Winner M${slot.substring(1)}`;
    if (slot.startsWith("L")) return `Loser M${slot.substring(1)}`;
    return slot;
  }

  return (
    <Link
      href={`/matches/${match.matchNumber}`}
      className="group relative flex flex-col h-full rounded-2xl border border-foreground/10 bg-surface/30 overflow-hidden transition-all duration-500 hover:border-foreground/25 hover:shadow-[0_0_60px_-12px_rgba(212,168,67,0.12)]"
    >
      {/* Top gradient accent */}
      <div
        className="h-[2px] w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded-md font-[family-name:var(--font-mono)] text-[9px] font-bold"
            style={{
              backgroundColor: `${color}12`,
              color,
              border: `1px solid ${color}25`,
            }}
          >
            {match.matchNumber}
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-foreground/35">
            Match
          </span>
        </div>
        {isFinalOrSemi && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-[family-name:var(--font-mono)] uppercase tracking-[0.15em] border backdrop-blur-sm"
            style={{
              color,
              backgroundColor: `${color}10`,
              borderColor: `${color}30`,
            }}
          >
            <Sparkles className="h-2.5 w-2.5" />
            {STAGE_LABELS[match.stageCode]}
          </span>
        )}
      </div>

      {/* Matchup */}
      <div className="px-5 py-4 flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-[family-name:var(--font-mono)] text-[10px] font-bold"
              style={{
                backgroundColor: `${color}10`,
                color,
                border: `1px solid ${color}25`,
              }}
            >
              {match.homeSlot.length > 3
                ? match.homeSlot.substring(0, 3)
                : match.homeSlot}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-foreground/80 font-medium leading-tight">
                {formatSlotLabel(match.homeSlot)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-1">
            <div className="flex-1 h-px bg-foreground/[0.06]" />
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center border"
              style={{
                borderColor: `${color}20`,
                backgroundColor: `${color}06`,
              }}
            >
              <span
                className="font-[family-name:var(--font-display)] text-[7px] uppercase"
                style={{ color: `${color}80` }}
              >
                VS
              </span>
            </div>
            <div className="flex-1 h-px bg-foreground/[0.06]" />
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-[family-name:var(--font-mono)] text-[10px] font-bold"
              style={{
                backgroundColor: `${color}10`,
                color,
                border: `1px solid ${color}25`,
              }}
            >
              {match.awaySlot.length > 3
                ? match.awaySlot.substring(0, 3)
                : match.awaySlot}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-foreground/80 font-medium leading-tight">
                {formatSlotLabel(match.awaySlot)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-foreground/[0.06] bg-surface/50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-foreground/30" />
              <span
                className="text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-[0.1em]"
                style={{ color }}
              >
                {match.matchDateLabel}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-foreground/30" />
              <span className="text-[10px] text-foreground/40 truncate max-w-[140px]">
                {match.venue.stadium}
              </span>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
            <ArrowUpRight className="h-4 w-4 text-foreground/40 group-hover:rotate-45 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${color}08 0%, transparent 70%)`,
        }}
      />

      {/* Bottom line on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />
    </Link>
  );
}
