"use client";

import { useState, useEffect } from "react";
import { X, Check, CreditCard, Loader2, ShieldCheck, MapPin, Plane, Hotel, Car, Calendar } from "lucide-react";

type Step = "configure" | "checkout" | "processing" | "success";

const VENUES = [
  "Mexico City", "Guadalajara", "Monterrey", "Toronto", "Vancouver",
  "Atlanta", "Boston", "Dallas", "Houston", "Kansas City",
  "Los Angeles", "Miami", "New York / New Jersey", "Philadelphia", "San Francisco Bay Area", "Seattle",
];

const HOTEL_TIERS = [
  { id: "standard", name: "Premium Hotel", stars: "4-star", price: 2800, perNight: true, desc: "Centrally located 4-star hotels, match-day shuttle service included." },
  { id: "luxury", name: "Luxury Hotel", stars: "5-star", price: 5200, perNight: true, desc: "World-class 5-star properties with VIP concierge and exclusive amenities." },
  { id: "ultra", name: "Ultra-Luxury Suite", stars: "5-star+", price: 9500, perNight: true, desc: "Presidential suites at top properties, private chauffeur, butler service." },
];

const ADDONS = [
  { id: "car", icon: Car, label: "Premium Car Rental", price: 450, unit: "/day" },
  { id: "transfer", icon: Plane, label: "Airport VIP Transfer", price: 350, unit: "" },
  { id: "experience", icon: Calendar, label: "City Experience Package", price: 1200, unit: "" },
];

/* Diamond pattern SVG */
function DiamondPattern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid slice">
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => (
          <path key={`${row}-${col}`} d={`M ${col * 25 + 12.5} ${row * 25} L ${col * 25 + 25} ${row * 25 + 12.5} L ${col * 25 + 12.5} ${row * 25 + 25} L ${col * 25} ${row * 25 + 12.5} Z`} stroke="currentColor" strokeWidth="0.3" />
        ))
      )}
    </svg>
  );
}

export default function AccommodationsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("configure");
  const [selectedHotel, setSelectedHotel] = useState("standard");
  const [nights, setNights] = useState(3);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [addons, setAddons] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", email: "", card: "", expiry: "", cvv: "" });

  useEffect(() => {
    if (open) {
      setStep("configure");
      setSelectedHotel("standard");
      setNights(3);
      setSelectedVenue("");
      setAddons([]);
      setForm({ name: "", email: "", card: "", expiry: "", cvv: "" });
    }
  }, [open]);

  if (!open) return null;

  const currentHotel = HOTEL_TIERS.find(h => h.id === selectedHotel) || HOTEL_TIERS[0];
  const hotelTotal = currentHotel.price * nights;
  const addonsTotal = ADDONS.filter(a => addons.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
  const totalPrice = hotelTotal + addonsTotal;

  const formatPrice = (p: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(p);

  function toggleAddon(id: string) {
    setAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleCheckout() {
    setStep("checkout");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("processing");
    setTimeout(() => setStep("success"), 2800);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/88 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl rounded-3xl shadow-2xl shadow-black/60 animate-in zoom-in-95 fade-in duration-300 overflow-hidden max-h-[92vh] border border-foreground/[0.07]">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0510] via-[#0d1220] to-[#080612]" />
        <DiamondPattern className="absolute inset-0 w-full h-full text-pitch/[0.04] pointer-events-none" />
        <div className="absolute -top-20 left-1/3 w-[350px] h-[250px] rounded-full bg-pitch/[0.05] blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-[300px] h-[300px] rounded-full bg-accent/[0.03] blur-[80px] pointer-events-none" />

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-foreground/50 hover:text-foreground transition">
          <X className="h-4 w-4" />
        </button>

        {/* Scrollable */}
        <div className="relative overflow-y-auto max-h-[92vh]">

          {/* ─── CONFIGURE ─── */}
          {step === "configure" && (
            <div className="relative">
              {/* Header */}
              <div className="relative px-6 sm:px-8 pt-7 pb-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pitch/30 to-transparent" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-pitch/10 border border-pitch/20">
                    <Hotel className="h-4 w-4 text-pitch" />
                  </div>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-pitch/80">
                    Accommodations · Travel Package
                  </span>
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  Build Your Travel Package
                </h2>
                <p className="mt-2 font-[family-name:var(--font-serif)] italic text-foreground/50 text-base max-w-lg">
                  Select your preferred hotel, experiences, and car rentals to create your ideal FIFA World Cup 2026™ trip.
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />
              </div>

              {/* Venue selector */}
              <div className="relative px-6 sm:px-8 py-4 border-b border-foreground/[0.06]">
                <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-2.5">
                  <MapPin className="inline h-3 w-3 mr-1 -mt-0.5" />
                  Destination City
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {VENUES.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVenue(v)}
                      className={`text-left px-3 py-2 rounded-lg text-[11px] border transition-all ${
                        selectedVenue === v
                          ? "border-pitch/40 bg-pitch/[0.08] text-pitch shadow-[inset_0_1px_0_0_rgba(26,138,62,0.1)]"
                          : "border-foreground/8 bg-foreground/[0.02] text-foreground/50 hover:border-foreground/15 hover:bg-foreground/[0.04]"
                      }`}
                    >
                      {selectedVenue === v && <Check className="inline h-2.5 w-2.5 mr-1 -mt-0.5" />}
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hotel tier */}
              <div className="relative px-6 sm:px-8 py-6">
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-foreground/45 mb-4">
                  Choose Your Hotel
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {HOTEL_TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedHotel(tier.id)}
                      className={`relative text-left p-5 rounded-2xl border transition-all duration-200 ${
                        selectedHotel === tier.id
                          ? "border-pitch/40 bg-pitch/[0.05] shadow-[inset_0_1px_0_0_rgba(26,138,62,0.1),0_0_25px_rgba(26,138,62,0.05)]"
                          : "border-foreground/8 bg-foreground/[0.02] hover:border-foreground/15 hover:bg-foreground/[0.04]"
                      }`}
                    >
                      {selectedHotel === tier.id && (
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-pitch shadow-[0_0_8px_rgba(26,138,62,0.5)]" />
                      )}
                      <span className="block font-[family-name:var(--font-display)] text-sm font-bold text-foreground/90">{tier.name}</span>
                      <span className="block mt-1 text-[11px] text-foreground/40 font-[family-name:var(--font-mono)]">{tier.stars}</span>
                      <span className="block mt-3 font-[family-name:var(--font-mono)] text-[13px] font-bold text-pitch/80">
                        {formatPrice(tier.price)}
                      </span>
                      <span className="block mt-0.5 text-[10px] text-foreground/30">per night</span>
                      <p className="mt-3 text-[11px] text-foreground/40 leading-snug line-clamp-2">{tier.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Nights */}
                <div className="mt-6 flex items-center gap-6">
                  <div>
                    <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-2">
                      Number of Nights
                    </label>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setNights(Math.max(1, nights - 1))} className="w-9 h-9 rounded-lg border border-foreground/12 bg-foreground/[0.03] text-foreground/70 hover:border-foreground/25 transition flex items-center justify-center font-bold text-sm">−</button>
                      <span className="font-[family-name:var(--font-mono)] text-lg font-bold text-foreground w-8 text-center tabular-nums">{nights}</span>
                      <button type="button" onClick={() => setNights(Math.min(14, nights + 1))} className="w-9 h-9 rounded-lg border border-foreground/12 bg-foreground/[0.03] text-foreground/70 hover:border-foreground/25 transition flex items-center justify-center font-bold text-sm">+</button>
                    </div>
                  </div>
                </div>

                {/* Add-ons */}
                <div className="mt-6 pt-5 border-t border-foreground/[0.06]">
                  <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-foreground/45 mb-3">
                    Add-ons
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ADDONS.map((addon) => (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddon(addon.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          addons.includes(addon.id)
                            ? "border-pitch/30 bg-pitch/[0.04]"
                            : "border-foreground/8 bg-foreground/[0.02] hover:border-foreground/15"
                        }`}
                      >
                        <addon.icon className={`h-4 w-4 shrink-0 ${addons.includes(addon.id) ? "text-pitch" : "text-foreground/40"}`} />
                        <div className="text-left flex-1">
                          <span className="block text-[11px] font-medium text-foreground/80">{addon.label}</span>
                          <span className="block text-[10px] text-foreground/40 font-[family-name:var(--font-mono)]">{formatPrice(addon.price)}{addon.unit}</span>
                        </div>
                        {addons.includes(addon.id) && <Check className="h-3.5 w-3.5 text-pitch" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="relative px-6 sm:px-8 py-5 border-t border-foreground/8">
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-pitch/15 to-transparent" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="block text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-foreground/40">
                      {currentHotel.name} · {nights} {nights === 1 ? "night" : "nights"}{addons.length > 0 ? ` + ${addons.length} add-on${addons.length > 1 ? "s" : ""}` : ""}
                    </span>
                    <span className="block font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mt-1">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={!selectedVenue}
                    className="group w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-pitch to-[#158a3e] text-background font-[family-name:var(--font-display)] font-bold text-sm tracking-wide hover:from-pitch/90 hover:to-[#127a35] transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(26,138,62,0.15)] disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Book Package
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background/20 transition group-hover:bg-background/30">→</span>
                    </span>
                  </button>
                </div>
                {!selectedVenue && (
                  <p className="mt-2 text-[10px] text-foreground/30 font-[family-name:var(--font-mono)]">
                    ↑ Select a destination city to continue
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ─── CHECKOUT ─── */}
          {step === "checkout" && (
            <div className="relative">
              <div className="relative px-6 sm:px-8 pt-7 pb-5">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pitch/30 to-transparent" />
                <button onClick={() => setStep("configure")} className="text-[11px] font-[family-name:var(--font-mono)] text-foreground/40 hover:text-foreground/70 transition mb-3 flex items-center gap-1">
                  ← Back to package
                </button>
                <h2 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold text-foreground">
                  Confirm Your Travel Package
                </h2>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />
              </div>

              <div className="relative px-6 sm:px-8 py-6 grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Form */}
                <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Full Name</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.06)] transition" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Email</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@email.com" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.06)] transition" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Card Number</label>
                    <div className="relative">
                      <input type="text" required value={form.card} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 16); const formatted = v.replace(/(.{4})/g, "$1 ").trim(); setForm({ ...form, card: formatted }); }} placeholder="4242 4242 4242 4242" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.06)] transition font-[family-name:var(--font-mono)]" />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Expiry</label>
                      <input type="text" required value={form.expiry} onChange={(e) => { let v = e.target.value.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); setForm({ ...form, expiry: v }); }} placeholder="MM/YY" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.06)] transition font-[family-name:var(--font-mono)]" />
                    </div>
                    <div>
                      <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">CVV</label>
                      <input type="text" required value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="123" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-pitch/40 focus:bg-pitch/[0.02] focus:shadow-[0_0_0_3px_rgba(26,138,62,0.06)] transition font-[family-name:var(--font-mono)]" />
                    </div>
                  </div>
                  <div className="pt-3">
                    <button type="submit" className="group w-full py-4 rounded-xl bg-gradient-to-r from-pitch to-[#158a3e] text-background font-[family-name:var(--font-display)] font-bold text-sm tracking-wide hover:from-pitch/90 hover:to-[#127a35] transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(26,138,62,0.15)]">
                      <span className="flex items-center justify-center gap-2">
                        <ShieldCheck className="h-4 w-4 opacity-70" />
                        Confirm {formatPrice(totalPrice)}
                      </span>
                    </button>
                    <p className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-foreground/30 font-[family-name:var(--font-mono)]">
                      <span className="w-1 h-1 rounded-full bg-pitch/50" />
                      Simulated transaction · No real charge
                      <span className="w-1 h-1 rounded-full bg-pitch/50" />
                    </p>
                  </div>
                </form>

                {/* Summary */}
                <div className="md:col-span-2">
                  <div className="sticky top-4 p-5 rounded-2xl bg-foreground/[0.03] border border-foreground/8">
                    <p className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/40 mb-4">Trip Summary</p>
                    <div className="space-y-3 text-[12px]">
                      <div className="flex justify-between">
                        <span className="text-foreground/50">Destination</span>
                        <span className="text-foreground/80 font-medium">{selectedVenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/50">Hotel</span>
                        <span className="text-foreground/80 font-medium">{currentHotel.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/50">Nights</span>
                        <span className="text-foreground/80 font-medium">{nights}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/50">Hotel subtotal</span>
                        <span className="text-foreground/80 font-[family-name:var(--font-mono)]">{formatPrice(hotelTotal)}</span>
                      </div>
                      {addons.length > 0 && ADDONS.filter(a => addons.includes(a.id)).map(a => (
                        <div key={a.id} className="flex justify-between">
                          <span className="text-foreground/50">{a.label}</span>
                          <span className="text-foreground/80 font-[family-name:var(--font-mono)]">{formatPrice(a.price)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-3 border-t border-foreground/8">
                        <span className="text-foreground/70 font-semibold">Total</span>
                        <span className="font-[family-name:var(--font-display)] font-bold text-lg text-foreground">{formatPrice(totalPrice)}</span>
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
                <div className="w-72 h-72 rounded-full bg-pitch/[0.04] blur-[60px] animate-pulse" />
              </div>
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full border border-pitch/15 flex items-center justify-center">
                  <div className="absolute w-24 h-24 rounded-full border-2 border-transparent border-t-pitch/40 animate-spin" />
                  <div className="w-16 h-16 rounded-full bg-pitch/[0.06] border border-pitch/20 flex items-center justify-center">
                    <Loader2 className="h-7 w-7 text-pitch animate-spin [animation-duration:1.5s]" />
                  </div>
                </div>
              </div>
              <h3 className="relative font-[family-name:var(--font-display)] text-xl font-bold text-foreground mb-2">
                Booking Your Package
              </h3>
              <p className="relative text-sm text-foreground/45 max-w-sm font-[family-name:var(--font-serif)] italic">
                Securing your {currentHotel.name} in {selectedVenue}...
              </p>
              <div className="relative mt-8 flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-pitch/70 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
            </div>
          )}

          {/* ─── SUCCESS ─── */}
          {step === "success" && (
            <div className="relative px-6 sm:px-8 py-16 flex flex-col items-center justify-center text-center">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-56 rounded-full bg-pitch/[0.05] blur-[50px]" />
              </div>

              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-pitch/20 to-pitch/5 border border-pitch/30 flex items-center justify-center mb-8 animate-in zoom-in duration-500 shadow-[0_0_40px_rgba(26,138,62,0.12)]">
                <div className="absolute inset-1.5 rounded-full border border-pitch/10" />
                <Plane className="h-10 w-10 text-pitch" />
                <Check className="absolute -bottom-1 -right-1 h-7 w-7 text-pitch bg-[#0d1220] rounded-full p-1 border border-pitch/30" />
              </div>

              <h3 className="relative font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-2">
                Trip Booked!
              </h3>
              <p className="relative text-sm text-foreground/45 max-w-md mb-8 font-[family-name:var(--font-serif)] italic">
                Your travel package to <strong className="text-foreground/70 not-italic">{selectedVenue}</strong> is confirmed.
              </p>

              {/* Confirmation card */}
              <div className="relative w-full max-w-sm">
                <div className="absolute top-1/2 -left-2.5 w-5 h-5 rounded-full bg-[#0a0510]" />
                <div className="absolute top-1/2 -right-2.5 w-5 h-5 rounded-full bg-[#0a0510]" />
                <div className="p-6 rounded-2xl bg-gradient-to-br from-foreground/[0.06] to-foreground/[0.02] border border-foreground/10">
                  <div className="flex items-center justify-center gap-2 mb-5 pb-3 border-b border-dashed border-foreground/10">
                    <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.4em] text-pitch/70">
                      FIFA World Cup 2026™ · Travel
                    </span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Conf #</span>
                      <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">
                        TRV-{Math.random().toString(36).slice(2, 8).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">City</span>
                      <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{selectedVenue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Hotel</span>
                      <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{currentHotel.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Nights</span>
                      <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{nights}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-foreground/8">
                      <span className="text-foreground/50 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider font-semibold">Total</span>
                      <span className="font-[family-name:var(--font-display)] font-bold text-lg text-foreground">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={onClose} className="relative mt-8 px-8 py-3 rounded-xl bg-foreground/[0.05] border border-foreground/15 text-sm text-foreground/80 hover:border-pitch/40 hover:text-pitch hover:bg-pitch/[0.04] transition font-[family-name:var(--font-display)] font-semibold">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
