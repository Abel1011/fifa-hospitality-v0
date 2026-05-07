"use client";

import { useState, useEffect, useId } from "react";
import { X, Check, CreditCard, Loader2, Ticket, ShieldCheck, Trophy } from "lucide-react";

type MatchInfo = {
  date: string;
  teams: string;
  stage: string;
  time: string;
  venue: string;
  price: number;
  offerings?: { id: string; name: string; usdStartingPrice: number }[];
};

type Step = "form" | "processing" | "success";

/* Mini pitch SVG background */
function PitchLines({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Outline */}
      <rect x="10" y="10" width="380" height="240" rx="2" stroke="currentColor" strokeWidth="0.8" />
      {/* Center line */}
      <line x1="200" y1="10" x2="200" y2="250" stroke="currentColor" strokeWidth="0.6" />
      {/* Center circle */}
      <circle cx="200" cy="130" r="40" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="200" cy="130" r="2" fill="currentColor" />
      {/* Left penalty area */}
      <rect x="10" y="70" width="60" height="120" stroke="currentColor" strokeWidth="0.6" />
      <rect x="10" y="100" width="25" height="60" stroke="currentColor" strokeWidth="0.5" />
      <path d="M 70 110 A 20 20 0 0 1 70 150" stroke="currentColor" strokeWidth="0.5" />
      {/* Right penalty area */}
      <rect x="330" y="70" width="60" height="120" stroke="currentColor" strokeWidth="0.6" />
      <rect x="365" y="100" width="25" height="60" stroke="currentColor" strokeWidth="0.5" />
      <path d="M 330 110 A 20 20 0 0 0 330 150" stroke="currentColor" strokeWidth="0.5" />
      {/* Corner arcs */}
      <path d="M 10 18 A 8 8 0 0 0 18 10" stroke="currentColor" strokeWidth="0.5" />
      <path d="M 382 10 A 8 8 0 0 0 390 18" stroke="currentColor" strokeWidth="0.5" />
      <path d="M 10 242 A 8 8 0 0 1 18 250" stroke="currentColor" strokeWidth="0.5" />
      <path d="M 382 250 A 8 8 0 0 1 390 242" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}

export default function PurchaseModal({
  match,
  onClose,
}: {
  match: MatchInfo | null;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("form");
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", card: "", expiry: "", cvv: "" });
  const uid = useId();

  // Reset on open
  useEffect(() => {
    if (match) {
      setStep("form");
      setSelectedTier(match.offerings?.[match.offerings.length - 1]?.id || "FP");
      setQuantity(1);
      setForm({ name: "", email: "", card: "", expiry: "", cvv: "" });
    }
  }, [match]);

  if (!match) return null;

  const tiers = match.offerings || [
    { id: "PSL", name: "Pitchside Lounge", usdStartingPrice: match.price * 3 },
    { id: "TL", name: "Trophy Lounge", usdStartingPrice: match.price * 2 },
    { id: "CL", name: "Champions Club", usdStartingPrice: match.price * 1.5 },
    { id: "FP", name: "FIFA Pavilion", usdStartingPrice: match.price },
  ];

  const currentTier = tiers.find((t) => t.id === selectedTier) || tiers[tiers.length - 1];
  const totalPrice = currentTier.usdStartingPrice * quantity;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("processing");
    setTimeout(() => setStep("success"), 2800);
  }

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(p);

  const matchDate = new Date(match.date + "T12:00:00");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-3xl shadow-2xl shadow-black/60 animate-in zoom-in-95 fade-in duration-300 overflow-hidden max-h-[90vh] border border-foreground/[0.07]">
        {/* ─── Background layers ─── */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070e18] via-[#0b1525] to-[#060d17]" />
        {/* Pitch lines watermark */}
        <PitchLines className="absolute inset-0 w-full h-full text-pitch/[0.04] pointer-events-none" />
        {/* Radial glow top */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-pitch/[0.06] blur-[80px] pointer-events-none" />
        {/* Accent glow bottom-right */}
        <div className="absolute -bottom-16 -right-16 w-[250px] h-[250px] rounded-full bg-gold/[0.04] blur-[60px] pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-foreground/50 hover:text-foreground transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Scrollable content */}
        <div className="relative overflow-y-auto max-h-[90vh]">

        {/* ─── FORM STEP ─── */}
        {step === "form" && (
          <div className="relative">
            {/* Header with gradient accent bar */}
            <div className="relative px-6 pt-6 pb-5">
              {/* Top accent line */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-pitch/40 to-transparent" />
              
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gold/10 border border-gold/20">
                  <Ticket className="h-3.5 w-3.5 text-gold" />
                </div>
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-gold/80">
                  Hospitality Package
                </span>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-foreground leading-tight">
                {match.teams}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5">
                <span className="font-[family-name:var(--font-mono)] text-[11px] text-foreground/50">
                  {matchDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="w-1 h-1 rounded-full bg-foreground/15" />
                <span className="font-[family-name:var(--font-mono)] text-[11px] text-foreground/50">
                  {match.time}
                </span>
                <span className="w-1 h-1 rounded-full bg-foreground/15" />
                <span className="font-[family-name:var(--font-mono)] text-[11px] text-foreground/50">
                  {match.venue}
                </span>
              </div>
              <span
                className={`inline-block mt-2.5 text-[9px] px-2.5 py-0.5 rounded-full font-[family-name:var(--font-mono)] uppercase tracking-wider border ${
                  match.stage.includes("Group")
                    ? "bg-pitch/8 text-pitch border-pitch/20"
                    : "bg-gold/8 text-gold border-gold/20"
                }`}
              >
                {match.stage}
              </span>
              {/* Bottom separator */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
            </div>

            <form onSubmit={handleSubmit} className="relative px-6 py-5 space-y-5">
              {/* Tier selection */}
              <div>
                <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-2.5">
                  Experience Tier
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {tiers.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTier(tier.id)}
                      className={`relative text-left p-3.5 rounded-xl border transition-all duration-200 ${
                        selectedTier === tier.id
                          ? "border-gold/50 bg-gold/[0.06] shadow-[inset_0_1px_0_0_rgba(212,168,67,0.15)]"
                          : "border-foreground/8 bg-foreground/[0.02] hover:border-foreground/20 hover:bg-foreground/[0.04]"
                      }`}
                    >
                      {selectedTier === tier.id && (
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-gold shadow-[0_0_6px_rgba(212,168,67,0.5)]" />
                      )}
                      <span className="block text-xs font-semibold text-foreground/90 font-[family-name:var(--font-display)] leading-tight">
                        {tier.name}
                      </span>
                      <span className="block mt-1.5 font-[family-name:var(--font-mono)] text-[11px] text-foreground/40">
                        from {formatPrice(tier.usdStartingPrice)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-2.5">
                  Tickets
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-lg border border-foreground/12 bg-foreground/[0.03] text-foreground/70 hover:border-foreground/25 hover:bg-foreground/[0.06] transition flex items-center justify-center font-bold text-sm"
                  >
                    −
                  </button>
                  <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-foreground w-8 text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(8, quantity + 1))}
                    className="w-9 h-9 rounded-lg border border-foreground/12 bg-foreground/[0.03] text-foreground/70 hover:border-foreground/25 hover:bg-foreground/[0.06] transition flex items-center justify-center font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-3">
                <div>
                  <label htmlFor={`${uid}-name`} className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id={`${uid}-name`}
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.08)] transition"
                  />
                </div>
                <div>
                  <label htmlFor={`${uid}-email`} className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">
                    Email
                  </label>
                  <input
                    id={`${uid}-email`}
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.08)] transition"
                  />
                </div>
                <div>
                  <label htmlFor={`${uid}-card`} className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      id={`${uid}-card`}
                      type="text"
                      required
                      value={form.card}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                        const formatted = v.replace(/(.{4})/g, "$1 ").trim();
                        setForm({ ...form, card: formatted });
                      }}
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.08)] transition font-[family-name:var(--font-mono)]"
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`${uid}-expiry`} className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">
                      Expiry
                    </label>
                    <input
                      id={`${uid}-expiry`}
                      type="text"
                      required
                      value={form.expiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                        setForm({ ...form, expiry: v });
                      }}
                      placeholder="MM/YY"
                      className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.08)] transition font-[family-name:var(--font-mono)]"
                    />
                  </div>
                  <div>
                    <label htmlFor={`${uid}-cvv`} className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">
                      CVV
                    </label>
                    <input
                      id={`${uid}-cvv`}
                      type="text"
                      required
                      value={form.cvv}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setForm({ ...form, cvv: v });
                      }}
                      placeholder="123"
                      className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.08)] transition font-[family-name:var(--font-mono)]"
                    />
                  </div>
                </div>
              </div>

              {/* Total + Submit */}
              <div className="pt-4">
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-foreground/[0.04] to-foreground/[0.02] border border-foreground/8 mb-4">
                  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-foreground/40">
                        Total
                      </span>
                      <span className="block font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mt-0.5">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-[family-name:var(--font-mono)] text-foreground/30">
                        {currentTier.name}
                      </span>
                      <span className="block text-[10px] font-[family-name:var(--font-mono)] text-foreground/30 mt-0.5">
                        × {quantity} {quantity === 1 ? "ticket" : "tickets"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="group w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-[#c49a38] text-background font-[family-name:var(--font-display)] font-bold text-sm tracking-wide hover:from-gold/90 hover:to-[#b8903a] transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(212,168,67,0.2)]"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ShieldCheck className="h-4 w-4 opacity-70" />
                    Confirm Purchase
                  </span>
                </button>
                <p className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-foreground/30 font-[family-name:var(--font-mono)]">
                  <span className="w-1 h-1 rounded-full bg-pitch/50" />
                  Simulated transaction · No real charge
                  <span className="w-1 h-1 rounded-full bg-pitch/50" />
                </p>
              </div>
            </form>
          </div>
        )}

        {/* ─── PROCESSING STEP ─── */}
        {step === "processing" && (
          <div className="relative px-6 py-20 flex flex-col items-center justify-center text-center">
            {/* Animated stadium glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full bg-gold/[0.04] blur-[50px] animate-pulse" />
            </div>
            
            <div className="relative mb-8">
              {/* Outer ring */}
              <div className="w-20 h-20 rounded-full border border-gold/15 flex items-center justify-center">
                {/* Middle spinning ring */}
                <div className="absolute w-20 h-20 rounded-full border-2 border-transparent border-t-gold/40 animate-spin" />
                {/* Inner content */}
                <div className="w-14 h-14 rounded-full bg-gold/[0.06] border border-gold/20 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-gold animate-spin [animation-duration:1.5s]" />
                </div>
              </div>
            </div>
            <h3 className="relative font-[family-name:var(--font-display)] text-lg font-bold text-foreground mb-2">
              Processing Payment
            </h3>
            <p className="relative text-sm text-foreground/45 max-w-xs font-[family-name:var(--font-serif)] italic">
              Securing your hospitality package for {match.teams}...
            </p>
            <div className="relative mt-8 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-pulse [animation-delay:200ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-pulse [animation-delay:400ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-pulse [animation-delay:600ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-pulse [animation-delay:800ms]" />
            </div>
          </div>
        )}

        {/* ─── SUCCESS STEP ─── */}
        {step === "success" && (
          <div className="relative px-6 py-12 flex flex-col items-center justify-center text-center">
            {/* Success glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full bg-pitch/[0.06] blur-[50px]" />
            </div>

            {/* Trophy icon */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-pitch/20 to-pitch/5 border border-pitch/30 flex items-center justify-center mb-6 animate-in zoom-in duration-500 shadow-[0_0_30px_rgba(26,138,62,0.15)]">
              <div className="absolute inset-1 rounded-full border border-pitch/10" />
              <Trophy className="h-8 w-8 text-pitch" />
              <Check className="absolute -bottom-1 -right-1 h-6 w-6 text-pitch bg-[#0b1525] rounded-full p-0.5 border border-pitch/30" />
            </div>
            
            <h3 className="relative font-[family-name:var(--font-display)] text-xl font-bold text-foreground mb-2">
              You&apos;re Going to the World Cup!
            </h3>
            <p className="relative text-sm text-foreground/45 max-w-xs mb-6 font-[family-name:var(--font-serif)] italic">
              Your hospitality package for <strong className="text-foreground/70 not-italic">{match.teams}</strong> is confirmed.
            </p>
            
            {/* Ticket-style confirmation card */}
            <div className="relative w-full max-w-xs">
              {/* Notch cutouts on left/right */}
              <div className="absolute top-1/2 -left-2 w-4 h-4 rounded-full bg-[#070e18]" />
              <div className="absolute top-1/2 -right-2 w-4 h-4 rounded-full bg-[#070e18]" />
              
              <div className="p-5 rounded-2xl bg-gradient-to-br from-foreground/[0.06] to-foreground/[0.02] border border-foreground/10">
                {/* FIFA badge */}
                <div className="flex items-center justify-center gap-2 mb-4 pb-3 border-b border-dashed border-foreground/10">
                  <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.4em] text-gold/70">
                    FIFA World Cup 2026™
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Conf #</span>
                    <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">
                      FWC26-{Math.random().toString(36).slice(2, 8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Tier</span>
                    <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{currentTier.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Qty</span>
                    <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{quantity}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-foreground/8">
                    <span className="text-foreground/50 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider font-semibold">Total</span>
                    <span className="font-[family-name:var(--font-display)] font-bold text-base text-foreground">
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
