# 🏆 FIFA World Cup 2026 Hospitality — Reimagined

> A complete redesign of the official FIFA World Cup 2026 Hospitality platform, enhanced with an AI voice concierge powered by **ElevenLabs**.

## What We Built

We took the **official FIFA Hospitality website** — a corporate, light-themed portal — and reimagined it as a **dark, editorial, premium experience** that feels like browsing a luxury sports magazine while having a personal concierge at your side.

The key innovation: **you can talk to the website**. An ElevenLabs-powered voice assistant knows every match, every venue, every hospitality package — and can navigate the site for you.

| | Original | Our Redesign |
|---|----------|-------------|
| **Style** | Corporate, light theme, standard FIFA branding | Dark cinematic, editorial magazine aesthetic |
| **Typography** | Standard sans-serif | Bricolage Grotesque + Instrument Serif + JetBrains Mono |
| **Visual Language** | Photo grids, conventional layouts | 3D football scene, radial glows, glassmorphism cards, animated reveals |
| **Interaction** | Static pages | AI voice concierge, scroll reveals, hover micro-interactions |
| **Color Palette** | FIFA blue/white | Deep navy `#050a0f` with tri-accent system (Cyan / Gold / Pitch Green) |

## Why Our Proposal Stands Out

1. **Voice-First Navigation** — Users don't just read; they *speak*. "Where does Mexico play?" — the concierge answers and scrolls to the match. This transforms a static hospitality catalog into a conversational booking experience.

2. **Cinematic Design Language** — Every section is crafted with layered depth: radial glows, pitch blueprint SVG overlays, animated ball trajectory paths, frosted glassmorphism panels, and §-numbered editorial sections. It feels like a premium product, not a corporate brochure.

3. **Complete Functional Depth** — This isn't a mockup. All 104 matches, 48 teams, 16 venues, knockout bracket, multi-match bundles, team-following flows, and hospitality packages are fully navigable with real data.

4. **Seamless AI Integration** — ElevenLabs isn't bolted on as a gimmick — it's woven into the UX as a persistent voice dock that understands the entire content graph and can trigger real UI actions.

## Design System

Our visual language combines five principles:

- **Dark luxury** — Near-black backgrounds with layered depth (radial glows → pitch motifs → content → floating elements)
- **Editorial magazine** — Section numbering (`§01`, `§02`), mono-spaced eyebrows, serif italic accent words
- **Cinematic sports** — Interactive 3D football scene hero, pitch blueprint SVG overlays, animated ball trajectory paths (`BallRoute`)
- **Glassmorphism** — Frosted panels with `backdrop-blur`, subtle borders at `foreground/10` opacity, gradient-masked card borders
- **Premium hospitality** — Generous whitespace, gold accents, `rounded-3xl` cards, staggered reveal animations

## ElevenLabs Integration — Voice Concierge

An AI **voice concierge** ("Match Guide") is integrated as a persistent floating dock across the entire app:

### Architecture

```
User speaks → ElevenLabs WebSocket → Conversational AI Agent
                                          ↓
                                   Knowledge Base (RAG)
                                   ├─ 104 matches
                                   ├─ 48 teams
                                   ├─ 16 venues
                                   └─ Hospitality packages
                                          ↓
                              Agent responds + Client Tools
                              ├─ scrollToSection()
                              ├─ navigateTo(page)
                              └─ highlightMatch(id)
```

### Key Capabilities

| Capability | Implementation |
|------------|---------------|
| **Natural language Q&A** | "What matches are in MetLife Stadium?" — answers from knowledge base |
| **Site navigation** | "Show me the bracket" — agent invokes `navigateTo('/bracket')` |
| **Contextual awareness** | Knows current page, can reference visible content |
| **Secure connections** | Signed WebSocket URLs generated server-side via API route |
| **Starter prompts** | Pre-configured questions to onboard users instantly |

### Why ElevenLabs Is Essential for THIS Website

The FIFA World Cup 2026 is **unprecedented in complexity**: 3 host nations (USA, Mexico, Canada), 16 venues spread across an entire continent, 104 matches over 39 days, and 48 teams. Traditional navigation (filters, dropdowns, scrolling through tables) collapses under this scale. A voice concierge solves this instantly.

#### Real User Scenarios

| Scenario | Without Voice | With ElevenLabs Concierge |
|----------|--------------|---------------------------|
| 🇲🇽 "I'm flying to Mexico City, what can I see?" | User must filter matches by city, cross-reference dates, browse venue pages manually | *"What matches are in Mexico City?"* → Instant list with dates, teams, and hospitality options |
| 🇺🇸 "I want to follow Argentina across all 3 countries" | Navigate to team page, check group stage venues, then manually trace knockout path | *"Where does Argentina play and in which cities?"* → Full journey: group in Miami, potential knockout in Dallas and New Jersey |
| 🏟️ "Which stadium has the Final?" | Browse venue pages or Google it | *"Where is the Final?"* → "MetLife Stadium, New Jersey, July 19th. Want me to show you the hospitality packages?" |
| 📅 "I have June 14-18 free, what's happening?" | Scroll through 104 matches scanning dates | *"What matches are between June 14 and 18?"* → Curated list across all 3 countries |
| 🎫 "What's the cheapest lounge package?" | Open multiple match pages comparing prices | *"What's the most affordable hospitality option?"* → Direct comparison with pricing |
| 🌎 "I've never been to a World Cup, where should I go?" | Research all 16 venues independently | *"I want the best atmosphere for a first-timer"* → Personalized recommendation based on stadium capacity, city vibe, and match significance |

#### Why Voice Fits This Product Perfectly

1. **Three countries, one tournament** — Users are planning trips across international borders. A conversational agent can cross-reference flights, cities, and match dates in ways that static filters cannot.

2. **Information overload** — 104 matches × 16 venues × multiple hospitality tiers = thousands of combinations. Natural language cuts through complexity instantly.

3. **Multilingual audience** — A World Cup attracts fans from 48 nations. Voice is more accessible than navigating a complex UI in a second language.

4. **High-value decisions** — Hospitality packages cost thousands of dollars. Users want confidence before purchasing. A concierge that answers follow-up questions ("Is the lounge air-conditioned?", "Can I see the pitch from the suite?") builds trust.

5. **Discovery over search** — Many fans don't know what they want yet. Conversational AI enables exploration ("Surprise me with a good match on a Saturday") that filters and tables can never provide.

### Why ElevenLabs Specifically

- **Low-latency conversational AI** — Real-time voice interaction with sub-second response, critical for a smooth concierge experience
- **Knowledge base ingestion** — We feed all tournament data as structured documents; the agent retrieves relevant context per query
- **Client-side tool calling** — The agent doesn't just answer — it *acts* on the UI (scrolls, navigates, highlights), making voice a first-class navigation method
- **Natural voice quality** — Premium, human-like voice output matches the luxury aesthetic of a hospitality platform selling $5,000+ packages

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Framework** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, tw-animate-css, class-variance-authority |
| **UI Components** | Radix UI primitives, shadcn/ui, Lucide icons |
| **3D** | Three.js, @react-three/fiber, @react-three/drei |
| **Voice AI** | @elevenlabs/react (Conversational AI SDK) |
| **Forms** | React Hook Form + Zod validation |
| **Fonts** | Bricolage Grotesque, Instrument Serif, JetBrains Mono (Google Fonts) |

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Cinematic landing — 3D hero, host nations, premium offerings, lounges, suites |
| `/matches` | Full 104-match calendar with filters by stage, city, team |
| `/matches/[n]` | Individual match with hospitality packages and venue details |
| `/bracket` | Visual knockout bracket from Round of 32 to Final |
| `/bundles` | Multi-match series + Follow My Team (all 48 nations) |
| `/teams/[slug]` | Team profile with group opponents and full match journey |
| `/venues/[slug]` | Venue detail with stadium info and scheduled matches |

## Getting Started

```bash
pnpm install

# Environment variables
cp .env.example .env.local
# ELEVENLABS_API_KEY=your_key
# ELEVENLABS_AGENT_ID=your_agent_id

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ELEVENLABS_API_KEY` | Yes | ElevenLabs API key for signed URL generation |
| `ELEVENLABS_AGENT_ID` | Yes | Conversational AI agent ID |
| `NEXT_PUBLIC_ELEVENLABS_ENABLED` | No | `"true"` to enable voice features |

---

Built with [v0](https://v0.dev) and [ElevenLabs](https://elevenlabs.io)
