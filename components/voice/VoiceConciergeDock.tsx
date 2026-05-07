"use client";

import { useState, useEffect, useRef } from "react";
import {
  useConversationControls,
  useConversationInput,
  useConversationMode,
  useConversationStatus,
} from "@elevenlabs/react";
import {
  LoaderCircle,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Sparkles,
  X,
} from "lucide-react";
import {
  buildGuestVoiceUserId,
  elevenLabsPublicConfig,
} from "@/lib/voice/public-config";
import { VOICE_STARTER_PROMPTS } from "@/lib/voice/starter-prompts";

type SignedUrlResponse = {
  signedUrl?: string;
  error?: string;
};

async function getSignedUrl() {
  const response = await fetch(elevenLabsPublicConfig.signedUrlEndpoint, {
    cache: "no-store",
  });

  const body = (await response.json().catch(() => null)) as SignedUrlResponse | null;
  if (!response.ok || !body?.signedUrl) {
    throw new Error(body?.error || "Voice assistant is not configured yet.");
  }

  return body.signedUrl;
}

/* ─── Animated waveform bars ─── */
function AudioWaveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-6">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full transition-all duration-300"
          style={{
            height: active ? `${10 + Math.sin(i * 1.1) * 8}px` : "4px",
            background: active
              ? i % 2 === 0 ? "var(--accent)" : "var(--pitch)"
              : "var(--foreground)",
            opacity: active ? 1 : 0.3,
            animation: active ? `voice-bar ${0.5 + i * 0.1}s ease-in-out infinite alternate` : "none",
            animationDelay: `${i * 0.07}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Football pitch SVG — more visible ─── */
function PitchDecor() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full text-pitch"
      viewBox="0 0 380 480"
      preserveAspectRatio="none"
    >
      {/* Outer pitch boundary */}
      <rect x="20" y="20" width="340" height="440" rx="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12" />
      {/* Center line */}
      <line x1="20" y1="240" x2="360" y2="240" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
      {/* Center circle */}
      <circle cx="190" cy="240" r="50" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.1" />
      <circle cx="190" cy="240" r="3" fill="currentColor" opacity="0.15" />
      {/* Penalty areas */}
      <rect x="110" y="20" width="160" height="70" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.08" />
      <rect x="110" y="390" width="160" height="70" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.08" />
      {/* Goal areas */}
      <rect x="140" y="20" width="100" height="30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
      <rect x="140" y="430" width="100" height="30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
      {/* Corner arcs */}
      <path d="M20 30 A10 10 0 0 1 30 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      <path d="M350 20 A10 10 0 0 1 360 30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      <path d="M20 450 A10 10 0 0 0 30 460" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      <path d="M350 460 A10 10 0 0 0 360 450" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
    </svg>
  );
}

/* ─── Timer hook ─── */
function useCallTimer(active: boolean) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (active) {
      setSeconds(0);
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSeconds(0);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active]);

  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function VoiceConciergeDock() {
  const { startSession, endSession, sendUserMessage } = useConversationControls();
  const { status, message } = useConversationStatus();
  const { isMuted, setMuted } = useConversationInput();
  const { mode, isListening, isSpeaking } = useConversationMode();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const timer = useCallTimer(status === "connected");

  const handleStart = async () => {
    setError(null);
    setIsStarting(true);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const signedUrl = await getSignedUrl();

      await startSession({
        signedUrl,
        userId: buildGuestVoiceUserId(),
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to start the voice concierge."
      );
    } finally {
      setIsStarting(false);
    }
  };

  const handleEnd = async () => {
    setError(null);
    await endSession();
  };

  const isConnected = status === "connected";

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[70] flex max-w-[calc(100vw-2.5rem)] flex-col items-end gap-4">
        {/* ─── Expanded Modal ─── */}
        {open && (
          <div
            className="w-[380px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-3xl border border-pitch/20 bg-background/96 shadow-[0_32px_90px_rgba(0,0,0,0.55),0_0_0_1px_rgba(26,138,62,0.1)] backdrop-blur-2xl"
            style={{ animation: "voice-dock-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards" }}
          >
            {/* Pitch decoration */}
            <PitchDecor />

            {/* Top accent bar */}
            <div className="relative h-1 w-full bg-gradient-to-r from-pitch via-accent to-gold" />

            {/* Header */}
            <div className="relative flex items-center justify-between gap-4 px-6 pt-5 pb-3">
              <div className="flex items-center gap-3">
                {/* Football icon */}
                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pitch/25 to-pitch-dark/20 border border-pitch/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icons/soccer-ball.svg" alt="" className="h-6 w-6" />
                  {isConnected && (
                    <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-pitch border-2 border-background animate-pulse" />
                  )}
                </div>
                <div>
                  <div className="font-[family-name:var(--font-display)] text-base font-bold tracking-tight text-foreground">
                    {elevenLabsPublicConfig.agentLabel}
                  </div>
                  <div className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-pitch/70">
                    {isConnected ? "⚽ Live" : "FIFA World Cup 2026™"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-foreground/10 text-foreground/50 transition hover:border-foreground/25 hover:text-foreground hover:bg-foreground/5"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* ─── Call Area ─── */}
            <div className="relative px-6 pb-6">
              {/* Active call state */}
              {isConnected ? (
                <div className="space-y-5">
                  {/* Waveform + timer */}
                  <div className="flex flex-col items-center gap-3 rounded-2xl border border-pitch/15 bg-pitch/[0.04] p-6">
                    <AudioWaveform active={isSpeaking || isListening} />
                    <div className="font-[family-name:var(--font-mono)] text-2xl tabular-nums tracking-tight text-foreground">
                      {timer}
                    </div>
                    <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-foreground/45">
                      {isSpeaking ? "⚽ Speaking…" : isListening ? "🎙️ Listening…" : "On call"}
                    </div>
                  </div>

                  {/* Call controls */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setMuted(!isMuted)}
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition ${
                        isMuted
                          ? "border-gold/40 bg-gold/10 text-gold"
                          : "border-foreground/12 bg-foreground/5 text-foreground/70 hover:border-foreground/25 hover:text-foreground"
                      }`}
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleEnd}
                      className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#ef4444] text-white shadow-[0_4px_20px_rgba(239,68,68,0.35)] transition hover:bg-[#dc2626] hover:shadow-[0_6px_28px_rgba(239,68,68,0.45)]"
                      aria-label="End call"
                    >
                      <PhoneOff className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Starter prompts during call */}
                  <div>
                    <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.28em] text-gold/80 mb-2.5">
                      <Sparkles className="h-3 w-3" />
                      Quick questions
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {VOICE_STARTER_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => sendUserMessage(prompt)}
                          className="rounded-lg border border-foreground/8 bg-foreground/[0.03] px-2.5 py-1.5 text-[11px] leading-snug text-foreground/60 transition hover:border-pitch/30 hover:text-foreground hover:bg-pitch/[0.06]"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* ─── Idle / Pre-call state ─── */
                <div className="space-y-5">
                  <div className="rounded-2xl border border-pitch/10 bg-pitch/[0.03] p-5 text-center">
                    {/* Audio wave visual */}
                    <div className="mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-full border-2 border-pitch/20 bg-gradient-to-br from-pitch/8 via-background to-accent/5">
                      <div className="flex items-end gap-[4px] h-9">
                        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                          <span
                            key={i}
                            className="w-[4px] rounded-full"
                            style={{
                              height: `${14 + Math.sin(i * 0.9) * 10}px`,
                              background: i % 2 === 0 ? "var(--pitch)" : "var(--accent)",
                              opacity: 0.5 + (i % 3) * 0.15,
                              animation: `voice-bar ${0.7 + i * 0.12}s ease-in-out infinite alternate`,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-foreground mb-1.5">
                      Your AI Match Guide
                    </h3>
                    <p className="text-[13px] leading-relaxed text-foreground/55 max-w-[260px] mx-auto">
                      Ask about tickets, venues, schedules, and hospitality packages — all by voice.
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-[#ef4444]/20 bg-[#ef4444]/[0.06] px-4 py-3">
                      <p className="text-sm leading-relaxed text-[#ff8f8f]">{error}</p>
                    </div>
                  )}

                  {/* Start call button */}
                  <button
                    type="button"
                    onClick={handleStart}
                    disabled={isStarting}
                    className="relative w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pitch to-pitch-dark px-6 py-4 font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-wider text-white shadow-[0_8px_32px_rgba(26,138,62,0.3)] transition hover:shadow-[0_12px_40px_rgba(26,138,62,0.4)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                  >
                    {isStarting ? (
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                    ) : (
                      <Phone className="h-5 w-5" />
                    )}
                    {isStarting ? "Connecting…" : "Start conversation"}
                  </button>

                  {/* Starter prompts preview */}
                  <div>
                    <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.28em] text-gold/70 mb-2.5">
                      <Sparkles className="h-3 w-3" />
                      Try asking
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {VOICE_STARTER_PROMPTS.map((prompt) => (
                        <span
                          key={prompt}
                          className="rounded-lg border border-pitch/10 bg-pitch/[0.03] px-2.5 py-1.5 text-[11px] leading-snug text-foreground/50"
                        >
                          {prompt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {message && (
                <p className="mt-4 font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em] text-foreground/35 text-center">
                  {String(message)}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ─── Floating Trigger Button ─── */}
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className={`group relative inline-flex items-center gap-3 rounded-full border px-5 py-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-all duration-300 ${
            isConnected
              ? "border-pitch/50 bg-pitch/15 text-pitch hover:bg-pitch/20 hover:border-pitch/70"
              : "border-pitch/25 bg-background/95 text-foreground hover:border-pitch/50 hover:shadow-[0_20px_60px_rgba(26,138,62,0.15)]"
          }`}
        >
          {/* Animated ring when connected */}
          {isConnected && (
            <span
              className="absolute inset-0 rounded-full border-2 border-pitch/40"
              style={{ animation: "voice-ring-pulse 2s ease-in-out infinite" }}
            />
          )}
          {/* Football icon */}
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pitch to-pitch-dark shadow-[0_2px_8px_rgba(26,138,62,0.3)]">
            {isConnected ? (
              <AudioWaveform active={isSpeaking || isListening} />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src="/icons/soccer-ball.svg" alt="" className="h-4.5 w-4.5" />
            )}
          </span>
          <span className="font-[family-name:var(--font-display)] text-sm font-bold tracking-tight">
            {isConnected ? "On call" : "Ask the AI"}
          </span>
          {isConnected && (
            <span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums tracking-tight text-pitch/80">
              {timer}
            </span>
          )}
        </button>
      </div>
    </>
  );
}