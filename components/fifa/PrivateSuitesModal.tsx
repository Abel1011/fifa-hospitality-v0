"use client";

import { useState, useEffect } from "react";
import { X, Check, CreditCard, Loader2, ShieldCheck, Trophy, Crown, Users, Wine, Star } from "lucide-react";

type SuiteInfo = {
  venueName: string;
  title: string;
  copy: string;
  imageUrl?: string;
};

type Step = "configure" | "checkout" | "processing" | "success";

/* Diamond pattern SVG */
function DiamondPattern({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Diamond grid */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => (
          <path
            key={`${row}-${col}`}
            d={`M ${col * 25 + 12.5} ${row * 25} L ${col * 25 + 25} ${row * 25 + 12.5} L ${col * 25 + 12.5} ${row * 25 + 25} L ${col * 25} ${row * 25 + 12.5} Z`}
            stroke="currentColor"
            strokeWidth="0.3"
          />
        ))
      )}
    </svg>
  );
}

const suiteFeatures = [
  { icon: Users, label: "Private group of 20–30 guests" },
  { icon: Crown, label: "Dedicated suite host & concierge" },
  { icon: Wine, label: "Premium open bar & gourmet dining" },
  { icon: Star, label: "Preferred entry & VIP parking" },
];

const suiteTiers = [
  { id: "premium", name: "Premium Suite", guests: "20 guests", price: 85000, desc: "Luxury private suite with premium views, open bar, and gourmet catering for 20 guests." },
  { id: "executive", name: "Executive Suite", guests: "25 guests", price: 120000, desc: "Expanded executive space with field-level views, chef's table, and premium spirits for 25." },
  { id: "presidential", name: "Presidential Suite", guests: "30 guests", price: 175000, desc: "The ultimate experience — largest suite, pitchside terrace, Michelin-star dining for 30." },
];

export default function PrivateSuitesModal({
  suite,
  onClose,
}: {
  suite: SuiteInfo | null;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("configure");
  const [selectedTier, setSelectedTier] = useState("premium");
  const [matchCount, setMatchCount] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", company: "", card: "", expiry: "", cvv: "" });

  useEffect(() => {
    if (suite) {
      setStep("configure");
      setSelectedTier("premium");
      setMatchCount(1);
      setForm({ name: "", email: "", company: "", card: "", expiry: "", cvv: "" });
    }
  }, [suite]);

  if (!suite) return null;

  const currentTier = suiteTiers.find((t) => t.id === selectedTier) || suiteTiers[0];
  const totalPrice = currentTier.price * matchCount;

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
    setTimeout(() => setStep("success"), 3400);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/88 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl rounded-3xl shadow-2xl shadow-black/60 animate-in zoom-in-95 fade-in duration-300 overflow-hidden max-h-[92vh] border border-foreground/[0.07]">
        {/* ─── Background layers ─── */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0510] via-[#0d1220] to-[#080612]" />
        <DiamondPattern className="absolute inset-0 w-full h-full text-accent/[0.04] pointer-events-none" />
        {/* Radial glows */}
        <div className="absolute -top-20 left-1/3 w-[350px] h-[250px] rounded-full bg-accent/[0.05] blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-[300px] h-[300px] rounded-full bg-[#6b21a8]/[0.04] blur-[80px] pointer-events-none" />
        <div className="absolute top-1/2 -left-16 w-[200px] h-[200px] rounded-full bg-gold/[0.03] blur-[60px] pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-foreground/50 hover:text-foreground transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Scrollable content */}
        <div className="relative overflow-y-auto max-h-[92vh]">

        {/* ─── CONFIGURE STEP ─── */}
        {step === "configure" && (
          <div className="relative">
            {/* Hero header */}
            <div className="relative px-6 sm:px-8 pt-7 pb-6">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-accent/10 border border-accent/20">
                  <Crown className="h-4 w-4 text-accent" />
                </div>
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-accent/80">
                  Private Suites · {suite.venueName}
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                The Ultimate Matchday Experience
              </h2>
              <p className="mt-2 font-[family-name:var(--font-serif)] italic text-foreground/50 text-base max-w-lg">
                {suite.copy}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />
            </div>

            {/* Features strip */}
            <div className="relative px-6 sm:px-8 py-4 border-b border-foreground/[0.06]">
              <div className="flex flex-wrap gap-4">
                {suiteFeatures.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <feat.icon className="h-3.5 w-3.5 text-accent/70" />
                    <span className="text-[11px] text-foreground/50 font-[family-name:var(--font-mono)]">
                      {feat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier selection */}
            <div className="relative px-6 sm:px-8 py-6">
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-foreground/45 mb-4">
                Choose Your Suite
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {suiteTiers.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTier(tier.id)}
                    className={`relative text-left p-5 rounded-2xl border transition-all duration-200 ${
                      selectedTier === tier.id
                        ? "border-accent/40 bg-accent/[0.05] shadow-[inset_0_1px_0_0_rgba(0,200,255,0.1),0_0_25px_rgba(0,200,255,0.05)]"
                        : "border-foreground/8 bg-foreground/[0.02] hover:border-foreground/15 hover:bg-foreground/[0.04]"
                    }`}
                  >
                    {selectedTier === tier.id && (
                      <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_rgba(0,200,255,0.5)]" />
                    )}
                    <span className="block font-[family-name:var(--font-display)] text-sm font-bold text-foreground/90">
                      {tier.name}
                    </span>
                    <span className="block mt-1 text-[11px] text-foreground/40 font-[family-name:var(--font-mono)]">
                      {tier.guests}
                    </span>
                    <span className="block mt-3 font-[family-name:var(--font-mono)] text-[13px] font-bold text-accent/80">
                      {formatPrice(tier.price)}
                    </span>
                    <span className="block mt-0.5 text-[10px] text-foreground/30">per match</span>
                    <p className="mt-3 text-[11px] text-foreground/40 leading-snug line-clamp-2">
                      {tier.desc}
                    </p>
                  </button>
                ))}
              </div>

              {/* Match count */}
              <div className="mt-6 flex items-center gap-6">
                <div>
                  <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-2">
                    Number of Matches
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setMatchCount(Math.max(1, matchCount - 1))}
                      className="w-9 h-9 rounded-lg border border-foreground/12 bg-foreground/[0.03] text-foreground/70 hover:border-foreground/25 transition flex items-center justify-center font-bold text-sm"
                    >
                      −
                    </button>
                    <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-foreground w-8 text-center tabular-nums">
                      {matchCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMatchCount(Math.min(5, matchCount + 1))}
                      className="w-9 h-9 rounded-lg border border-foreground/12 bg-foreground/[0.03] text-foreground/70 hover:border-foreground/25 transition flex items-center justify-center font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="relative px-6 sm:px-8 py-5 border-t border-foreground/8">
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-accent/15 to-transparent" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="block text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-foreground/40">
                    {currentTier.name} · {matchCount} {matchCount === 1 ? "match" : "matches"} · {currentTier.guests}
                  </span>
                  <span className="block font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mt-1">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="group w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-accent to-[#0099cc] text-background font-[family-name:var(--font-display)] font-bold text-sm tracking-wide hover:from-accent/90 hover:to-[#0088bb] transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(0,200,255,0.15)]"
                >
                  <span className="flex items-center justify-center gap-2">
                    Request Suite
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background/20 transition group-hover:bg-background/30">
                      →
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── CHECKOUT STEP ─── */}
        {step === "checkout" && (
          <div className="relative">
            <div className="relative px-6 sm:px-8 pt-7 pb-5">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
              <button
                onClick={() => setStep("configure")}
                className="text-[11px] font-[family-name:var(--font-mono)] text-foreground/40 hover:text-foreground/70 transition mb-3 flex items-center gap-1"
              >
                ← Back to configuration
              </button>
              <h2 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold text-foreground">
                Confirm Your Private Suite
              </h2>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />
            </div>

            <div className="relative px-6 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Form */}
              <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] focus:shadow-[0_0_0_3px_rgba(0,200,255,0.06)] transition"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">
                      Company
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Optional"
                      className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] focus:shadow-[0_0_0_3px_rgba(0,200,255,0.06)] transition"
                    />
                  </div>
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
                    placeholder="john@company.com"
                    className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] focus:shadow-[0_0_0_3px_rgba(0,200,255,0.06)] transition"
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
                      className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] focus:shadow-[0_0_0_3px_rgba(0,200,255,0.06)] transition font-[family-name:var(--font-mono)]"
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
                      className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] focus:shadow-[0_0_0_3px_rgba(0,200,255,0.06)] transition font-[family-name:var(--font-mono)]"
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
                      className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-accent/40 focus:bg-accent/[0.02] focus:shadow-[0_0_0_3px_rgba(0,200,255,0.06)] transition font-[family-name:var(--font-mono)]"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="group w-full py-4 rounded-xl bg-gradient-to-r from-accent to-[#0099cc] text-background font-[family-name:var(--font-display)] font-bold text-sm tracking-wide hover:from-accent/90 hover:to-[#0088bb] transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(0,200,255,0.15)]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <ShieldCheck className="h-4 w-4 opacity-70" />
                      Confirm {formatPrice(totalPrice)}
                    </span>
                  </button>
                  <p className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-foreground/30 font-[family-name:var(--font-mono)]">
                    <span className="w-1 h-1 rounded-full bg-accent/50" />
                    Simulated transaction · No real charge
                    <span className="w-1 h-1 rounded-full bg-accent/50" />
                  </p>
                </div>
              </form>

              {/* Order summary */}
              <div className="md:col-span-2">
                <div className="sticky top-4 p-5 rounded-2xl bg-foreground/[0.03] border border-foreground/8">
                  <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-4">
                    Suite Reservation
                  </p>
                  <div className="space-y-3 text-[12px]">
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Venue</span>
                      <span className="text-foreground/80 font-medium">{suite.venueName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Suite</span>
                      <span className="text-foreground/80 font-medium">{currentTier.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Capacity</span>
                      <span className="text-foreground/80 font-medium">{currentTier.guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Matches</span>
                      <span className="text-foreground/80 font-medium">{matchCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Per match</span>
                      <span className="text-foreground/80 font-[family-name:var(--font-mono)]">{formatPrice(currentTier.price)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-foreground/8">
                      <span className="text-foreground/70 font-semibold">Total</span>
                      <span className="font-[family-name:var(--font-display)] font-bold text-lg text-foreground">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Perks */}
                  <div className="mt-5 pt-4 border-t border-foreground/8">
                    <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-foreground/35 mb-2.5">
                      Included
                    </p>
                    <div className="space-y-2">
                      {suiteFeatures.map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-accent/60 shrink-0" />
                          <span className="text-[10px] text-foreground/45">{f.label}</span>
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
              <div className="w-72 h-72 rounded-full bg-accent/[0.04] blur-[60px] animate-pulse" />
            </div>
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full border border-accent/15 flex items-center justify-center">
                <div className="absolute w-24 h-24 rounded-full border-2 border-transparent border-t-accent/40 animate-spin" />
                <div className="w-16 h-16 rounded-full bg-accent/[0.06] border border-accent/20 flex items-center justify-center">
                  <Loader2 className="h-7 w-7 text-accent animate-spin [animation-duration:1.5s]" />
                </div>
              </div>
            </div>
            <h3 className="relative font-[family-name:var(--font-display)] text-xl font-bold text-foreground mb-2">
              Reserving Your Suite
            </h3>
            <p className="relative text-sm text-foreground/45 max-w-sm font-[family-name:var(--font-serif)] italic">
              Confirming your {currentTier.name} at {suite.venueName} for {matchCount} {matchCount === 1 ? "match" : "matches"}...
            </p>
            <div className="relative mt-8 flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-accent/70 animate-pulse"
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
              <div className="w-56 h-56 rounded-full bg-accent/[0.05] blur-[50px]" />
            </div>

            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 flex items-center justify-center mb-8 animate-in zoom-in duration-500 shadow-[0_0_40px_rgba(0,200,255,0.12)]">
              <div className="absolute inset-1.5 rounded-full border border-accent/10" />
              <Crown className="h-10 w-10 text-accent" />
              <Check className="absolute -bottom-1 -right-1 h-7 w-7 text-accent bg-[#0d1220] rounded-full p-1 border border-accent/30" />
            </div>

            <h3 className="relative font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-2">
              Suite Reserved!
            </h3>
            <p className="relative text-sm text-foreground/45 max-w-md mb-8 font-[family-name:var(--font-serif)] italic">
              Your {currentTier.name} at <strong className="text-foreground/70 not-italic">{suite.venueName}</strong> is confirmed for {matchCount} {matchCount === 1 ? "match" : "matches"}.
            </p>

            {/* Confirmation card */}
            <div className="relative w-full max-w-sm">
              <div className="absolute top-1/2 -left-2.5 w-5 h-5 rounded-full bg-[#0a0510]" />
              <div className="absolute top-1/2 -right-2.5 w-5 h-5 rounded-full bg-[#0a0510]" />

              <div className="p-6 rounded-2xl bg-gradient-to-br from-foreground/[0.06] to-foreground/[0.02] border border-foreground/10">
                <div className="flex items-center justify-center gap-2 mb-5 pb-3 border-b border-dashed border-foreground/10">
                  <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.4em] text-accent/70">
                    FIFA World Cup 2026™ · Private Suite
                  </span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Conf #</span>
                    <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">
                      PS-{Math.random().toString(36).slice(2, 8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Venue</span>
                    <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{suite.venueName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Suite</span>
                    <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{currentTier.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Guests</span>
                    <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{currentTier.guests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Matches</span>
                    <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{matchCount}</span>
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
              className="relative mt-8 px-8 py-3 rounded-xl bg-foreground/[0.05] border border-foreground/15 text-sm text-foreground/80 hover:border-accent/40 hover:text-accent hover:bg-accent/[0.04] transition font-[family-name:var(--font-display)] font-semibold"
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
