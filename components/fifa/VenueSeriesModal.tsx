"use client";

import { useState, useEffect } from "react";
import { X, Check, CreditCard, Loader2, ShieldCheck, Trophy, Calendar, MapPin, Sparkles } from "lucide-react";

type VenueSeriesMatch = {
  color: string;
  label: string;
  date: string;
  day: string;
};

type Offering = {
  id: string;
  name: string;
  usdStartingPrice: number;
  description?: string;
};

type VenueSeriesInfo = {
  venueName: string;
  title: string;
  intro: string;
  totalMatches: number;
  matches: VenueSeriesMatch[];
  seriesIncludes: string[];
  hospitalityIncludes: string[];
  offerings: Offering[];
  price: number;
};

type Step = "select" | "checkout" | "processing" | "success";

/* Pitch markings SVG */
function PitchBG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect x="15" y="15" width="570" height="370" rx="3" stroke="currentColor" strokeWidth="0.7" />
      <line x1="300" y1="15" x2="300" y2="385" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="300" cy="200" r="55" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="300" cy="200" r="2.5" fill="currentColor" />
      <rect x="15" y="110" width="85" height="180" stroke="currentColor" strokeWidth="0.5" />
      <rect x="15" y="150" width="35" height="100" stroke="currentColor" strokeWidth="0.4" />
      <rect x="500" y="110" width="85" height="180" stroke="currentColor" strokeWidth="0.5" />
      <rect x="550" y="150" width="35" height="100" stroke="currentColor" strokeWidth="0.4" />
      <path d="M 100 170 A 30 30 0 0 1 100 230" stroke="currentColor" strokeWidth="0.4" />
      <path d="M 500 170 A 30 30 0 0 0 500 230" stroke="currentColor" strokeWidth="0.4" />
    </svg>
  );
}

/* Hospitality tier descriptions */
const tierDescriptions: Record<string, string> = {
  PSL: "Pitchside seating with premium lounge access, gourmet dining, and unmatched views from the field level.",
  VIP: "Elevated VIP experience with priority access, exclusive lounge, and premium food & beverage service.",
  TL: "Prime sideline seating combining comfort and convenience with excellent views and welcome refreshments.",
  CL: "Preferred seating with excellent views, easy access to amenities, signature cocktails and local cuisine.",
  FP: "Great views and convenient access in a vibrant atmosphere with specialty cocktails and gourmet street eats.",
};

export default function VenueSeriesModal({
  series,
  onClose,
}: {
  series: VenueSeriesInfo | null;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("select");
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", card: "", expiry: "", cvv: "" });

  useEffect(() => {
    if (series) {
      setStep("select");
      setSelectedTier(series.offerings[series.offerings.length - 1]?.id || "CL");
      setQuantity(1);
      setForm({ name: "", email: "", card: "", expiry: "", cvv: "" });
    }
  }, [series]);

  if (!series) return null;

  const currentTier = series.offerings.find((o) => o.id === selectedTier) || series.offerings[series.offerings.length - 1];
  const totalPrice = currentTier.usdStartingPrice * quantity;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(p);

  function handleCheckout() {
    setStep("checkout");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("processing");
    setTimeout(() => setStep("success"), 3200);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/88 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal — larger */}
      <div className="relative w-full max-w-3xl rounded-3xl shadow-2xl shadow-black/60 animate-in zoom-in-95 fade-in duration-300 overflow-hidden max-h-[92vh] border border-foreground/[0.07]">
        {/* ─── Background layers ─── */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#060d17] via-[#0b1525] to-[#070e18]" />
        <PitchBG className="absolute inset-0 w-full h-full text-pitch/[0.03] pointer-events-none" />
        {/* Radial glows */}
        <div className="absolute -top-24 -left-24 w-[350px] h-[350px] rounded-full bg-gold/[0.04] blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] rounded-full bg-pitch/[0.05] blur-[80px] pointer-events-none" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(rgba(240,244,248,1) 1px, transparent 1px), linear-gradient(90deg, rgba(240,244,248,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-foreground/50 hover:text-foreground transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Scrollable content */}
        <div className="relative overflow-y-auto max-h-[92vh]">

        {/* ─── STEP 1: SELECT ─── */}
        {step === "select" && (
          <div className="relative">
            {/* Hero header */}
            <div className="relative px-6 sm:px-8 pt-7 pb-6">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gold/10 border border-gold/20">
                  <Sparkles className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <span className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-gold/70">
                    Venue Series Package
                  </span>
                </div>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                {series.title}
              </h2>
              <p className="mt-2 font-[family-name:var(--font-serif)] italic text-foreground/55 text-base max-w-lg">
                {series.intro}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />
            </div>

            {/* Content grid */}
            <div className="relative px-6 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left — Matches included */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-3.5 w-3.5 text-pitch" />
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                    {series.totalMatches} Matches Included
                  </span>
                </div>
                <div className="relative pl-5 border-l border-foreground/8 space-y-0.5">
                  {series.matches.map((match, i) => (
                    <div key={i} className="relative flex items-start gap-3 py-2.5">
                      {/* Timeline dot */}
                      <div
                        className="absolute -left-[22.5px] top-3.5 w-2.5 h-2.5 rounded-full border-2 border-[#0b1525]"
                        style={{ backgroundColor: match.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-[family-name:var(--font-display)] text-[13px] font-semibold text-foreground/85 truncate">
                          {match.label}
                        </p>
                        <p className="font-[family-name:var(--font-mono)] text-[10px] text-foreground/40 mt-0.5">
                          {match.date} · {match.day}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Series includes */}
                {series.seriesIncludes.length > 0 && (
                  <div className="mt-6 p-4 rounded-2xl bg-foreground/[0.03] border border-foreground/8">
                    <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-3">
                      Package includes
                    </p>
                    <ul className="space-y-2">
                      {series.seriesIncludes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] text-foreground/60 leading-snug">
                          <Check className="h-3 w-3 text-pitch mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right — Hospitality tiers */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-3.5 w-3.5 text-gold" />
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                    Choose Hospitality
                  </span>
                </div>
                <div className="space-y-2">
                  {series.offerings.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTier(tier.id)}
                      className={`relative w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                        selectedTier === tier.id
                          ? "border-gold/40 bg-gold/[0.05] shadow-[inset_0_1px_0_0_rgba(212,168,67,0.12),0_0_20px_rgba(212,168,67,0.05)]"
                          : "border-foreground/8 bg-foreground/[0.02] hover:border-foreground/15 hover:bg-foreground/[0.04]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {selectedTier === tier.id && (
                              <span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_6px_rgba(212,168,67,0.5)]" />
                            )}
                            <span className="font-[family-name:var(--font-display)] text-sm font-semibold text-foreground/90">
                              {tier.name}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-foreground/40 leading-snug line-clamp-2">
                            {tierDescriptions[tier.id] || "Premium hospitality experience with exclusive access and amenities."}
                          </p>
                        </div>
                        <span className="font-[family-name:var(--font-mono)] text-[12px] font-bold text-foreground/70 whitespace-nowrap">
                          {formatPrice(tier.usdStartingPrice)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Quantity */}
                <div className="mt-5">
                  <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-2">
                    Package Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-lg border border-foreground/12 bg-foreground/[0.03] text-foreground/70 hover:border-foreground/25 transition flex items-center justify-center font-bold text-sm"
                    >
                      −
                    </button>
                    <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-foreground w-8 text-center tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(6, quantity + 1))}
                      className="w-9 h-9 rounded-lg border border-foreground/12 bg-foreground/[0.03] text-foreground/70 hover:border-foreground/25 transition flex items-center justify-center font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar — summary + CTA */}
            <div className="relative px-6 sm:px-8 py-5 border-t border-foreground/8">
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="block text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-foreground/40">
                    {currentTier.name} · {quantity} {quantity === 1 ? "package" : "packages"} · {series.totalMatches} matches
                  </span>
                  <span className="block font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mt-1">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="group w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold to-[#c49a38] text-background font-[family-name:var(--font-display)] font-bold text-sm tracking-wide hover:from-gold/90 hover:to-[#b8903a] transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(212,168,67,0.2)]"
                >
                  <span className="flex items-center justify-center gap-2">
                    Continue to Checkout
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background/20 transition group-hover:bg-background/30">
                      →
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 2: CHECKOUT ─── */}
        {step === "checkout" && (
          <div className="relative">
            {/* Header */}
            <div className="relative px-6 sm:px-8 pt-7 pb-5">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
              <button
                onClick={() => setStep("select")}
                className="text-[11px] font-[family-name:var(--font-mono)] text-foreground/40 hover:text-foreground/70 transition mb-3 flex items-center gap-1"
              >
                ← Back to selection
              </button>
              <h2 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold text-foreground">
                Complete Your Purchase
              </h2>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />
            </div>

            <div className="relative px-6 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Left — Form */}
              <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
                <div>
                  <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.08)] transition"
                  />
                </div>
                <div>
                  <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.08)] transition"
                  />
                </div>
                <div>
                  <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={form.card}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                        const formatted = v.replace(/(.{4})/g, "$1 ").trim();
                        setForm({ ...form, card: formatted });
                      }}
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.08)] transition font-[family-name:var(--font-mono)]"
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">
                      Expiry
                    </label>
                    <input
                      type="text"
                      required
                      value={form.expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                        setForm({ ...form, expiry: v });
                      }}
                      placeholder="MM/YY"
                      className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.08)] transition font-[family-name:var(--font-mono)]"
                    />
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">
                      CVV
                    </label>
                    <input
                      type="text"
                      required
                      value={form.cvv}
                      onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      placeholder="123"
                      className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.08)] transition font-[family-name:var(--font-mono)]"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="group w-full py-4 rounded-xl bg-gradient-to-r from-gold to-[#c49a38] text-background font-[family-name:var(--font-display)] font-bold text-sm tracking-wide hover:from-gold/90 hover:to-[#b8903a] transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(212,168,67,0.2)]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <ShieldCheck className="h-4 w-4 opacity-70" />
                      Pay {formatPrice(totalPrice)}
                    </span>
                  </button>
                  <p className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-foreground/30 font-[family-name:var(--font-mono)]">
                    <span className="w-1 h-1 rounded-full bg-pitch/50" />
                    Simulated transaction · No real charge
                    <span className="w-1 h-1 rounded-full bg-pitch/50" />
                  </p>
                </div>
              </form>

              {/* Right — Order summary */}
              <div className="md:col-span-2">
                <div className="sticky top-4 p-5 rounded-2xl bg-foreground/[0.03] border border-foreground/8">
                  <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-4">
                    Order Summary
                  </p>
                  <div className="space-y-3 text-[12px]">
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Venue</span>
                      <span className="text-foreground/80 font-medium">{series.venueName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Package</span>
                      <span className="text-foreground/80 font-medium">{currentTier.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Matches</span>
                      <span className="text-foreground/80 font-medium">{series.totalMatches}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Quantity</span>
                      <span className="text-foreground/80 font-medium">{quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Per package</span>
                      <span className="text-foreground/80 font-[family-name:var(--font-mono)]">{formatPrice(currentTier.usdStartingPrice)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-foreground/8">
                      <span className="text-foreground/70 font-semibold">Total</span>
                      <span className="font-[family-name:var(--font-display)] font-bold text-lg text-foreground">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Matches list mini */}
                  <div className="mt-5 pt-4 border-t border-foreground/8">
                    <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-foreground/35 mb-2">
                      Included matches
                    </p>
                    <div className="space-y-1.5">
                      {series.matches.map((m, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                          <span className="text-[10px] text-foreground/45 truncate">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── PROCESSING ─── */}
        {step === "processing" && (
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
              Securing Your Series
            </h3>
            <p className="relative text-sm text-foreground/45 max-w-sm font-[family-name:var(--font-serif)] italic">
              Reserving {series.totalMatches} matches at {series.venueName} with {currentTier.name} hospitality...
            </p>
            <div className="relative mt-8 flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── SUCCESS ─── */}
        {step === "success" && (
          <div className="relative px-6 sm:px-8 py-16 flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-56 rounded-full bg-pitch/[0.06] blur-[50px]" />
            </div>

            {/* Trophy */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-pitch/20 to-pitch/5 border border-pitch/30 flex items-center justify-center mb-8 animate-in zoom-in duration-500 shadow-[0_0_40px_rgba(26,138,62,0.15)]">
              <div className="absolute inset-1.5 rounded-full border border-pitch/10" />
              <Trophy className="h-10 w-10 text-pitch" />
              <Check className="absolute -bottom-1 -right-1 h-7 w-7 text-pitch bg-[#0b1525] rounded-full p-1 border border-pitch/30" />
            </div>

            <h3 className="relative font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-2">
              Series Package Confirmed!
            </h3>
            <p className="relative text-sm text-foreground/45 max-w-md mb-8 font-[family-name:var(--font-serif)] italic">
              You&apos;re attending all {series.totalMatches} matches at <strong className="text-foreground/70 not-italic">{series.venueName}</strong> with {currentTier.name} hospitality.
            </p>

            {/* Ticket-style card */}
            <div className="relative w-full max-w-sm">
              <div className="absolute top-1/2 -left-2.5 w-5 h-5 rounded-full bg-[#060d17]" />
              <div className="absolute top-1/2 -right-2.5 w-5 h-5 rounded-full bg-[#060d17]" />

              <div className="p-6 rounded-2xl bg-gradient-to-br from-foreground/[0.06] to-foreground/[0.02] border border-foreground/10">
                <div className="flex items-center justify-center gap-2 mb-5 pb-3 border-b border-dashed border-foreground/10">
                  <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.4em] text-gold/70">
                    FIFA World Cup 2026™ · Venue Series
                  </span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Conf #</span>
                    <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">
                      VS-{Math.random().toString(36).slice(2, 8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Venue</span>
                    <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{series.venueName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Tier</span>
                    <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{currentTier.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Matches</span>
                    <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{series.totalMatches}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Qty</span>
                    <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{quantity}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-foreground/8">
                    <span className="text-foreground/50 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider font-semibold">Total</span>
                    <span className="font-[family-name:var(--font-display)] font-bold text-lg text-foreground">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="relative mt-8 px-8 py-3 rounded-xl bg-foreground/[0.05] border border-foreground/15 text-sm text-foreground/80 hover:border-pitch/40 hover:text-pitch hover:bg-pitch/[0.04] transition font-[family-name:var(--font-display)] font-semibold"
            >
              Done
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
