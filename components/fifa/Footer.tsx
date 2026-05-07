"use client";

import { useState } from "react";
import { ArrowUpRight, ExternalLink, Facebook, Instagram, Music2, Twitter, X } from "lucide-react";
import { PitchBlueprint } from "./FootballMotifs";

const INTERNAL_HREFS = new Set(["#top", "#faq", "/", "/matches", "/bracket", "/bundles"]);

const PRIMARY_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "https://onlocationexp.com/about" },
  { label: "My Account", href: "https://fifaworldcup26.shop.fifa.com/account?lang=en" },
  { label: "My Orders", href: "https://fifaworldcup26.shop.fifa.com/account/tickets?lang=en" },
  { label: "FAQ", href: "#faq" },
  {
    label: "FIFA World Cup 26\u2122 Sales Agents",
    href: "https://fifaworldcup26.hospitality.fifa.com/en/fifa-world-cup-sales-agents",
  },
  { label: "Contact Us", href: "https://onlocationexp.my.site.com/FWC26Support" },
  {
    label: "Request Accessible Hospitality",
    href: "https://onlocationexp.my.site.com/FWC26Support/s/?language=en_US",
  },
];

const PHONES = [
  { code: "USA", phone: "+1 844 652 1685", color: "text-accent" },
  { code: "CAN", phone: "+1 888 502 7844", color: "text-pitch" },
  { code: "MEX", phone: "+52 80 0283 3520", color: "text-gold" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "https://www.fifa.com/legal/privacy-portal" },
  { label: "FIFA Ticket Terms of Use", href: "https://www.fifa.com/legal/ticketing" },
  { label: "On Location Terms of Use", href: "https://onlocationexp.com/terms-of-use" },
  {
    label: "Hospitality Sales Regulations",
    href: "https://fifaworldcup26.hospitality.fifa.com/en/hospitality-sales-regulations",
  },
  { label: "Deposit Terms", href: "https://onlocationexp.com/deposit-terms" },
  { label: "Cookie Policy", href: "https://www.fifa.com/legal/cookies" },
  { label: "Do Not Sell My Personal Info", href: "https://www.fifa.com/legal/privacy-portal" },
  { label: "Cookies Settings", href: "https://www.fifa.com/legal/cookies" },
];

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/fifahospitality/", Icon: Facebook },
  { label: "X", href: "https://x.com/FIFAHospitality", Icon: Twitter },
  { label: "Instagram", href: "https://www.instagram.com/fifahospitality", Icon: Instagram },
  { label: "TikTok", href: "https://www.tiktok.com/@fifahospitality", Icon: Music2 },
];

const LOGOS = {
  footerLockup:
    "https://cdn.prod.website-files.com/689fd0a66c26ce8fe1446c25/68a5b84cd5c2daf5cba1b609_FIFA%20OL%20Logo.webp",
};

export default function Footer() {
  const [externalModal, setExternalModal] = useState<{ label: string; href: string } | null>(null);

  function handleLinkClick(link: { label: string; href: string }, e: React.MouseEvent) {
    if (!INTERNAL_HREFS.has(link.href) && !link.href.startsWith("/")) {
      e.preventDefault();
      setExternalModal(link);
    }
  }

  return (
    <footer
      id="footer"
      className="relative isolate overflow-hidden bg-background font-[family-name:var(--font-display)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 h-[420px] w-[60vw] rounded-full opacity-[0.14]"
        style={{ background: "radial-gradient(closest-side, #d4a843 0%, transparent 70%)" }}
      />
      <PitchBlueprint
        className="opacity-[0.06] [mask-image:linear-gradient(180deg,#000_0%,transparent_78%)]"
        tone="gold"
      />

      <div className="relative z-[1] px-6 sm:px-10 md:px-20 pt-16 sm:pt-20 pb-8">
        <div className="mx-auto w-full max-w-[1600px]">
          {/* Top row: brand + links + register interest */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start pb-12 border-b border-foreground/10">
            {/* Brand lockup */}
            <div className="lg:col-span-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOGOS.footerLockup}
                alt="FIFA World Cup 26 Official Hospitality by On Location"
                className="h-24 w-auto object-contain sm:h-28"
              />
            </div>

            {/* Sitemap */}
            <nav
              aria-label="Footer"
              className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5"
            >
              {PRIMARY_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(link, e)}
                  target={INTERNAL_HREFS.has(link.href) ? undefined : "_blank"}
                  rel={INTERNAL_HREFS.has(link.href) ? undefined : "noopener noreferrer"}
                  className="group inline-flex items-center gap-2 py-1.5 text-foreground/85 hover:text-accent transition cursor-pointer"
                >
                  <span className="font-[family-name:var(--font-display)] font-semibold text-sm sm:text-base">
                    {link.label}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0" />
                </a>
              ))}
            </nav>

            {/* Register interest */}
            <div className="lg:col-span-3">
              <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-foreground/55 mb-3">
                Not ready to make a purchase?
              </div>
              <button
                onClick={() => setExternalModal({ label: "Register Interest", href: "https://fifaworldcup26.hospitality.fifa.com/en/request-info?src=footer_register_interest" })}
                className="group inline-flex items-center justify-between gap-6 w-full rounded-full border border-foreground/30 px-6 py-3.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] text-foreground transition hover:border-gold hover:text-gold cursor-pointer"
              >
                <span>Register interest</span>
                <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
              </button>

              <div className="mt-6 flex items-center gap-3">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 text-foreground/70 transition hover:border-accent hover:text-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Phones row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-8 border-b border-foreground/10">
            <div className="font-[family-name:var(--font-serif)] italic text-foreground/70 text-sm sm:text-base max-w-md">
              Interested in packages not available online? Please call:
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {PHONES.map((p) => (
                <a
                  key={p.code}
                  href={`tel:${p.phone.replace(/\s/g, "")}`}
                  className="group flex items-baseline gap-3"
                >
                  <span
                    className={`font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] ${p.color}`}
                  >
                    {p.code}
                  </span>
                  <span className="font-[family-name:var(--font-display)] font-bold text-foreground text-base sm:text-lg tabular-nums transition group-hover:text-accent">
                    {p.phone}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pt-8">
            <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/50">
              &copy; 2026 On Location Events, LLC
              <span className="mx-2 text-foreground/25">|</span>
              All Rights Reserved
            </div>

            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={(e) => handleLinkClick(l, e)}
                    className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/55 transition hover:text-accent cursor-pointer"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ─── External Link Modal ─── */}
      {externalModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={() => setExternalModal(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative w-full max-w-md rounded-2xl border border-foreground/10 bg-surface/95 backdrop-blur-xl shadow-[0_0_80px_-12px_rgba(0,200,255,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent */}
            <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

            <div className="p-6 sm:p-8">
              {/* Close button */}
              <button
                onClick={() => setExternalModal(null)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/30 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 mb-5">
                <ExternalLink className="h-6 w-6 text-accent" />
              </div>

              {/* Content */}
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-foreground mb-2">
                External Section
              </h3>
              <p className="font-[family-name:var(--font-serif)] italic text-foreground/60 text-sm leading-relaxed mb-2">
                <span className="font-[family-name:var(--font-display)] not-italic font-semibold text-foreground/80">
                  &ldquo;{externalModal.label}&rdquo;
                </span>{" "}
                is not part of this project.
              </p>
              <p className="text-[13px] text-foreground/50 leading-relaxed mb-8">
                This section belongs to the official FIFA World Cup 2026™ Hospitality platform. You can visit the official page to access this feature.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <a
                  href={externalModal.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-background font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.2em] transition hover:bg-accent/90"
                >
                  Official Page
                  <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:rotate-45" />
                </a>
                <button
                  onClick={() => setExternalModal(null)}
                  className="flex-1 inline-flex items-center justify-center rounded-xl border border-foreground/20 px-5 py-3.5 text-foreground/70 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] transition hover:border-foreground/40 hover:text-foreground cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
