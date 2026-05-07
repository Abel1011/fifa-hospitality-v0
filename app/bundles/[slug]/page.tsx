"use client";

import { use, useState, useId } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Users,
  Trophy,
  Ticket,
  Star,
  ShieldCheck,
  Loader2,
  Check,
  CreditCard,
  Sparkles,
  Crown,
  Wine,
  UtensilsCrossed,
  Music,
  Car,
  Gift,
  Armchair,
  Headset,
  GlassWater,
  ChevronRight,
  Calendar,
} from "lucide-react";
import Header from "@/components/fifa/Header";
import Footer from "@/components/fifa/Footer";
import Reveal from "@/components/fifa/Reveal";
import matchData from "@content/hospitality-pricing-usd.json";

type PurchaseStep = "idle" | "checkout" | "processing" | "success";
type TierIconId = "crown" | "trophy" | "sparkles" | "ticket" | "star";

function TierIcon({ id, className, style }: { id: TierIconId; className?: string; style?: React.CSSProperties }) {
  const props = { className, style };
  switch (id) {
    case "crown": return <Crown {...props} />;
    case "trophy": return <Trophy {...props} />;
    case "sparkles": return <Sparkles {...props} />;
    case "ticket": return <Ticket {...props} />;
    case "star": return <Star {...props} />;
  }
}

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

/* Venue code to map image slug */
const VENUE_MAP_SLUGS: Record<string, string> = {
  NN_KC: "KC",
  NN_LA: "LA",
  NN_NYNJ: "NYNJ",
  NN_DAL: "DAL",
  NN_MIA: "MIA",
  NN_ATL: "ATL",
  NN_HOU: "HOU",
  NN_PHL: "PHL",
  NN_BOS: "BOS",
  NN_SEA: "SEA",
  NN_SFBA: "SFBA",
  NN_TOR: "TOR",
  NN_VAN: "VAN",
  NN_GDL: "GDL",
  NN_CDMX: "CDMX",
  NN_MTY: "MTY",
};

const VENUE_MAP_FALLBACK = "/images/venue_map.webp";

function getVenueMapUrl(venueCode: string): string {
  const slug = VENUE_MAP_SLUGS[venueCode];
  if (!slug) return VENUE_MAP_FALLBACK;
  return `/images/venues/venue_map_${slug}.jpg`;
}

/* Lounge images (local) */
const LOUNGE_IMAGES: Record<string, string> = {
  PSL: "/images/lounges/pitchside.png",
  TL: "/images/lounges/trophy.png",
  CL: "/images/lounges/champions.png",
  FP: "/images/lounges/pavilion.png",
  VIP: "/images/lounges/pitchside.png",
};

/* Pitch lines SVG background */
function PitchLines({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect x="10" y="10" width="380" height="240" rx="2" stroke="currentColor" strokeWidth="0.8" />
      <line x1="200" y1="10" x2="200" y2="250" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="200" cy="130" r="40" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="200" cy="130" r="2" fill="currentColor" />
      <rect x="10" y="70" width="60" height="120" stroke="currentColor" strokeWidth="0.5" />
      <rect x="330" y="70" width="60" height="120" stroke="currentColor" strokeWidth="0.5" />
      <rect x="10" y="95" width="25" height="70" stroke="currentColor" strokeWidth="0.4" />
      <rect x="365" y="95" width="25" height="70" stroke="currentColor" strokeWidth="0.4" />
    </svg>
  );
}

const TIER_META: Record<string, {
  color: string;
  iconId: TierIconId;
  seating: string;
  hospitality: string;
  arrival: string;
  guestRelations: string;
  beverages: string;
  culinary: string;
  entertainment: string;
  parking: string;
  gifting: string;
}> = {
  PSL: {
    color: "#d4a843",
    iconId: "crown",
    seating: "Premier Sideline Seating: Premium seats located along the sidelines, offering an exceptional view of the action",
    hospitality: "Pre-Match / Halftime / Post-Match hospitality service",
    arrival: "Champagne on arrival, including crafted cocktails and mocktails",
    guestRelations: "Dedicated guest relations team",
    beverages: "Premium Champagne, wine, beer and spirits, mocktails and variety of soft drinks",
    culinary: "Tailored dining experience, with curated stations highlighting regional flavors and culinary traditions",
    entertainment: "Special guest appearances, photo opportunities, live entertainment",
    parking: "On-site Parking (subject to availability)",
    gifting: "Premium Gift",
  },
  TL: {
    color: "#1a8a3e",
    iconId: "trophy",
    seating: "Category 1 Premium Seating: Elevated sideline views with optimal sightlines",
    hospitality: "Pre-Match / Halftime / Post-Match hospitality service",
    arrival: "Welcome drink on arrival with curated cocktail selection",
    guestRelations: "Dedicated guest relations team",
    beverages: "Premium wine, beer, spirits selection and soft drinks",
    culinary: "Curated culinary experience with regional specialties and international cuisine",
    entertainment: "Live entertainment and interactive fan experiences",
    parking: "On-site Parking (subject to availability)",
    gifting: "Commemorative Gift",
  },
  CL: {
    color: "#8b5cf6",
    iconId: "sparkles",
    seating: "Category 1 Seating: Premium bowl positioning with excellent views",
    hospitality: "Pre-Match / Post-Match hospitality service",
    arrival: "Welcome beverage on arrival",
    guestRelations: "Guest relations support",
    beverages: "Wine, beer, spirits and soft drinks included",
    culinary: "All-inclusive dining with gourmet food stations",
    entertainment: "Live entertainment programme and fan activations",
    parking: "On-site Parking (subject to availability)",
    gifting: "Official FIFA Merchandise",
  },
  FP: {
    color: "#ef4444",
    iconId: "ticket",
    seating: "Category 2 Seating: Great views from a dedicated section",
    hospitality: "Pre-Match hospitality service",
    arrival: "Welcome drink on arrival",
    guestRelations: "Guest relations support",
    beverages: "Beer, wine, soft drinks and water included",
    culinary: "Food & beverage included with quality dining options",
    entertainment: "Live pre-match entertainment and activations",
    parking: "Parking available (subject to availability)",
    gifting: "Official Programme",
  },
  VIP: {
    color: "#00c8ff",
    iconId: "star",
    seating: "Premium Elevated Seating: Best-in-class views from an elevated position",
    hospitality: "Pre-Match / Halftime / Post-Match hospitality service",
    arrival: "Champagne and cocktails on arrival",
    guestRelations: "Dedicated VIP guest relations",
    beverages: "Premium Champagne, fine wines, spirits, cocktails and soft drinks",
    culinary: "Gourmet multi-course dining experience with world-class chefs",
    entertainment: "Exclusive entertainment, meet & greet opportunities",
    parking: "VIP Parking included",
    gifting: "Premium Gift Bag",
  },
};

export default function BundleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const productCode = `${slug.toUpperCase()}_VS`;
  const venue = matchData.venueSeries.find(
    (v) => v.productCode === productCode
  );

  const [selectedTier, setSelectedTier] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [purchaseStep, setPurchaseStep] = useState<PurchaseStep>("idle");
  const [form, setForm] = useState({ name: "", email: "", card: "", expiry: "", cvv: "" });
  const uid = useId();

  if (!venue) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-20 text-center px-4">
          <MapPin className="h-16 w-16 text-foreground/20 mx-auto mb-6" />
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-3">
            Bundle Not Found
          </h1>
          <p className="text-foreground/50 mb-6">
            The venue series &ldquo;{slug}&rdquo; doesn&apos;t exist.
          </p>
          <Link
            href="/bundles"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all bundles
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const matchDetails = venue.matchNumbers
    .map((num) => matchData.singleMatch.find((m) => m.matchNumber === num))
    .filter(Boolean) as (typeof matchData.singleMatch)[number][];

  const groupStageMatches = matchDetails.filter((m) => m.stageCode === "GST");
  const knockoutMatches = matchDetails.filter((m) => m.stageCode !== "GST");

  const currentOffering = venue.offerings.find((o) => o.id === selectedTier);
  const currentTier = TIER_META[selectedTier] || TIER_META.PSL;
  const totalPrice = (currentOffering?.usdStartingPrice || 0) * quantity;
  const venueMapUrl = getVenueMapUrl(venue.venueCode);

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setPurchaseStep("processing");
    setTimeout(() => setPurchaseStep("success"), 2500);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* CINEMATIC HERO */}
      <section className="relative pt-20 sm:pt-24 pb-0 overflow-hidden">
        <div className="relative z-[1] px-4 sm:px-6 md:px-10 max-w-[1200px] mx-auto">
          <Link
            href="/bundles"
            className="inline-flex items-center gap-2 text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider text-foreground/40 hover:text-accent transition mb-8"
          >
            <ArrowLeft className="h-3 w-3" />
            All Bundles
          </Link>

          <Reveal>
            <div className="relative rounded-3xl overflow-hidden border border-foreground/[0.07] bg-card">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

              <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-foreground/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gold/10 border border-gold/20">
                    <Trophy className="h-3.5 w-3.5 text-gold" />
                  </div>
                  <div>
                    <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/40 block">
                      FIFA World Cup 2026&trade;
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-gold/80">
                      Venue Series Bundle
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/[0.04] border border-foreground/[0.08]">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-pulse" />
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-foreground/50">
                    {venue.totalMatches} Matches
                  </span>
                </div>
              </div>

              {/* Stadium Hero Zone */}
              <div className="flex items-center justify-center py-14 sm:py-20 px-6 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/stadium-hero.jpg"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-background/80 backdrop-blur-sm border-2 border-gold/30 flex items-center justify-center mb-5 shadow-[0_0_50px_rgba(212,168,67,0.15)]">
                    <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-gold" />
                  </div>
                  <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 drop-shadow-lg">
                    {venue.venue.city}
                  </h1>
                  <p className="font-[family-name:var(--font-serif)] text-foreground/70 italic text-base sm:text-lg drop-shadow-md">
                    {venue.venue.stadium} &middot; {venue.country}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 border-t border-foreground/[0.06]">
                <div className="flex items-center justify-center gap-2.5 py-5 px-3 border-r border-foreground/[0.06]">
                  <Calendar className="h-4 w-4 text-accent/70" />
                  <div>
                    <p className="text-[9px] text-foreground/35 uppercase font-[family-name:var(--font-mono)] tracking-wider">Matches</p>
                    <p className="text-xs sm:text-sm text-foreground/80 font-medium">{venue.totalMatches} included</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2.5 py-5 px-3 border-r border-foreground/[0.06]">
                  <Ticket className="h-4 w-4 text-accent/70" />
                  <div>
                    <p className="text-[9px] text-foreground/35 uppercase font-[family-name:var(--font-mono)] tracking-wider">Starting From</p>
                    <p className="text-xs sm:text-sm text-foreground/80 font-medium">{formatPrice(venue.usdStartingPrice)} /pp</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2.5 py-5 px-3">
                  <Star className="h-4 w-4 text-accent/70" />
                  <div>
                    <p className="text-[9px] text-foreground/35 uppercase font-[family-name:var(--font-mono)] tracking-wider">Tiers</p>
                    <p className="text-xs sm:text-sm text-foreground/80 font-medium">{venue.offerings.length} options</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VENUE MAP SECTION */}
      <section className="px-4 sm:px-6 md:px-10 max-w-[1200px] mx-auto py-12 sm:py-16">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-2xl overflow-hidden border border-foreground/[0.07] aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={venueMapUrl}
                alt={`${venue.venue.stadium} seating map`}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = VENUE_MAP_FALLBACK; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-foreground/10">
                  <MapPin className="h-3 w-3 text-accent" />
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-foreground/70">
                    Venue Seating Map
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-accent/70 mb-3">
                Your Venue
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-foreground mb-4">
                {venue.venue.stadium}
              </h2>
              <p className="font-[family-name:var(--font-serif)] text-foreground/50 italic text-base mb-6">
                {venue.venue.city}, {venue.country}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06]">
                  <Calendar className="h-4 w-4 text-gold/70" />
                  <div>
                    <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase text-foreground/40 block">Total Matches</span>
                    <span className="text-sm text-foreground/80">{venue.totalMatches} matches across Group Stage &amp; Knockout rounds</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06]">
                  <Ticket className="h-4 w-4 text-gold/70" />
                  <div>
                    <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase text-foreground/40 block">Starting From</span>
                    <span className="text-sm text-foreground/80 font-semibold">{formatPrice(venue.usdStartingPrice)} per person for all {venue.totalMatches} matches</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06]">
                  <Trophy className="h-4 w-4 text-gold/70" />
                  <div>
                    <span className="text-[10px] font-[family-name:var(--font-mono)] uppercase text-foreground/40 block">Per Match</span>
                    <span className="text-sm text-foreground/80">Approximately {formatPrice(venue.usdStartingPrice / venue.totalMatches)} per match</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* INCLUDED MATCHES */}
      <section className="px-4 sm:px-6 md:px-10 max-w-[1200px] mx-auto py-16 sm:py-20 border-t border-foreground/[0.04]">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pitch/[0.06] border border-pitch/15 mb-4">
              <CalendarDays className="h-3 w-3 text-pitch" />
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-pitch/80">
                Included Matches
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Your Match Schedule
            </h2>
            <p className="font-[family-name:var(--font-serif)] text-foreground/45 italic text-base max-w-lg mx-auto">
              All {venue.totalMatches} matches at {venue.venue.stadium} included in your series bundle
            </p>
          </div>
        </Reveal>

        {groupStageMatches.length > 0 && (
          <div className="mb-10">
            <Reveal delay={50}>
              <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-pitch mb-5 flex items-center gap-2">
                <Users className="h-3.5 w-3.5" />
                Group Stage ({groupStageMatches.length} matches)
              </h3>
            </Reveal>
            <div className="space-y-2">
              {groupStageMatches.map((m, idx) => (
                <Reveal key={m.matchNumber} delay={80 + idx * 40}>
                  <div className="relative flex items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-card border border-border rounded-xl hover:border-pitch/30 transition group overflow-hidden">
                    {/* Left accent line */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-pitch/50 via-pitch/20 to-transparent" />
                    {/* Match number */}
                    <div className="flex-shrink-0 w-12 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-pitch/[0.08] border border-pitch/10">
                        <span className="font-[family-name:var(--font-mono)] text-[10px] text-pitch/70 font-medium">
                          M{m.matchNumber}
                        </span>
                      </span>
                    </div>
                    {/* Match info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground leading-tight truncate">
                        {m.homeTeam.name || "TBD"} vs {m.awayTeam.name || "TBD"}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-foreground/45">
                        <CalendarDays className="h-3 w-3 text-pitch/50 flex-shrink-0" />
                        <span className="text-xs">{formatDate(m.date)}</span>
                        <span className="text-foreground/20">·</span>
                        <span className="text-xs">{m.kickoffLabel?.split(",")[1]?.trim()}</span>
                        <span className="text-foreground/20 hidden sm:inline">·</span>
                        <span className="text-[10px] text-foreground/30 font-[family-name:var(--font-mono)] uppercase tracking-wider hidden sm:inline">
                          {m.stageLabel}
                        </span>
                      </div>
                    </div>
                    {/* View button */}
                    <Link
                      href={`/matches/${m.matchNumber}`}
                      className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-pitch/[0.08] border border-pitch/20 text-pitch hover:bg-pitch/[0.15] hover:border-pitch/40 transition"
                    >
                      <Ticket className="h-3 w-3" />
                      <span className="hidden sm:inline">View Match</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {knockoutMatches.length > 0 && (
          <div>
            <Reveal delay={50}>
              <h3 className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-gold mb-5 flex items-center gap-2">
                <Trophy className="h-3.5 w-3.5" />
                Knockout Stage ({knockoutMatches.length} matches)
              </h3>
            </Reveal>
            <div className="space-y-2">
              {knockoutMatches.map((m, idx) => (
                <Reveal key={m.matchNumber} delay={80 + idx * 40}>
                  <div className="relative flex items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-card border border-border rounded-xl hover:border-gold/30 transition group overflow-hidden">
                    {/* Left accent line */}
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gold/50 via-gold/20 to-transparent" />
                    {/* Match number */}
                    <div className="flex-shrink-0 w-12 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-gold/[0.08] border border-gold/10">
                        <span className="font-[family-name:var(--font-mono)] text-[10px] text-gold/70 font-medium">
                          M{m.matchNumber}
                        </span>
                      </span>
                    </div>
                    {/* Match info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground leading-tight truncate">
                        {m.homeTeam.name || "TBD"} vs {m.awayTeam.name || "TBD"}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-foreground/45">
                        <CalendarDays className="h-3 w-3 text-gold/50 flex-shrink-0" />
                        <span className="text-xs">{formatDate(m.date)}</span>
                        <span className="text-foreground/20">·</span>
                        <span className="text-xs">{m.kickoffLabel?.split(",")[1]?.trim()}</span>
                        <span className="text-foreground/20 hidden sm:inline">·</span>
                        <span className="text-[10px] text-foreground/30 font-[family-name:var(--font-mono)] uppercase tracking-wider hidden sm:inline">
                          {m.stageLabel}
                        </span>
                      </div>
                    </div>
                    {/* View button */}
                    <Link
                      href={`/matches/${m.matchNumber}`}
                      className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-gold/[0.08] border border-gold/20 text-gold hover:bg-gold/[0.15] hover:border-gold/40 transition"
                    >
                      <Ticket className="h-3 w-3" />
                      <span className="hidden sm:inline">View Match</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* HOSPITALITY TIERS */}
      <section className="px-4 sm:px-6 md:px-10 max-w-[1200px] mx-auto py-16 sm:py-20 border-t border-foreground/[0.04]">
        <Reveal>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/[0.06] border border-gold/15 mb-4">
              <Sparkles className="h-3 w-3 text-gold" />
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-gold/80">
                Hospitality Packages
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Choose Your Experience
            </h2>
            <p className="font-[family-name:var(--font-serif)] text-foreground/45 italic text-base max-w-lg mx-auto">
              Premium hospitality for all {venue.totalMatches} matches at {venue.venue.stadium}
            </p>
          </div>
        </Reveal>

        <div className="space-y-6">
          {venue.offerings.map((offering, idx) => {
            const tier = TIER_META[offering.id] || TIER_META.FP;
            const isSelected = selectedTier === offering.id;
            const isPremium = offering.id === "PSL";
            const loungeImg = LOUNGE_IMAGES[offering.id] || LOUNGE_IMAGES.FP;

            return (
              <Reveal key={offering.id} delay={idx * 100}>
                <div
                  className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                    isSelected
                      ? "ring-2 shadow-lg"
                      : offering.isAvailable
                      ? "hover:shadow-md"
                      : "opacity-50"
                  }`}
                  style={{
                    borderColor: isSelected ? tier.color : `${tier.color}20`,
                    ringColor: tier.color,
                    boxShadow: isSelected ? `0 8px 40px ${tier.color}15` : undefined,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-card to-[#0b1525]" />

                  <div className="relative grid grid-cols-1 lg:grid-cols-12">
                    {/* Lounge Image */}
                    <div className="lg:col-span-4 relative min-h-[200px] lg:min-h-[320px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={loungeImg}
                        alt={`${offering.name} lounge`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80 hidden lg:block" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent lg:hidden" />
                      {isPremium && (
                        <div className="absolute top-4 left-4 z-10">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/20 backdrop-blur-sm border border-gold/40">
                            <Crown className="h-3 w-3 text-gold" />
                            <span className="text-[9px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-gold font-bold">
                              Premium
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-8 p-6 sm:p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center border"
                            style={{ background: `${tier.color}10`, borderColor: `${tier.color}25` }}
                          >
                            <TierIcon id={tier.iconId} className="h-5 w-5" style={{ color: tier.color }} />
                          </div>
                          <div>
                            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-foreground">
                              {offering.name}
                            </h3>
                            {!offering.isAvailable ? (
                              <span className="text-[10px] uppercase tracking-wider text-red-400 font-medium">Sold Out</span>
                            ) : (
                              <p className="text-[11px] text-foreground/40 font-[family-name:var(--font-mono)] mt-0.5">
                                {tier.seating.split(":")[0]}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-foreground/35 uppercase font-[family-name:var(--font-mono)] tracking-wider block">Total from</span>
                          <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold" style={{ color: tier.color }}>
                            {formatPrice(offering.usdStartingPrice)}
                          </span>
                          <span className="text-[10px] text-foreground/30 font-[family-name:var(--font-mono)] block">
                            /pp &middot; {venue.totalMatches} matches
                          </span>
                          <span className="text-[9px] text-foreground/25 font-[family-name:var(--font-mono)] block mt-0.5">
                            &asymp; {formatPrice(offering.usdStartingPrice / venue.totalMatches)} per match
                          </span>
                        </div>
                      </div>

                      {/* Key Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05]">
                          <Armchair className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                          <div>
                            <span className="text-[9px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-foreground/40 block">Seating</span>
                            <span className="text-xs text-foreground/70 leading-relaxed">{tier.seating.split(":")[1]?.trim() || tier.seating}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05]">
                          <GlassWater className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                          <div>
                            <span className="text-[9px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-foreground/40 block">Arrival</span>
                            <span className="text-xs text-foreground/70 leading-relaxed">{tier.arrival}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05]">
                          <Wine className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                          <div>
                            <span className="text-[9px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-foreground/40 block">Beverages</span>
                            <span className="text-xs text-foreground/70 leading-relaxed">{tier.beverages}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05]">
                          <UtensilsCrossed className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                          <div>
                            <span className="text-[9px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-foreground/40 block">Culinary</span>
                            <span className="text-xs text-foreground/70 leading-relaxed">{tier.culinary}</span>
                          </div>
                        </div>
                      </div>

                      {/* Amenities pills */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/[0.03] border border-foreground/[0.06]">
                          <Music className="h-3 w-3 text-foreground/40" />
                          <span className="text-[10px] text-foreground/50">Entertainment</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/[0.03] border border-foreground/[0.06]">
                          <Car className="h-3 w-3 text-foreground/40" />
                          <span className="text-[10px] text-foreground/50">Parking</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/[0.03] border border-foreground/[0.06]">
                          <Gift className="h-3 w-3 text-foreground/40" />
                          <span className="text-[10px] text-foreground/50">{tier.gifting}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/[0.03] border border-foreground/[0.06]">
                          <Headset className="h-3 w-3 text-foreground/40" />
                          <span className="text-[10px] text-foreground/50">{tier.guestRelations}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      {offering.isAvailable && (
                        <button
                          onClick={() => {
                            setSelectedTier(offering.id);
                            setPurchaseStep("checkout");
                            setQuantity(1);
                          }}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold font-[family-name:var(--font-display)] transition-all active:scale-[0.98] cursor-pointer"
                          style={{
                            background: isSelected ? tier.color : `${tier.color}12`,
                            color: isSelected ? "#070e18" : tier.color,
                            border: `1px solid ${tier.color}${isSelected ? "ff" : "40"}`,
                            boxShadow: isSelected ? `0 4px 20px ${tier.color}30` : undefined,
                          }}
                        >
                          <Ticket className="h-4 w-4" />
                          {isSelected ? "Selected" : "Select Package"}
                          {!isSelected && <ChevronRight className="h-3.5 w-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* CHECKOUT SECTION */}
      {purchaseStep !== "idle" && currentOffering && (
        <section id="checkout" className="px-4 sm:px-6 md:px-10 max-w-[700px] mx-auto pb-16">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden border border-foreground/[0.07]">
              <div className="absolute inset-0 bg-gradient-to-b from-[#070e18] via-[#0b1525] to-[#060d17]" />
              <PitchLines className="absolute inset-0 w-full h-full text-pitch/[0.03] pointer-events-none" />
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[350px] h-[180px] rounded-full bg-gold/[0.05] blur-[80px] pointer-events-none" />

              <div className="relative">
                {/* CHECKOUT FORM */}
                {purchaseStep === "checkout" && (
                  <form onSubmit={handlePurchase} className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-gold/70 block">
                          Secure Checkout
                        </span>
                        <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground mt-1">
                          Complete Your Purchase
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setPurchaseStep("idle"); setSelectedTier(""); }}
                        className="text-[11px] font-[family-name:var(--font-mono)] text-foreground/40 hover:text-foreground transition uppercase tracking-wider cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div
                      className="p-4 rounded-xl border mb-6"
                      style={{ borderColor: `${currentTier.color}25`, background: `${currentTier.color}05` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TierIcon id={currentTier.iconId} className="h-5 w-5" style={{ color: currentTier.color }} />
                          <div>
                            <p className="font-[family-name:var(--font-display)] text-sm font-bold text-foreground">
                              {currentOffering.name}
                            </p>
                            <p className="text-[11px] text-foreground/40 font-[family-name:var(--font-mono)]">
                              {venue.venue.city} &middot; {venue.totalMatches} matches
                            </p>
                          </div>
                        </div>
                        <span className="font-[family-name:var(--font-display)] text-lg font-bold" style={{ color: currentTier.color }}>
                          {formatPrice(currentOffering.usdStartingPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-2">
                        Quantity
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setQuantity(n)}
                            className={`w-10 h-10 rounded-lg text-sm font-bold transition border cursor-pointer ${
                              quantity === n
                                ? "bg-pitch/15 border-pitch/40 text-pitch"
                                : "bg-foreground/[0.03] border-foreground/10 text-foreground/50 hover:border-foreground/20"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`${uid}-name`} className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Full Name</label>
                          <input id={`${uid}-name`} type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.08)] transition" />
                        </div>
                        <div>
                          <label htmlFor={`${uid}-email`} className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Email</label>
                          <input id={`${uid}-email`} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.08)] transition" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`${uid}-card`} className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Card Number</label>
                        <div className="relative">
                          <input id={`${uid}-card`} type="text" required value={form.card} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 16); const formatted = v.replace(/(.{4})/g, "$1 ").trim(); setForm({ ...form, card: formatted }); }} placeholder="4242 4242 4242 4242" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.08)] transition font-[family-name:var(--font-mono)]" />
                          <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`${uid}-expiry`} className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Expiry</label>
                          <input id={`${uid}-expiry`} type="text" required value={form.expiry} onChange={(e) => { let v = e.target.value.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); setForm({ ...form, expiry: v }); }} placeholder="MM/YY" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.08)] transition font-[family-name:var(--font-mono)]" />
                        </div>
                        <div>
                          <label htmlFor={`${uid}-cvv`} className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">CVV</label>
                          <input id={`${uid}-cvv`} type="text" required value={form.cvv} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setForm({ ...form, cvv: v }); }} placeholder="123" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.08)] transition font-[family-name:var(--font-mono)]" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-foreground/[0.06]">
                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <span className="block text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-foreground/40">Total</span>
                          <span className="block font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mt-0.5">{formatPrice(totalPrice)}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] font-[family-name:var(--font-mono)] text-foreground/30">{currentOffering.name}</span>
                          <span className="block text-[10px] font-[family-name:var(--font-mono)] text-foreground/30 mt-0.5">&times; {quantity} {quantity === 1 ? "bundle" : "bundles"} &middot; {venue.totalMatches} matches each</span>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="group w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-[#c49a38] text-background font-[family-name:var(--font-display)] font-bold text-sm tracking-wide hover:from-gold/90 hover:to-[#b8903a] transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(212,168,67,0.2)] cursor-pointer"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <ShieldCheck className="h-4 w-4 opacity-70" />
                          Confirm Purchase
                        </span>
                      </button>
                      <p className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-foreground/30 font-[family-name:var(--font-mono)]">
                        <span className="w-1 h-1 rounded-full bg-pitch/50" />
                        Simulated transaction &middot; No real charge
                        <span className="w-1 h-1 rounded-full bg-pitch/50" />
                      </p>
                    </div>
                  </form>
                )}

                {/* PROCESSING */}
                {purchaseStep === "processing" && (
                  <div className="px-6 py-20 flex flex-col items-center justify-center text-center">
                    <div className="relative mb-8">
                      <div className="w-20 h-20 rounded-full border border-gold/15 flex items-center justify-center">
                        <div className="absolute w-20 h-20 rounded-full border-2 border-transparent border-t-gold/40 animate-spin" />
                        <div className="w-14 h-14 rounded-full bg-gold/[0.06] border border-gold/20 flex items-center justify-center">
                          <Loader2 className="h-6 w-6 text-gold animate-spin [animation-duration:1.5s]" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground mb-2">Processing Payment</h3>
                    <p className="text-sm text-foreground/45 max-w-xs font-[family-name:var(--font-serif)] italic">Securing your venue series bundle...</p>
                    <div className="mt-8 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-pulse [animation-delay:200ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-pulse [animation-delay:400ms]" />
                    </div>
                  </div>
                )}

                {/* SUCCESS */}
                {purchaseStep === "success" && (
                  <div className="px-6 py-14 flex flex-col items-center justify-center text-center">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 rounded-full bg-pitch/[0.06] blur-[50px]" />
                    </div>

                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-pitch/20 to-pitch/5 border border-pitch/30 flex items-center justify-center mb-6 animate-in zoom-in duration-500 shadow-[0_0_30px_rgba(26,138,62,0.15)]">
                      <Trophy className="h-8 w-8 text-pitch" />
                      <Check className="absolute -bottom-1 -right-1 h-6 w-6 text-pitch bg-[#0b1525] rounded-full p-0.5 border border-pitch/30" />
                    </div>

                    <h3 className="relative font-[family-name:var(--font-display)] text-xl font-bold text-foreground mb-2">
                      You&apos;re Going to the World Cup!
                    </h3>
                    <p className="relative text-sm text-foreground/45 max-w-xs mb-6 font-[family-name:var(--font-serif)] italic">
                      Your {venue.totalMatches}-match venue series at <strong className="text-foreground/70 not-italic">{venue.venue.stadium}</strong> is confirmed.
                    </p>

                    <div className="relative w-full max-w-xs">
                      <div className="absolute top-1/2 -left-2 w-4 h-4 rounded-full bg-[#070e18]" />
                      <div className="absolute top-1/2 -right-2 w-4 h-4 rounded-full bg-[#070e18]" />
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-foreground/[0.06] to-foreground/[0.02] border border-foreground/10">
                        <div className="flex items-center justify-center gap-2 mb-4 pb-3 border-b border-dashed border-foreground/10">
                          <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.4em] text-gold/70">
                            FIFA World Cup 2026&trade;
                          </span>
                        </div>
                        <div className="space-y-2.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Conf #</span>
                            <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">
                              FWC26-VS-{Math.random().toString(36).slice(2, 8).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Venue</span>
                            <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{venue.venue.city}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Tier</span>
                            <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{currentOffering.name}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Matches</span>
                            <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{venue.totalMatches}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Qty</span>
                            <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{quantity}</span>
                          </div>
                          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-foreground/8">
                            <span className="text-foreground/50 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider font-semibold">Total</span>
                            <span className="font-[family-name:var(--font-display)] font-bold text-base text-foreground">{formatPrice(totalPrice)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => { setPurchaseStep("idle"); setSelectedTier(""); setForm({ name: "", email: "", card: "", expiry: "", cvv: "" }); }}
                      className="relative mt-8 px-8 py-3 rounded-xl bg-foreground/[0.05] border border-foreground/15 text-sm text-foreground/80 hover:border-pitch/40 hover:text-pitch hover:bg-pitch/[0.04] transition font-[family-name:var(--font-display)] font-semibold cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </section>
      )}

      <Footer />
    </main>
  );
}
