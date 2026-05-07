"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, Phone } from "lucide-react";
import Reveal from "./Reveal";
import Crossfade from "./Crossfade";
import { PitchMiniMap } from "./FootballMotifs";

const StadiumPreview = dynamic(() => import("./StadiumPreview"), {
  ssr: false,
  loading: () => (
    <PitchMiniMap
      className="h-[190px] rounded-3xl border border-foreground/10 bg-surface/50 opacity-80"
      tone="accent"
    />
  ),
});

type Nation = "CAN" | "MEX" | "USA";
type City = { name: string; slug: string; nation: Nation };
type Team = { name: string; slug: string; group: string; iso: string; host?: boolean };

const HOST_ROOT = "/venues";
const TEAM_ROOT = "/teams";

const NATION_META: Record<Nation, { accent: string }> = {
  CAN: { accent: "#ff3b30" },
  MEX: { accent: "#1a8a3e" },
  USA: { accent: "#00c8ff" },
};

const CITIES: City[] = [
  { name: "Mexico City", slug: "mexico-city", nation: "MEX" },
  { name: "Guadalajara", slug: "guadalajara", nation: "MEX" },
  { name: "Monterrey", slug: "monterrey", nation: "MEX" },
  { name: "Toronto", slug: "toronto", nation: "CAN" },
  { name: "Vancouver", slug: "vancouver", nation: "CAN" },
  { name: "Atlanta", slug: "atlanta", nation: "USA" },
  { name: "Boston", slug: "boston", nation: "USA" },
  { name: "Dallas", slug: "dallas", nation: "USA" },
  { name: "Houston", slug: "houston", nation: "USA" },
  { name: "Kansas City", slug: "kansas-city", nation: "USA" },
  { name: "Los Angeles", slug: "los-angeles", nation: "USA" },
  { name: "Miami", slug: "miami", nation: "USA" },
  { name: "Philadelphia", slug: "philadelphia", nation: "USA" },
  { name: "San Francisco Bay Area", slug: "san-francisco-bay-area", nation: "USA" },
  { name: "Seattle", slug: "seattle", nation: "USA" },
  { name: "New York / New Jersey", slug: "new-york-new-jersey", nation: "USA" },
];

const GROUPS: Record<string, Team[]> = {
  A: [
    { name: "Mexico", slug: "mexico", group: "A", iso: "mx", host: true },
    { name: "Korea Republic", slug: "korea-republic", group: "A", iso: "kr" },
    { name: "Czechia", slug: "czechia", group: "A", iso: "cz" },
    { name: "South Africa", slug: "south-africa", group: "A", iso: "za" },
  ],
  B: [
    { name: "Canada", slug: "canada", group: "B", iso: "ca", host: true },
    { name: "Qatar", slug: "qatar", group: "B", iso: "qa" },
    { name: "Switzerland", slug: "switzerland", group: "B", iso: "ch" },
    { name: "Bosnia & Herzegovina", slug: "bosnia-herzegovina", group: "B", iso: "ba" },
  ],
  C: [
    { name: "Brazil", slug: "brazil", group: "C", iso: "br" },
    { name: "Morocco", slug: "morocco", group: "C", iso: "ma" },
    { name: "Haiti", slug: "haiti", group: "C", iso: "ht" },
    { name: "Scotland", slug: "scotland", group: "C", iso: "gb-sct" },
  ],
  D: [
    { name: "United States", slug: "usa", group: "D", iso: "us", host: true },
    { name: "Australia", slug: "australia", group: "D", iso: "au" },
    { name: "Paraguay", slug: "paraguay", group: "D", iso: "py" },
    { name: "Turkiye", slug: "turkiye", group: "D", iso: "tr" },
  ],
  E: [
    { name: "Germany", slug: "germany", group: "E", iso: "de" },
    { name: "Cote d'Ivoire", slug: "cote-d-ivoire", group: "E", iso: "ci" },
    { name: "Ecuador", slug: "ecuador", group: "E", iso: "ec" },
    { name: "Curacao", slug: "curacao", group: "E", iso: "cw" },
  ],
  F: [
    { name: "Netherlands", slug: "netherlands", group: "F", iso: "nl" },
    { name: "Japan", slug: "japan", group: "F", iso: "jp" },
    { name: "Sweden", slug: "sweden", group: "F", iso: "se" },
    { name: "Tunisia", slug: "tunisia", group: "F", iso: "tn" },
  ],
  G: [
    { name: "Belgium", slug: "belgium", group: "G", iso: "be" },
    { name: "IR Iran", slug: "ir-iran", group: "G", iso: "ir" },
    { name: "Egypt", slug: "egypt", group: "G", iso: "eg" },
    { name: "New Zealand", slug: "new-zealand", group: "G", iso: "nz" },
  ],
  H: [
    { name: "Spain", slug: "spain", group: "H", iso: "es" },
    { name: "Saudi Arabia", slug: "saudi-arabia", group: "H", iso: "sa" },
    { name: "Uruguay", slug: "uruguay", group: "H", iso: "uy" },
    { name: "Cape Verde Islands", slug: "cabo-verde", group: "H", iso: "cv" },
  ],
  I: [
    { name: "France", slug: "france", group: "I", iso: "fr" },
    { name: "Norway", slug: "norway", group: "I", iso: "no" },
    { name: "Senegal", slug: "senegal", group: "I", iso: "sn" },
    { name: "Iraq", slug: "iraq", group: "I", iso: "iq" },
  ],
  J: [
    { name: "Argentina", slug: "argentina", group: "J", iso: "ar" },
    { name: "Austria", slug: "austria", group: "J", iso: "at" },
    { name: "Algeria", slug: "algeria", group: "J", iso: "dz" },
    { name: "Jordan", slug: "jordan", group: "J", iso: "jo" },
  ],
  K: [
    { name: "Portugal", slug: "portugal", group: "K", iso: "pt" },
    { name: "Colombia", slug: "colombia", group: "K", iso: "co" },
    { name: "Uzbekistan", slug: "uzbekistan", group: "K", iso: "uz" },
    { name: "DR Congo", slug: "congo-dr", group: "K", iso: "cd" },
  ],
  L: [
    { name: "England", slug: "england", group: "L", iso: "gb-eng" },
    { name: "Croatia", slug: "croatia", group: "L", iso: "hr" },
    { name: "Ghana", slug: "ghana", group: "L", iso: "gh" },
    { name: "Panama", slug: "panama", group: "L", iso: "pa" },
  ],
};

const TABS = [
  { id: "city", label: "Host City" },
  { id: "team", label: "Team" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const TRUST = {
  title: "Don't risk unofficial sources or leave tickets to chance!",
  copy: "Secure your place with ticket-inclusive hospitality packages from On Location, Official Hospitality Provider of FIFA World Cup 2026\u2122.",
  support: "Can't find exactly what you're looking for online? Call us to explore additional inventory:",
  phone: "1-844-652-1685",
  phoneHref: "tel:+18446521685",
};

export default function HostNations() {
  const [tab, setTab] = useState<TabId>("city");

  useEffect(() => {
    const handleVoiceBrowseMode = (event: Event) => {
      const nextTab = (event as CustomEvent<{ tab?: TabId }>).detail?.tab;
      if (nextTab === "city" || nextTab === "team") {
        setTab(nextTab);
      }
    };

    window.addEventListener(
      "voice:set-host-browse-mode",
      handleVoiceBrowseMode as EventListener
    );

    return () => {
      window.removeEventListener(
        "voice:set-host-browse-mode",
        handleVoiceBrowseMode as EventListener
      );
    };
  }, []);

  return (
    <section
      id="hosts"
      className="relative isolate overflow-hidden bg-background font-[family-name:var(--font-display)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[0] opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 calc(8.333% - 1px), rgba(255,255,255,0.5) calc(8.333% - 1px) 8.333%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[60vw] rounded-full blur-[140px] opacity-[0.18]"
        style={{
          background: "radial-gradient(closest-side, #00c8ff 0%, transparent 70%)",
        }}
      />
      <div className="relative z-[1] px-6 sm:px-10 md:px-20 pt-20 sm:pt-28 pb-20 sm:pb-28">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* LEFT */}
            <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 self-start">
              <Reveal y={16} duration={650}>
              <div className="flex items-center gap-3 mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-pitch opacity-60 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-pitch" />
                </span>
                <span className="block h-px w-10 bg-accent" />
                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.4em] text-accent">
                  &sect;02 &mdash; Browse
                </span>
              </div>

              <h2 className="font-[family-name:var(--font-display)] font-bold uppercase leading-[0.92] tracking-[-0.03em] text-foreground text-[12vw] sm:text-[8vw] md:text-[5vw] xl:text-[80px]">
                Pick your{" "}
                <span className="font-[family-name:var(--font-serif)] font-normal italic tracking-tight text-accent inline-block">
                  <Crossfade contentKey={tab} duration={350} y={6} className="inline-block">
                    <span>{tab === "city" ? "city." : "team."}</span>
                  </Crossfade>
                </span>
              </h2>

              <div className="mt-6 max-w-md">
                <Crossfade contentKey={tab} duration={400} y={6}>
                  <p className="font-[family-name:var(--font-serif)] italic text-foreground/75 text-base sm:text-lg leading-snug">
                    {tab === "city"
                      ? "Choose from 16 dynamic host cities across Canada, Mexico and the United States \u2014 each one with its own venue, matches and hospitality packages."
                      : "Follow your nation through every early-stage match with the Follow My Team package, regardless of location."}
                  </p>
                </Crossfade>
              </div>

              {/* Tabs */}
              <div
                role="tablist"
                aria-label="Browse hospitality"
                className="mt-7 inline-flex items-center gap-1 p-1 rounded-full border border-foreground/15 bg-surface/40 backdrop-blur-sm"
              >
                {TABS.map((t) => {
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTab(t.id)}
                      className={`relative px-5 py-2 rounded-full font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] transition ${
                        active
                          ? "bg-foreground text-background"
                          : "text-foreground/60 hover:text-foreground"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                <Crossfade contentKey={tab} duration={350} y={4}>
                  <span>{tab === "city" ? "16 host cities \u00b7 3 nations" : "48 teams \u00b7 12 groups"}</span>
                </Crossfade>
              </div>

              <div className="mt-7 max-w-md">
                <StadiumPreview />
              </div>
              </Reveal>
            </aside>

            {/* RIGHT */}
            <div className="lg:col-span-7 xl:col-span-8">
              <Crossfade contentKey={tab} duration={500} y={12}>
                {tab === "city" ? <CityIndex /> : <TeamIndex />}
              </Crossfade>
            </div>
          </div>

          {/* Trust notice — full width */}
          <Reveal y={14} duration={600}>
          <div className="mt-14 border-t border-foreground/10 pt-8 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
            <div className="md:col-span-7">
              <h3 className="font-[family-name:var(--font-display)] font-bold uppercase tracking-tight text-foreground text-base sm:text-lg leading-tight">
                {TRUST.title}
              </h3>
              <p className="mt-3 font-[family-name:var(--font-serif)] italic text-foreground/65 text-sm leading-snug max-w-xl">
                {TRUST.copy}
              </p>
            </div>
            <div className="md:col-span-5 flex flex-col items-start md:items-end">
              <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-foreground/45 leading-relaxed">
                {TRUST.support}
              </p>
              <a
                href={TRUST.phoneHref}
                className="mt-2 inline-flex items-center gap-2.5 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-foreground hover:text-gold transition"
              >
                <Phone className="h-4 w-4 text-gold" />
                <span className="tabular-nums">{TRUST.phone}</span>
              </a>
            </div>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CityIndex() {
  return (
    <>
      <div className="flex items-end justify-between border-b border-foreground/15 pb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/45">
        <span>Index</span>
        <span>Host city &mdash; Nation</span>
      </div>
      <ol className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/50 border border-border/50 rounded-xl overflow-hidden mt-5">
        {CITIES.map((city, i) => {
          const meta = NATION_META[city.nation];
          return (
              <li key={city.slug} className="h-full">
              <Reveal as="div" y={14} duration={600} delay={Math.min(i * 35, 500)} className="h-full">
              <a
                href={`${HOST_ROOT}/${city.slug}`}
                  className="group/row relative flex h-full flex-col gap-1 bg-background p-4 transition-colors"
                style={{ "--row-accent": meta.accent } as React.CSSProperties}
              >
                <span className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/35 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/50">
                    <span
                      aria-hidden
                      className="block h-2 w-2 rounded-full"
                      style={{ background: meta.accent }}
                    />
                    <span>{city.nation}</span>
                  </span>
                </span>
                <span className="flex items-center justify-between gap-2 mt-1">
                  <span className="font-[family-name:var(--font-display)] font-bold uppercase tracking-[-0.02em] text-foreground/85 group-hover/row:text-foreground transition text-lg sm:text-xl leading-tight">
                    {city.name}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-foreground/25 transition group-hover/row:rotate-45 group-hover/row:[color:var(--row-accent)] shrink-0" />
                </span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-0 bottom-0 h-[2px] w-0 group-hover/row:w-full transition-all duration-500"
                  style={{ background: meta.accent }}
                />
              </a>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </>
  );
}

function TeamIndex() {
  const groupKeys = Object.keys(GROUPS);
  return (
    <>
      <div className="flex items-end justify-between border-b border-foreground/15 pb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.3em] text-foreground/45">
        <span>Groups A &mdash; L</span>
        <span>Follow My Team</span>
      </div>

      {/* 2 cols until lg, then 3, then 4 at xl */}
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border/50 border border-border/50 rounded-xl overflow-hidden">
        {groupKeys.map((g, gi) => (
          <Reveal as="div" key={g} y={14} duration={600} delay={Math.min(gi * 60, 540)} className="bg-background p-4">
            <div className="flex items-baseline justify-between mb-3">
              <span className="font-[family-name:var(--font-display)] font-black text-foreground text-2xl leading-none">
                {g}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.3em] text-foreground/40">
                Group
              </span>
            </div>
            <ul className="flex flex-col">
              {GROUPS[g].map((team) => {
                const disabled = team.host;
                const href = `${TEAM_ROOT}/${team.slug}`;
                const Tag = disabled ? "div" : "a";
                const tagProps = disabled ? {} : { href };
                return (
                  <li key={team.slug}>
                    <Tag
                      {...tagProps}
                      className={`group/team flex items-center justify-between gap-2 py-1.5 border-b border-foreground/5 last:border-b-0 ${
                        disabled ? "cursor-default" : "cursor-pointer transition-colors"
                      }`}
                    >
                      <span
                        className={`flex items-center gap-2 font-[family-name:var(--font-display)] tracking-tight text-[12px] sm:text-[13px] truncate ${
                          disabled
                            ? "text-foreground/45"
                            : "text-foreground/85 group-hover/team:text-foreground"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://flagcdn.com/w40/${team.iso}.png`}
                          alt=""
                          width={20}
                          height={15}
                          className="inline-block rounded-[2px] object-cover shrink-0"
                        />
                        {team.name}
                      </span>
                      {disabled ? (
                        <span className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-[0.25em] text-gold shrink-0">
                          Host
                        </span>
                      ) : (
                        <ArrowUpRight className="h-3 w-3 text-foreground/25 transition group-hover/team:rotate-45 group-hover/team:text-accent shrink-0" />
                      )}
                    </Tag>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ))}
      </div>

      <p className="mt-4 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] text-foreground/45 leading-relaxed">
        Follow My Team is not available for host nation teams (Canada, Mexico, U.S.).
      </p>
    </>
  );
}
