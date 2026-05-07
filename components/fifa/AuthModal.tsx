"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Mail, Lock, User, Loader2, Check, ArrowRight } from "lucide-react";
import { HOSPITALITY_HERO_IMAGE } from "@/lib/fifaLanding";

type Mode = "signin" | "signup";
type Status = "idle" | "loading" | "success";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: Mode;
}

const HERO = HOSPITALITY_HERO_IMAGE;

export default function AuthModal({
  open,
  onClose,
  initialMode = "signin",
}: AuthModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // Lock scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "loading") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, status, onClose]);

  // Reset state when reopened
  useEffect(() => {
    if (open) {
      setStatus("idle");
      setMode(initialMode);
    }
  }, [open, initialMode]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("loading");
    // Simulated auth
    window.setTimeout(() => {
      setStatus("success");
      window.setTimeout(() => {
        onClose();
        // Soft reset after closing animation finishes
        window.setTimeout(() => {
          setEmail("");
          setName("");
          setPassword("");
        }, 200);
      }, 1100);
    }, 1400);
  };

  const displayName = name.trim().split(" ")[0] || "Guest";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={mode === "signin" ? "Sign in" : "Create account"}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={() => status !== "loading" && onClose()}
        className="absolute inset-0 bg-[#020608]/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
      />

      {/* Panel */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-foreground/10 bg-[#0a0d12] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] animate-[modalIn_0.25s_ease-out]">
        {/* Close */}
        <button
          type="button"
          onClick={() => status !== "loading" && onClose()}
          disabled={status === "loading"}
          aria-label="Close modal"
          className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-[#020608]/60 text-foreground/70 backdrop-blur-md hover:text-accent hover:border-accent/40 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <X size={16} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Visual side */}
          <aside className="relative hidden md:block min-h-[560px] overflow-hidden">
            <Image
              src={HERO}
              alt=""
              fill
              unoptimized
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#020608]/30 via-[#020608]/50 to-[#020608]/95" />
            <div className="absolute inset-0 flex flex-col justify-between p-8">
              <div>
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-accent">
                  Official Hospitality
                </span>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold uppercase leading-[0.95] tracking-tight text-foreground">
                  FIFA World{" "}
                  <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight bg-gradient-to-br from-accent via-foreground to-gold bg-clip-text text-transparent">
                    Cup&nbsp;2026
                  </span>
                </h3>
              </div>

              <div>
                <p className="font-[family-name:var(--font-serif)] italic text-foreground/80 text-sm leading-relaxed max-w-xs">
                  Save your favorite matches, track your bundle progress, and
                  unlock concierge access — all from one account.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="block h-px w-10 bg-accent/70" />
                  <span className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.4em] text-foreground/50">
                    On Location · Provider
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Form side */}
          <div className="relative flex flex-col p-7 sm:p-10">
            {/* Tabs */}
            <div
              role="tablist"
              aria-label="Authentication mode"
              className="mb-7 flex items-center gap-1 rounded-full border border-foreground/15 bg-background/60 p-1 self-start"
            >
              {(["signin", "signup"] as Mode[]).map((m) => {
                const active = m === mode;
                return (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => status === "idle" && setMode(m)}
                    className={`px-4 py-1.5 rounded-full font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] transition ${
                      active
                        ? "bg-foreground text-background"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    {m === "signin" ? "Sign In" : "Sign Up"}
                  </button>
                );
              })}
            </div>

            {status === "success" ? (
              <SuccessState mode={mode} name={displayName} />
            ) : (
              <>
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold uppercase leading-[0.95] tracking-tight text-foreground">
                  {mode === "signin" ? (
                    <>
                      Welcome{" "}
                      <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight text-foreground/60">
                        back
                      </span>
                    </>
                  ) : (
                    <>
                      Join the{" "}
                      <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight bg-gradient-to-br from-accent via-foreground to-gold bg-clip-text text-transparent">
                        cup
                      </span>
                    </>
                  )}
                </h2>
                <p className="mt-2 font-[family-name:var(--font-serif)] italic text-sm text-foreground/60 max-w-sm">
                  {mode === "signin"
                    ? "Sign in to manage your hospitality bundle and saved matches."
                    : "Create your On Location account to secure premium access."}
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 flex flex-col gap-3"
                >
                  {mode === "signup" && (
                    <Field
                      icon={<User size={14} />}
                      label="Full name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={setName}
                      required
                      disabled={status === "loading"}
                    />
                  )}
                  <Field
                    icon={<Mail size={14} />}
                    label="Email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={setEmail}
                    required
                    disabled={status === "loading"}
                  />
                  <Field
                    icon={<Lock size={14} />}
                    label="Password"
                    type="password"
                    autoComplete={
                      mode === "signin" ? "current-password" : "new-password"
                    }
                    value={password}
                    onChange={setPassword}
                    required
                    minLength={6}
                    disabled={status === "loading"}
                  />

                  {mode === "signin" && (
                    <button
                      type="button"
                      className="self-end font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-foreground/50 hover:text-accent transition"
                    >
                      Forgot password?
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-2 group relative inline-flex items-center justify-center gap-2 rounded-full bg-gold text-background px-5 py-3 transition hover:bg-gold/90 disabled:cursor-wait disabled:opacity-90"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.25em]">
                          {mode === "signin"
                            ? "Signing in…"
                            : "Creating account…"}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.25em]">
                          {mode === "signin" ? "Sign In" : "Create Account"}
                        </span>
                        <ArrowRight
                          size={14}
                          className="transition group-hover:translate-x-0.5"
                        />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-6 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-foreground/40 text-center">
                  {mode === "signin" ? "New here?" : "Already a guest?"}{" "}
                  <button
                    type="button"
                    onClick={() =>
                      status === "idle" &&
                      setMode(mode === "signin" ? "signup" : "signin")
                    }
                    className="text-accent hover:text-gold transition"
                  >
                    {mode === "signin" ? "Create account" : "Sign in"}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      <style jsx global>{`
        .auth-input:-webkit-autofill,
        .auth-input:-webkit-autofill:hover,
        .auth-input:-webkit-autofill:focus,
        .auth-input:-webkit-autofill:active {
          -webkit-text-fill-color: rgb(244 244 245);
          caret-color: rgb(244 244 245);
          box-shadow: 0 0 0 1000px rgb(5 8 12) inset;
          -webkit-box-shadow: 0 0 0 1000px rgb(5 8 12) inset;
          transition: background-color 9999s ease-out 0s;
        }
      `}</style>
    </div>
  );
}

function Field({
  icon,
  label,
  type,
  value,
  onChange,
  autoComplete,
  required,
  minLength,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  disabled?: boolean;
}) {
  return (
    <label className="group relative flex items-center gap-3 rounded-md border border-foreground/15 bg-background/40 px-4 py-3 focus-within:border-accent/60 focus-within:bg-background/70 transition">
      <span className="text-foreground/40 group-focus-within:text-accent transition">
        {icon}
      </span>
      <div className="flex-1">
        <span className="block font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.3em] text-foreground/40">
          {label}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          disabled={disabled}
          className="auth-input w-full bg-transparent border-0 outline-none text-foreground text-sm placeholder:text-foreground/30 disabled:opacity-60"
        />
      </div>
    </label>
  );
}

function SuccessState({ mode, name }: { mode: Mode; name: string }) {
  return (
    <div className="flex flex-col items-center text-center py-10 animate-[fadeIn_0.3s_ease-out]">
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 ring-4 ring-gold/10">
        <Check size={28} className="text-gold" strokeWidth={3} />
      </div>
      <h2 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold uppercase leading-tight tracking-tight text-foreground">
        {mode === "signin" ? (
          <>
            Welcome back,{" "}
            <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight bg-gradient-to-br from-accent via-foreground to-gold bg-clip-text text-transparent">
              {name}
            </span>
          </>
        ) : (
          <>
            Account{" "}
            <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight bg-gradient-to-br from-accent via-foreground to-gold bg-clip-text text-transparent">
              ready
            </span>
          </>
        )}
      </h2>
      <p className="mt-3 max-w-sm font-[family-name:var(--font-serif)] italic text-sm text-foreground/65">
        {mode === "signin"
          ? "You're signed in. Redirecting to your hospitality dashboard…"
          : "Your guest profile is live. Closing in a moment…"}
      </p>
      <div className="mt-6 flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/40">
        <Loader2 size={12} className="animate-spin text-accent" />
        Securing session
      </div>
    </div>
  );
}
