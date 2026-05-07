"use client";

import { BallRoute } from "./FootballMotifs";

export default function StadiumPreview() {
  return (
    <div className="relative h-[210px] overflow-hidden rounded-3xl border border-foreground/15 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
      {/* Pitch surface — dark muted green matching theme */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(26,138,62,0.38) 0%, rgba(26,138,62,0.18) 50%, rgba(5,10,15,0.95) 100%)",
        }}
      />
      {/* Mowing stripes */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0) 0 36px, rgba(0,0,0,0.4) 36px 72px)",
        }}
      />
      {/* Pitch markings */}
      <svg
        viewBox="0 0 500 220"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <g
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1.4"
          strokeLinejoin="miter"
        >
          <rect x="20" y="20" width="460" height="180" />
          <path d="M250 20V200" />
          <circle cx="250" cy="110" r="34" />
          <circle cx="250" cy="110" r="2" fill="rgba(255,255,255,0.6)" />
          <path d="M20 70H72V150H20" />
          <path d="M480 70H428V150H480" />
          <path d="M20 88H38V132H20" />
          <path d="M480 88H462V132H480" />
        </g>
      </svg>
      {/* Animated ball — same BallRoute component as other sections */}
      <BallRoute
        className="inset-0 h-full w-full opacity-90"
        tone="accent"
      />
      {/* Bottom shade for caption legibility */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(5,10,15,0.78)_100%)]"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-4 p-4">
        <div>
          <div className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.35em] text-accent">
            Venue scan
          </div>
          <div className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-tight text-foreground">
            16 host stadiums
          </div>
        </div>
        <div className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/55 text-right">
          3 nations
          <br />
          104 matches
        </div>
      </div>
    </div>
  );
}
