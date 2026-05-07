import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { z } from "zod";
import {
  voiceKnowledgeStageSchema,
  type VoiceKnowledgeRequest,
  type VoiceKnowledgeStage,
} from "./contracts";
import { hospitalityCatalog } from "./hospitality-catalog";

const CONTENT_DIR = path.join(process.cwd(), "..", "content");

const teamSchema = z.object({
  name: z.string(),
  group: z.string(),
  ranking: z.number(),
  appearances: z.number(),
  slug: z.string(),
  host: z.boolean().optional(),
});

const teamsJsonSchema = z.object({
  totalTeams: z.number(),
  groups: z.record(z.array(z.string())),
  teams: z.array(teamSchema),
});

const venueMatchSchema = z.object({
  date: z.string(),
  time: z.string(),
  teams: z.string(),
  stage: z.string(),
});

const venueSchema = z.object({
  city: z.string(),
  country: z.string(),
  stadium: z.string(),
  realName: z.string(),
  description: z.string(),
  matches: z.array(venueMatchSchema),
});

const venuesJsonSchema = z.object({
  tournament: z.object({
    name: z.string(),
    format: z.string(),
    dates: z.string(),
    countries: z.array(z.string()),
    totalCities: z.number(),
    finalVenue: z.string(),
  }),
  venues: z.array(venueSchema),
});

const tournamentInfoJsonSchema = z.object({
  format: z.object({
    totalTeams: z.number(),
    groups: z.number(),
    teamsPerGroup: z.number(),
    totalMatches: z.number(),
    duration: z.string(),
    advancement: z.string(),
    rounds: z.array(z.string()),
    matchesPerTeamToFinal: z.number(),
  }),
  schedule: z.record(z.unknown()),
  keyFacts: z.record(z.unknown()),
});

const pricingMetaSchema = z
  .object({
    source: z.string(),
    storefront: z.string(),
    retrievedAt: z.string(),
    notes: z.array(z.string()),
    usdExchangeRates: z.object({
      base: z.string(),
      date: z.string(),
      rates: z.record(z.number()),
    }),
  })
  .passthrough();

const pricingOfferingSchema = z.object({
  id: z.string(),
  name: z.string(),
  isAvailable: z.boolean(),
  localStartingPrice: z.number().nullable(),
  usdStartingPrice: z.number().nullable(),
});

const pricingVenueInfoSchema = z.object({
  code: z.string().optional(),
  stadium: z.string(),
  city: z.string(),
});

const pricingMatchSchema = z.object({
  matchNumber: z.number(),
  performanceId: z.number(),
  countryCode: z.string(),
  country: z.string(),
  localCurrency: z.string(),
  venue: pricingVenueInfoSchema,
  date: z.string(),
  dateTime: z.string(),
  matchDateLabel: z.string(),
  kickoffLabel: z.string(),
  stageCode: z.string(),
  stage: voiceKnowledgeStageSchema,
  stageLabel: z.string(),
  homeTeam: z.object({
    code: z.string(),
    name: z.string(),
  }),
  awayTeam: z.object({
    code: z.string(),
    name: z.string(),
  }),
  localStartingPrice: z.number().nullable(),
  usdStartingPrice: z.number().nullable(),
  offerings: z.array(pricingOfferingSchema),
});

const venueSeriesPricingSchema = z.object({
  productCode: z.string(),
  venueCode: z.string(),
  countryCode: z.string(),
  country: z.string(),
  localCurrency: z.string(),
  venue: pricingVenueInfoSchema,
  matchNumbers: z.array(z.number()),
  totalMatches: z.number(),
  localStartingPrice: z.number().nullable(),
  usdStartingPrice: z.number().nullable(),
  offerings: z.array(pricingOfferingSchema),
});

const hospitalityPricingJsonSchema = z.object({
  meta: pricingMetaSchema,
  singleMatch: z.array(pricingMatchSchema),
  venueSeries: z.array(venueSeriesPricingSchema),
  packageNotes: z.record(
    z.object({
      flow: z.string().optional(),
      publicStartingPrice: z.number().nullable().optional(),
      note: z.string(),
    })
  ),
});

const knockoutBracketMatchSchema = z.object({
  matchNumber: z.number(),
  performanceId: z.number(),
  stageCode: z.string(),
  stage: voiceKnowledgeStageSchema,
  stageLabel: z.string(),
  date: z.string(),
  dateTime: z.string(),
  matchDateLabel: z.string(),
  kickoffLabel: z.string(),
  venue: z.object({
    code: z.string(),
    stadium: z.string(),
    city: z.string(),
    countryCode: z.string(),
    country: z.string(),
  }),
  homeSlot: z.string(),
  awaySlot: z.string(),
  winnerToken: z.string(),
  nextMatchNumber: z.number().nullable(),
  sourceMatchNumbers: z.array(z.number()),
  reachableGroups: z.array(z.string()),
  reachableBaseSeeds: z.array(z.string()),
});

const knockoutBracketJsonSchema = z.object({
  meta: z
    .object({
      source: z.string(),
      storefront: z.string(),
      retrievedAt: z.string(),
      notes: z.array(z.string()),
    })
    .passthrough(),
  matches: z.array(knockoutBracketMatchSchema),
});

type TeamRecord = z.infer<typeof teamSchema>;
type VenueRecord = z.infer<typeof venueSchema>;
type VenueMatchRecord = z.infer<typeof venueMatchSchema>;
type TeamsData = z.infer<typeof teamsJsonSchema>;
type VenuesData = z.infer<typeof venuesJsonSchema>;
type TournamentInfoData = z.infer<typeof tournamentInfoJsonSchema>;
type HospitalityPricingData = z.infer<typeof hospitalityPricingJsonSchema>;
type PricingMatchRecord = z.infer<typeof pricingMatchSchema>;
type VenueSeriesPricingRecord = z.infer<typeof venueSeriesPricingSchema>;
type KnockoutBracketData = z.infer<typeof knockoutBracketJsonSchema>;
type KnockoutBracketMatch = z.infer<typeof knockoutBracketMatchSchema>;

type TeamScheduleMatch = {
  city: string;
  country: string;
  stadium: string;
  realName: string;
  date: string;
  time: string;
  stageLabel: string;
  stage: VoiceKnowledgeStage;
  matchLabel: string;
  opponent: string | null;
};

type AliasMaps = {
  teamAliases: Map<string, string>;
  venueAliases: Map<string, VenueRecord>;
};

async function readJsonFile<T>(fileName: string, schema: z.ZodType<T>) {
  const filePath = path.join(CONTENT_DIR, fileName);
  const raw = await readFile(filePath, "utf8");
  return schema.parse(JSON.parse(raw));
}

const loadTeamsData = cache(async () =>
  readJsonFile<TeamsData>("teams.json", teamsJsonSchema)
);

const loadVenuesData = cache(async () =>
  readJsonFile<VenuesData>("venues-and-matches.json", venuesJsonSchema)
);

const loadTournamentInfoData = cache(async () =>
  readJsonFile<TournamentInfoData>("tournament-info.json", tournamentInfoJsonSchema)
);

const loadHospitalityPricingData = cache(async () =>
  readJsonFile<HospitalityPricingData>(
    "hospitality-pricing-usd.json",
    hospitalityPricingJsonSchema
  )
);

const loadKnockoutBracketData = cache(async () =>
  readJsonFile<KnockoutBracketData>(
    "knockout-bracket.json",
    knockoutBracketJsonSchema
  )
);

const OFFICIAL_VENUE_ALIASES: Record<string, string[]> = {
  NN_ATL: ["Atlanta", "Mercedes-Benz Stadium"],
  NN_BOS: ["Boston", "Gillette Stadium", "Foxborough"],
  NN_CDMX: ["Mexico City", "Ciudad de Mexico", "Mexico City Stadium", "Estadio Ciudad de Mexico", "Estadio Azteca"],
  NN_DAL: ["Dallas", "Arlington", "AT&T Stadium", "ATT Stadium"],
  NN_GDL: ["Guadalajara", "Zapopan", "Guadalajara Stadium", "Estadio Guadalajara", "Estadio Akron"],
  NN_HOU: ["Houston", "NRG Stadium"],
  NN_KC: ["Kansas City", "Arrowhead Stadium"],
  NN_LA: ["Los Angeles", "Inglewood", "SoFi Stadium", "Sofi Stadium"],
  NN_MIA: ["Miami", "Hard Rock Stadium"],
  NN_MTY: ["Monterrey", "Guadalupe", "Monterrey Stadium", "Estadio Monterrey", "Estadio BBVA"],
  NN_NYNJ: ["New York / New Jersey", "New York/New Jersey", "New York New Jersey", "East Rutherford", "MetLife Stadium"],
  NN_PHL: ["Philadelphia", "Lincoln Financial Field"],
  NN_SEA: ["Seattle", "Lumen Field"],
  NN_SFBA: ["San Francisco Bay Area", "San Francisco", "Santa Clara", "Levis Stadium", "Levi's Stadium"],
  NN_TOR: ["Toronto", "BMO Field"],
  NN_VAN: ["Vancouver", "BC Place Vancouver", "BC Place"],
};

function normalizeSearchKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function buildNormalizedTokens(values: Array<string | null | undefined>) {
  return [...new Set(values.filter(Boolean).map((value) => normalizeSearchKey(value!)).filter(Boolean))];
}

function includesAnyToken(haystack: string[], needles: string[]) {
  return needles.some((needle) => haystack.includes(needle));
}

function buildTeamAliases(teams: TeamRecord[]) {
  const aliases = new Map<string, string>();

  const addAlias = (alias: string, canonicalName: string) => {
    aliases.set(normalizeSearchKey(alias), canonicalName);
  };

  for (const team of teams) {
    addAlias(team.name, team.name);
    addAlias(team.slug, team.name);
    addAlias(team.slug.replace(/-/g, " "), team.name);
  }

  addAlias("USA", "United States");
  addAlias("US", "United States");
  addAlias("United States of America", "United States");
  addAlias("EE.UU.", "United States");
  addAlias("EEUU", "United States");
  addAlias("Ivory Coast", "Cote dIvoire");
  addAlias("Cote d'Ivoire", "Cote dIvoire");
  addAlias("Turkiye", "Turkey");
  addAlias("South Korea", "Korea Republic");
  addAlias("Korea", "Korea Republic");
  addAlias("Cape Verde", "Cape Verde Islands");
  addAlias("Cabo Verde", "Cape Verde Islands");
  addAlias("DRC", "DR Congo");
  addAlias("Congo DR", "DR Congo");

  return aliases;
}

function buildVenueAliases(venues: VenueRecord[]) {
  const aliases = new Map<string, VenueRecord>();

  const addAlias = (alias: string, venue: VenueRecord) => {
    aliases.set(normalizeSearchKey(alias), venue);
  };

  for (const venue of venues) {
    addAlias(venue.city, venue);
    addAlias(venue.stadium, venue);
    addAlias(venue.realName, venue);
    addAlias(`${venue.city} ${venue.country}`, venue);
  }

  const newYorkVenue = venues.find((venue) => venue.city === "New York / New Jersey");
  if (newYorkVenue) {
    addAlias("New York/New Jersey", newYorkVenue);
    addAlias("New York New Jersey", newYorkVenue);
    addAlias("MetLife Stadium", newYorkVenue);
  }

  const mexicoCityVenue = venues.find((venue) => venue.city === "Mexico City");
  if (mexicoCityVenue) {
    addAlias("Estadio Azteca", mexicoCityVenue);
  }

  return aliases;
}

const loadAliasMaps = cache(async (): Promise<AliasMaps> => {
  const [teamsData, venuesData] = await Promise.all([loadTeamsData(), loadVenuesData()]);

  return {
    teamAliases: buildTeamAliases(teamsData.teams),
    venueAliases: buildVenueAliases(venuesData.venues),
  };
});

function normalizeStage(stageLabel: string): VoiceKnowledgeStage {
  const normalized = normalizeSearchKey(stageLabel);

  if (normalized.startsWith("group")) return "group-stage";
  if (normalized.includes("round of 32")) return "round-of-32";
  if (normalized.includes("round of 16")) return "round-of-16";
  if (normalized.includes("quarter")) return "quarterfinal";
  if (normalized.includes("semi")) return "semifinal";
  if (normalized.includes("third")) return "third-place";
  if (normalized.includes("final")) return "final";

  return "group-stage";
}

function splitMatchTeams(matchLabel: string) {
  return matchLabel.split(/\s+vs\s+/i).map((entry) => entry.trim());
}

async function resolveCanonicalTeam(rawTeam: string) {
  const [teamsData, aliasMaps] = await Promise.all([loadTeamsData(), loadAliasMaps()]);
  const canonicalName = aliasMaps.teamAliases.get(normalizeSearchKey(rawTeam));

  if (!canonicalName) {
    return null;
  }

  return teamsData.teams.find((team) => team.name === canonicalName) || null;
}

async function resolveCanonicalVenue(rawVenue: string) {
  const aliasMaps = await loadAliasMaps();
  return aliasMaps.venueAliases.get(normalizeSearchKey(rawVenue)) || null;
}

function matchPricingRecordForTeam(
  match: PricingMatchRecord,
  rawTeam: string,
  canonicalTeamName?: string | null
) {
  const comparisonTokens = buildNormalizedTokens([
    canonicalTeamName || null,
    rawTeam,
  ]);
  const matchTokens = buildNormalizedTokens([
    match.homeTeam.name,
    match.awayTeam.name,
    match.homeTeam.code,
    match.awayTeam.code,
  ]);

  return includesAnyToken(matchTokens, comparisonTokens);
}

function matchOfficialVenueQuery(
  venue: { code?: string; city: string; stadium: string },
  rawVenue: string,
  canonicalVenue?: VenueRecord | null
) {
  const queryTokens = buildNormalizedTokens([
    rawVenue,
    canonicalVenue?.city,
    canonicalVenue?.stadium,
    canonicalVenue?.realName,
  ]);
  const venueTokens = buildNormalizedTokens([
    venue.city,
    venue.stadium,
    ...(venue.code ? OFFICIAL_VENUE_ALIASES[venue.code] || [] : []),
  ]);

  return includesAnyToken(venueTokens, queryTokens);
}

async function getMatchPricing(
  input: Extract<VoiceKnowledgeRequest, { intent: "match_pricing" }>
) {
  const pricingData = await loadHospitalityPricingData();
  const canonicalTeam = input.team ? await resolveCanonicalTeam(input.team) : null;
  const canonicalVenue = input.venue ? await resolveCanonicalVenue(input.venue) : null;

  const matches = pricingData.singleMatch.filter((match) => {
    if (input.matchNumber && match.matchNumber !== input.matchNumber) {
      return false;
    }

    if (input.stage && match.stage !== input.stage) {
      return false;
    }

    if (
      input.team &&
      !matchPricingRecordForTeam(match, input.team, canonicalTeam?.name || null)
    ) {
      return false;
    }

    if (
      input.venue &&
      !matchOfficialVenueQuery(match.venue, input.venue, canonicalVenue)
    ) {
      return false;
    }

    return true;
  });

  return {
    intent: input.intent,
    found: matches.length > 0,
    query: {
      ...input,
      canonicalTeam: canonicalTeam?.name || null,
      canonicalVenue: canonicalVenue?.city || null,
    },
    totalMatches: matches.length,
    matches,
    meta: {
      pricingSource: pricingData.meta,
      packageNotes: pricingData.packageNotes,
    },
  };
}

async function getVenueSeriesPricing(
  input: Extract<VoiceKnowledgeRequest, { intent: "venue_series_pricing" }>
) {
  const pricingData = await loadHospitalityPricingData();
  const canonicalVenue = input.venue ? await resolveCanonicalVenue(input.venue) : null;

  const venues = pricingData.venueSeries.filter((entry) => {
    if (!input.venue) {
      return true;
    }

    return matchOfficialVenueQuery(
      {
        code: entry.venueCode,
        city: entry.venue.city,
        stadium: entry.venue.stadium,
      },
      input.venue,
      canonicalVenue
    );
  });

  return {
    intent: input.intent,
    found: venues.length > 0,
    query: {
      ...input,
      canonicalVenue: canonicalVenue?.city || null,
    },
    totalVenues: venues.length,
    venues,
    meta: {
      pricingSource: pricingData.meta,
    },
  };
}

function matchKnockoutSlot(match: KnockoutBracketMatch, slot: string) {
  const normalizedSlot = slot.toUpperCase();

  if (/^[123][A-L]$/.test(normalizedSlot)) {
    return (
      match.reachableBaseSeeds.includes(normalizedSlot) ||
      match.homeSlot.toUpperCase() === normalizedSlot ||
      match.awaySlot.toUpperCase() === normalizedSlot
    );
  }

  if (/^W\d{2,3}$/.test(normalizedSlot)) {
    return [match.winnerToken, match.homeSlot, match.awaySlot].some(
      (value) => value.toUpperCase() === normalizedSlot
    );
  }

  return [match.homeSlot, match.awaySlot].some(
    (value) => value.toUpperCase() === normalizedSlot
  );
}

async function getKnockoutBracket(
  input: Extract<VoiceKnowledgeRequest, { intent: "knockout_bracket" }>
) {
  const bracketData = await loadKnockoutBracketData();
  const normalizedGroup = input.group?.toUpperCase();
  const normalizedSlot = input.slot?.toUpperCase();

  const matches = bracketData.matches.filter((match) => {
    if (input.matchNumber && match.matchNumber !== input.matchNumber) {
      return false;
    }

    if (input.stage && match.stage !== input.stage) {
      return false;
    }

    if (normalizedGroup && !match.reachableGroups.includes(normalizedGroup)) {
      return false;
    }

    if (normalizedSlot && !matchKnockoutSlot(match, normalizedSlot)) {
      return false;
    }

    return true;
  });

  return {
    intent: input.intent,
    found: matches.length > 0,
    query: {
      ...input,
      group: normalizedGroup || null,
      slot: normalizedSlot || null,
    },
    totalMatches: matches.length,
    matches,
    meta: bracketData.meta,
  };
}

async function getTeamSchedule(teamName: string, stage?: VoiceKnowledgeStage, includeTbd = true) {
  const canonicalTeam = await resolveCanonicalTeam(teamName);
  if (!canonicalTeam) {
    return null;
  }

  const venuesData = await loadVenuesData();
  const matches: TeamScheduleMatch[] = [];

  for (const venue of venuesData.venues) {
    for (const match of venue.matches) {
      const normalizedStage = normalizeStage(match.stage);
      if (stage && normalizedStage !== stage) {
        continue;
      }

      const rawTeams = splitMatchTeams(match.teams);
      const canonicalTeams = await Promise.all(
        rawTeams.map(async (entry) => (entry === "TBD" ? "TBD" : (await resolveCanonicalTeam(entry))?.name || entry))
      );

      if (!canonicalTeams.includes(canonicalTeam.name)) {
        continue;
      }

      const opponent = canonicalTeams.find((entry) => entry !== canonicalTeam.name) || null;
      if (!includeTbd && opponent === "TBD") {
        continue;
      }

      matches.push({
        city: venue.city,
        country: venue.country,
        stadium: venue.stadium,
        realName: venue.realName,
        date: match.date,
        time: match.time,
        stageLabel: match.stage,
        stage: normalizedStage,
        matchLabel: match.teams,
        opponent,
      });
    }
  }

  return {
    team: canonicalTeam,
    matches,
  };
}

function getHostNationTeams(teams: TeamRecord[]) {
  return new Set(teams.filter((team) => team.host).map((team) => team.name));
}

function rankHospitalityRecommendations(input: Extract<VoiceKnowledgeRequest, { intent: "hospitality_recommendation" }>, hostNationTeams: Set<string>, canonicalTeamName?: string | null) {
  const rankedIds: string[] = [];
  const reasons: string[] = [];

  const pushUnique = (id: string, reason: string) => {
    if (!rankedIds.includes(id)) {
      rankedIds.push(id);
      reasons.push(reason);
    }
  };

  if (input.wantsPrivate) {
    pushUnique(
      input.partySize && input.partySize >= 10 ? "platinum-access" : "private-suites",
      "The guest wants a private hospitality environment."
    );
    pushUnique("accommodations", "Private hosted trips usually benefit from packaged travel support.");
  }

  if (input.wantsFollowTeam && canonicalTeamName) {
    if (hostNationTeams.has(canonicalTeamName)) {
      pushUnique(
        "multi-match-series",
        "Follow My Team is not available for host nation teams, so the closest fit is a custom multi-match path."
      );
    } else {
      pushUnique("follow-my-team", "The guest wants to follow one team across cities.");
    }
  }

  if (input.desiredStages?.includes("final") || (input.desiredMatchCount ?? 0) >= 4) {
    pushUnique("multi-match-series", "The guest wants a broader match journey and possibly access to the Final.");
  }

  if (input.travelFlexibility === "single-city" || input.venue) {
    pushUnique("venue-series", "The guest appears to prefer a single-city or single-venue itinerary.");
  }

  if ((input.desiredMatchCount ?? 1) <= 1 && !input.wantsFollowTeam && !input.wantsPrivate) {
    pushUnique("single-match", "The guest seems focused on one match rather than a bundle.");
  }

  if (!rankedIds.length) {
    pushUnique("single-match", "This is the safest default starting point when the buying intent is still broad.");
    pushUnique("venue-series", "A venue-based bundle is usually the next best option when city preference matters.");
  }

  if (input.travelFlexibility === "multi-city") {
    pushUnique("accommodations", "A multi-city trip will likely need coordinated hotels and travel support.");
  }

  return rankedIds.map((id, index) => ({
    item: hospitalityCatalog.find((entry) => entry.id === id)!,
    reason: reasons[index],
  }));
}

export async function executeVoiceKnowledgeRequest(request: VoiceKnowledgeRequest) {
  switch (request.intent) {
    case "tournament_summary": {
      const [venuesData, tournamentInfoData] = await Promise.all([
        loadVenuesData(),
        loadTournamentInfoData(),
      ]);

      return {
        intent: request.intent,
        tournament: venuesData.tournament,
        format: tournamentInfoData.format,
        schedule: tournamentInfoData.schedule,
        keyFacts: tournamentInfoData.keyFacts,
      };
    }

    case "team_overview": {
      const team = await resolveCanonicalTeam(request.team);
      if (!team) {
        return {
          intent: request.intent,
          found: false,
          query: request.team,
        };
      }

      return {
        intent: request.intent,
        found: true,
        query: request.team,
        team,
      };
    }

    case "team_schedule": {
      const result = await getTeamSchedule(
        request.team,
        request.stage,
        request.includeTbd
      );

      if (!result) {
        return {
          intent: request.intent,
          found: false,
          query: request.team,
          matches: [],
        };
      }

      return {
        intent: request.intent,
        found: true,
        query: request.team,
        team: result.team,
        totalMatches: result.matches.length,
        matches: result.matches,
      };
    }

    case "venue_schedule": {
      const venue = await resolveCanonicalVenue(request.venue);
      if (!venue) {
        return {
          intent: request.intent,
          found: false,
          query: request.venue,
          matches: [],
        };
      }

      const matches = venue.matches
        .filter((match) => {
          if (request.stage && normalizeStage(match.stage) !== request.stage) {
            return false;
          }

          if (request.date && match.date !== request.date) {
            return false;
          }

          return true;
        })
        .map((match) => ({
          ...match,
          normalizedStage: normalizeStage(match.stage),
        }));

      return {
        intent: request.intent,
        found: true,
        query: request.venue,
        venue,
        totalMatches: matches.length,
        matches,
      };
    }

    case "match_pricing": {
      return getMatchPricing(request);
    }

    case "venue_series_pricing": {
      return getVenueSeriesPricing(request);
    }

    case "knockout_bracket": {
      return getKnockoutBracket(request);
    }

    case "hospitality_catalog": {
      return {
        intent: request.intent,
        category: request.category,
        items: hospitalityCatalog.filter((item) =>
          request.category === "all"
            ? true
            : request.category === "products"
              ? item.category === "product"
              : item.category === "lounge"
        ),
      };
    }

    case "hospitality_recommendation": {
      const teamsData = await loadTeamsData();
      const canonicalTeam = request.team ? await resolveCanonicalTeam(request.team) : null;
      const hostNationTeams = getHostNationTeams(teamsData.teams);
      const ranked = rankHospitalityRecommendations(
        request,
        hostNationTeams,
        canonicalTeam?.name || null
      );

      return {
        intent: request.intent,
        inputs: {
          ...request,
          canonicalTeam: canonicalTeam?.name || null,
        },
        primaryRecommendation: ranked[0] || null,
        secondaryRecommendations: ranked.slice(1),
      };
    }
  }
}