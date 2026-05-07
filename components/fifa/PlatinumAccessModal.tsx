"use client";

import { useState, useEffect } from "react";
import { X, Check, Loader2, ShieldCheck, Crown, Star, Gem, Sparkles, MapPin } from "lucide-react";

type Step = "form" | "processing" | "success";

const VENUES = [
  "Mexico City", "Guadalajara", "Monterrey", "Toronto", "Vancouver",
  "Atlanta", "Boston", "Dallas", "Houston", "Kansas City",
  "Los Angeles", "Miami", "New York / New Jersey", "Philadelphia", "San Francisco Bay Area", "Seattle",
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

const FEATURES = [
  { icon: Gem, label: "Full-service customization" },
  { icon: Crown, label: "Most premium access available" },
  { icon: Star, label: "Exclusive all-encompassing experience" },
  { icon: Sparkles, label: "Personal concierge & bespoke itinerary" },
];

export default function PlatinumAccessModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", venues: [] as string[], notes: "" });

  useEffect(() => {
    if (open) {
      setStep("form");
      setForm({ name: "", email: "", company: "", phone: "", venues: [], notes: "" });
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("processing");
    setTimeout(() => setStep("success"), 2800);
  }

  function toggleVenue(v: string) {
    setForm(prev => ({
      ...prev,
      venues: prev.venues.includes(v) ? prev.venues.filter(x => x !== v) : [...prev.venues, v],
    }));
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/88 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-3xl shadow-2xl shadow-black/60 animate-in zoom-in-95 fade-in duration-300 overflow-hidden max-h-[92vh] border border-foreground/[0.07]">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0510] via-[#0d1220] to-[#080612]" />
        <DiamondPattern className="absolute inset-0 w-full h-full text-gold/[0.04] pointer-events-none" />
        <div className="absolute -top-20 left-1/3 w-[350px] h-[250px] rounded-full bg-gold/[0.06] blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-[300px] h-[300px] rounded-full bg-[#6b21a8]/[0.04] blur-[80px] pointer-events-none" />

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 text-foreground/50 hover:text-foreground transition">
          <X className="h-4 w-4" />
        </button>

        {/* Scrollable */}
        <div className="relative overflow-y-auto max-h-[92vh]">

          {/* ─── FORM ─── */}
          {step === "form" && (
            <div className="relative">
              {/* Header */}
              <div className="relative px-6 sm:px-8 pt-7 pb-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gold/10 border border-gold/20">
                    <Gem className="h-4 w-4 text-gold" />
                  </div>
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-gold/80">
                    Platinum Access · Inquiry
                  </span>
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                  Register Your Interest
                </h2>
                <p className="mt-2 font-[family-name:var(--font-serif)] italic text-foreground/50 text-base max-w-lg">
                  The most exclusive offering — full-service customization and the most premium access available for FIFA World Cup 2026™.
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />
              </div>

              {/* Features */}
              <div className="relative px-6 sm:px-8 py-4 border-b border-foreground/[0.06]">
                <div className="flex flex-wrap gap-4">
                  {FEATURES.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <feat.icon className="h-3.5 w-3.5 text-gold/70" />
                      <span className="text-[11px] text-foreground/50 font-[family-name:var(--font-mono)]">{feat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="relative px-6 sm:px-8 py-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Full Name</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-gold/40 focus:bg-gold/[0.02] focus:shadow-[0_0_0_3px_rgba(212,168,67,0.06)] transition" />
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Company</label>
                    <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Your Organization" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-gold/40 focus:bg-gold/[0.02] focus:shadow-[0_0_0_3px_rgba(212,168,67,0.06)] transition" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Email</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@company.com" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-gold/40 focus:bg-gold/[0.02] focus:shadow-[0_0_0_3px_rgba(212,168,67,0.06)] transition" />
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-gold/40 focus:bg-gold/[0.02] focus:shadow-[0_0_0_3px_rgba(212,168,67,0.06)] transition" />
                  </div>
                </div>

                {/* Venue preference grid */}
                <div>
                  <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-2.5">
                    <MapPin className="inline h-3 w-3 mr-1 -mt-0.5" />
                    Preferred Venues <span className="text-foreground/25">(select any)</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {VENUES.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => toggleVenue(v)}
                        className={`text-left px-3 py-2 rounded-lg text-[11px] border transition-all ${
                          form.venues.includes(v)
                            ? "border-gold/40 bg-gold/[0.08] text-gold shadow-[inset_0_1px_0_0_rgba(212,168,67,0.1)]"
                            : "border-foreground/8 bg-foreground/[0.02] text-foreground/50 hover:border-foreground/15 hover:bg-foreground/[0.04]"
                        }`}
                      >
                        {form.venues.includes(v) && <Check className="inline h-2.5 w-2.5 mr-1 -mt-0.5" />}
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-foreground/45 mb-1.5">Additional Notes</label>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Group size, special requirements, dates of interest..." rows={3} className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-gold/40 focus:bg-gold/[0.02] focus:shadow-[0_0_0_3px_rgba(212,168,67,0.06)] transition resize-none" />
                </div>

                {/* Submit */}
                <div className="pt-3">
                  <button type="submit" className="group w-full py-4 rounded-xl bg-gradient-to-r from-gold to-[#c49a38] text-background font-[family-name:var(--font-display)] font-bold text-sm tracking-wide hover:from-gold/90 hover:to-[#b8903a] transition-all active:scale-[0.98] shadow-[0_4px_20px_rgba(212,168,67,0.15)]">
                    <span className="flex items-center justify-center gap-2">
                      <ShieldCheck className="h-4 w-4 opacity-70" />
                      Submit Inquiry
                    </span>
                  </button>
                  <p className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-foreground/30 font-[family-name:var(--font-mono)]">
                    <span className="w-1 h-1 rounded-full bg-gold/50" />
                    A dedicated advisor will contact you within 24 hours
                    <span className="w-1 h-1 rounded-full bg-gold/50" />
                  </p>
                </div>
              </form>
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
                Submitting Your Inquiry
              </h3>
              <p className="relative text-sm text-foreground/45 max-w-sm font-[family-name:var(--font-serif)] italic">
                Registering your interest in Platinum Access...
              </p>
              <div className="relative mt-8 flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-gold/70 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
            </div>
          )}

          {/* ─── SUCCESS ─── */}
          {step === "success" && (
            <div className="relative px-6 sm:px-8 py-16 flex flex-col items-center justify-center text-center">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-56 rounded-full bg-gold/[0.05] blur-[50px]" />
              </div>

              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center mb-8 animate-in zoom-in duration-500 shadow-[0_0_40px_rgba(212,168,67,0.12)]">
                <div className="absolute inset-1.5 rounded-full border border-gold/10" />
                <Gem className="h-10 w-10 text-gold" />
                <Check className="absolute -bottom-1 -right-1 h-7 w-7 text-gold bg-[#0d1220] rounded-full p-1 border border-gold/30" />
              </div>

              <h3 className="relative font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-2">
                Inquiry Submitted!
              </h3>
              <p className="relative text-sm text-foreground/45 max-w-md mb-8 font-[family-name:var(--font-serif)] italic">
                Our Platinum Access team will reach out to <strong className="text-foreground/70 not-italic">{form.email}</strong> within 24 hours.
              </p>

              {/* Confirmation card */}
              <div className="relative w-full max-w-sm">
                <div className="absolute top-1/2 -left-2.5 w-5 h-5 rounded-full bg-[#0a0510]" />
                <div className="absolute top-1/2 -right-2.5 w-5 h-5 rounded-full bg-[#0a0510]" />
                <div className="p-6 rounded-2xl bg-gradient-to-br from-foreground/[0.06] to-foreground/[0.02] border border-foreground/10">
                  <div className="flex items-center justify-center gap-2 mb-5 pb-3 border-b border-dashed border-foreground/10">
                    <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.4em] text-gold/70">
                      Platinum Access · Inquiry
                    </span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Ref #</span>
                      <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">
                        PLT-{Math.random().toString(36).slice(2, 8).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Name</span>
                      <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{form.name}</span>
                    </div>
                    {form.company && (
                      <div className="flex items-center justify-between">
                        <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Company</span>
                        <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium">{form.company}</span>
                      </div>
                    )}
                    {form.venues.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-foreground/40 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider">Venues</span>
                        <span className="font-[family-name:var(--font-mono)] text-foreground/70 font-medium text-right max-w-[180px]">{form.venues.length} selected</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-foreground/8">
                      <span className="text-foreground/50 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider font-semibold">Status</span>
                      <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] text-gold font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                        Pending Review
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={onClose} className="relative mt-8 px-8 py-3 rounded-xl bg-foreground/[0.05] border border-foreground/15 text-sm text-foreground/80 hover:border-gold/40 hover:text-gold hover:bg-gold/[0.04] transition font-[family-name:var(--font-display)] font-semibold">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
