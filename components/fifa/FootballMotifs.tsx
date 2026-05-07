import type { CSSProperties } from "react";

type Tone = "accent" | "gold" | "pitch";

type MotifProps = {
  className?: string;
  tone?: Tone;
};

const TONE_COLOR: Record<Tone, string> = {
  accent: "#00c8ff",
  gold: "#d4a843",
  pitch: "#1a8a3e",
};

function toneStyle(tone: Tone): CSSProperties {
  return { "--motif-color": TONE_COLOR[tone] } as CSSProperties;
}

export function PitchBlueprint({ className = "", tone = "pitch" }: MotifProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={toneStyle(tone)}
    >
      <svg
        viewBox="0 0 1440 720"
        preserveAspectRatio="xMidYMid meet"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] max-w-full max-h-full football-blueprint"
      >
        {/* Pitch fill — only inside the field rectangle */}
        <rect x="95" y="88" width="1250" height="544" fill="rgba(10,58,26,0.88)" stroke="none" />
        <rect x="95" y="88" width="1250" height="544" pathLength={1} />
        <path d="M720 88V632" pathLength={1} />
        <circle cx="720" cy="360" r="92" pathLength={1} />
        <circle cx="720" cy="360" r="5" className="football-blueprint__solid" pathLength={1} />
        <path d="M95 246H252V474H95" pathLength={1} />
        <path d="M1345 246H1188V474H1345" pathLength={1} />
        <path d="M95 292H156V428H95" pathLength={1} />
        <path d="M1345 292H1284V428H1345" pathLength={1} />
        <path d="M252 296a92 92 0 0 1 0 128" pathLength={1} />
        <path d="M1188 296a92 92 0 0 0 0 128" pathLength={1} />
      </svg>
    </div>
  );
}

export function GoalNetOverlay({ className = "", tone = "accent" }: MotifProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 football-goal-net ${className}`}
      style={toneStyle(tone)}
    />
  );
}

export function BallRoute({ className = "", tone = "accent" }: MotifProps) {
  const path = "M42 132C138 44 230 150 320 78C420 -2 500 88 570 34";

  return (
    <svg
      aria-hidden
      viewBox="0 0 620 170"
      className={`pointer-events-none absolute football-ball-route ${className}`}
      style={toneStyle(tone)}
    >
      <path d={path} className="football-ball-route__shadow" />
      <path d={path} className="football-ball-route__line" pathLength={1} />
      <image
        href="/icons/soccer-ball.svg"
        width="22"
        height="22"
        x="-11"
        y="-11"
        className="football-ball-route__ball"
        style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.45))" }}
      >
        <animateMotion dur="7.5s" repeatCount="indefinite" rotate="auto" path={path} />
      </image>
    </svg>
  );
}

export function CornerFlag({ className = "", tone = "gold" }: MotifProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute football-corner-flag ${className}`}
      style={toneStyle(tone)}
    >
      <span className="football-corner-flag__pole" />
      <span className="football-corner-flag__flag" />
      <span className="football-corner-flag__arc" />
    </div>
  );
}

export function PitchMiniMap({ className = "", tone = "pitch" }: MotifProps) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={toneStyle(tone)}>
      <svg viewBox="0 0 420 180" className="h-full w-full football-mini-pitch" aria-hidden>
        <rect x="18" y="18" width="384" height="144" pathLength={1} />
        <path d="M210 18V162" pathLength={1} />
        <circle cx="210" cy="90" r="30" pathLength={1} />
        <path d="M18 56H70V124H18" pathLength={1} />
        <path d="M402 56H350V124H402" pathLength={1} />
        <path d="M80 128C132 64 188 124 226 74C260 30 322 74 362 38" className="football-mini-pitch__route" />
        <image href="/icons/soccer-ball.svg" x="355" y="31" width="14" height="14" className="football-mini-pitch__ball" />
      </svg>
    </div>
  );
}
