"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { FIFA_COUNTDOWN_LOGO } from "@/lib/assets";
import AuthModal from "./AuthModal";

type NavItem =
  | { label: string; href: string }
  | { label: string; children: { label: string; href: string }[] };

// Mirrors the official FIFA Hospitality top nav.
// Items without a real section use "#" as placeholder.
const NAV: NavItem[] = [
  { label: "Single Matches", href: "/matches" },
  { label: "Bracket", href: "/bracket" },
  {
    label: "Match Offerings",
    children: [
      { label: "Venue Series", href: "/bundles?view=venue-series" },
      { label: "Follow My Team", href: "/bundles?view=follow-team" },
      { label: "Private Suites", href: "#" },
      { label: "Multi-Match Series", href: "/matches?mode=multi" },
    ],
  },
  { label: "FAQ", href: "#faq" },
  {
    label: "More",
    children: [
      { label: "About", href: "#" },
      { label: "Venues", href: "#cities" },
      { label: "Blog", href: "#stories" },
    ],
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#020608]/85 backdrop-blur-md border-b border-foreground/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 md:px-10">
          {/* Brand */}
          <a
            href="/"
            className="flex items-center gap-2 sm:gap-3 min-w-0 group"
            aria-label="World Cup 26 — home"
          >
            <Image
              src={FIFA_COUNTDOWN_LOGO}
              alt=""
              width={48}
              height={48}
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain drop-shadow-[0_0_18px_rgba(0,200,255,0.35)] flex-shrink-0"
              unoptimized
              priority
            />
            <div className="hidden xs:flex flex-col leading-none min-w-0">
              <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/50">
                FIFA · 2026
              </span>
              <span className="font-[family-name:var(--font-display)] text-sm sm:text-base font-bold uppercase tracking-tight text-foreground truncate">
                World Cup 26
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) =>
              "children" in item ? (
                <div key={item.label} className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-foreground/60 hover:text-accent px-3 py-2 rounded transition-colors"
                  >
                    {item.label}
                    <ChevronDown
                      size={12}
                      className="transition-transform group-hover:rotate-180"
                    />
                  </button>
                  <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                    <div className="min-w-[180px] rounded-md border border-foreground/10 bg-[#020608]/95 backdrop-blur-md py-2 shadow-xl">
                      {item.children.map((c) => (
                        <a
                          key={c.label}
                          href={c.href}
                          className="block px-4 py-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-foreground/70 hover:text-accent hover:bg-foreground/5 transition-colors"
                        >
                          {c.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-foreground/60 hover:text-accent px-3 py-2 rounded transition-colors"
                >
                  {item.label}
                </a>
              )
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="hidden md:inline-flex font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-[0.25em] rounded-full bg-foreground text-background px-4 py-2 hover:bg-accent transition-colors"
            >
              Log In / Sign Up
            </button>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-foreground/15 text-foreground hover:bg-foreground/10 transition"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-[#020608]/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <nav
          className={`absolute top-14 sm:top-16 left-0 right-0 bg-[#020608]/95 border-b border-foreground/10 px-4 sm:px-6 py-6 transition-transform duration-300 ${
            open ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          <ul className="flex flex-col">
            {NAV.map((item, i) => (
              <li
                key={item.label}
                className="border-b border-foreground/5 last:border-0"
              >
                {"children" in item ? (
                  <details className="group">
                    <summary className="flex items-baseline gap-3 py-3.5 font-[family-name:var(--font-display)] text-xl font-bold uppercase tracking-tight text-foreground hover:text-accent transition cursor-pointer list-none">
                      <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-widest text-foreground/40 tabular-nums w-6">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">{item.label}</span>
                      <ChevronDown
                        size={16}
                        className="text-foreground/40 transition-transform group-open:rotate-180"
                      />
                    </summary>
                    <ul className="pl-9 pb-3 flex flex-col gap-1">
                      {item.children.map((c) => (
                        <li key={c.label}>
                          <a
                            href={c.href}
                            onClick={() => setOpen(false)}
                            className="block py-1.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-foreground/65 hover:text-accent transition"
                          >
                            {c.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-3 py-3.5 font-[family-name:var(--font-display)] text-xl font-bold uppercase tracking-tight text-foreground hover:text-accent transition"
                  >
                    <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-widest text-foreground/40 tabular-nums w-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setAuthOpen(true);
            }}
            className="mt-5 inline-flex w-full items-center justify-center font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.25em] rounded-full bg-foreground text-background px-4 py-3 hover:bg-accent transition-colors"
          >
            Log In / Sign Up
          </button>
        </nav>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
