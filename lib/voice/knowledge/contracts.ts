import { z } from "zod";

export const VOICE_KNOWLEDGE_STAGES = [
  "group-stage",
  "round-of-32",
  "round-of-16",
  "quarterfinal",
  "semifinal",
  "third-place",
  "final",
] as const;

export const voiceKnowledgeStageSchema = z.enum(VOICE_KNOWLEDGE_STAGES);

export const voiceKnowledgeRequestSchema = z.discriminatedUnion("intent", [
  z.object({
    intent: z.literal("tournament_summary"),
  }),
  z.object({
    intent: z.literal("team_overview"),
    team: z.string().trim().min(1),
  }),
  z.object({
    intent: z.literal("team_schedule"),
    team: z.string().trim().min(1),
    stage: voiceKnowledgeStageSchema.optional(),
    includeTbd: z.boolean().optional().default(true),
  }),
  z.object({
    intent: z.literal("venue_schedule"),
    venue: z.string().trim().min(1),
    stage: voiceKnowledgeStageSchema.optional(),
    date: z.string().trim().min(1).optional(),
  }),
  z.object({
    intent: z.literal("match_pricing"),
    matchNumber: z.number().int().positive().max(104).optional(),
    team: z.string().trim().min(1).optional(),
    venue: z.string().trim().min(1).optional(),
    stage: voiceKnowledgeStageSchema.optional(),
  }),
  z.object({
    intent: z.literal("venue_series_pricing"),
    venue: z.string().trim().min(1).optional(),
  }),
  z.object({
    intent: z.literal("knockout_bracket"),
    matchNumber: z.number().int().positive().max(104).optional(),
    group: z.string().trim().regex(/^[A-L]$/i).optional(),
    slot: z.string().trim().regex(/^(?:[12][A-L]|3[A-L]+|W\d{2,3})$/i).optional(),
    stage: voiceKnowledgeStageSchema.optional(),
  }),
  z.object({
    intent: z.literal("hospitality_catalog"),
    category: z.enum(["products", "lounges", "all"]).optional().default("all"),
  }),
  z.object({
    intent: z.literal("hospitality_recommendation"),
    team: z.string().trim().min(1).optional(),
    venue: z.string().trim().min(1).optional(),
    desiredStages: z.array(voiceKnowledgeStageSchema).optional(),
    partySize: z.number().int().positive().max(100).optional(),
    desiredMatchCount: z.number().int().positive().max(8).optional(),
    wantsPrivate: z.boolean().optional(),
    wantsFollowTeam: z.boolean().optional(),
    travelFlexibility: z
      .enum(["single-city", "multi-city", "open"])
      .optional(),
  }),
]);

export type VoiceKnowledgeRequest = z.infer<typeof voiceKnowledgeRequestSchema>;
export type VoiceKnowledgeStage = z.infer<typeof voiceKnowledgeStageSchema>;

export const voiceKnowledgeToolBlueprints = [
  {
    name: "tournament_summary",
    description:
      "Returns the high-level World Cup 2026 tournament format, dates, host countries and final venue.",
    input: {
      intent: "tournament_summary",
    },
  },
  {
    name: "team_overview",
    description:
      "Looks up one team and returns its canonical name, group, ranking, appearances and host status.",
    input: {
      intent: "team_overview",
      team: "Mexico",
    },
  },
  {
    name: "team_schedule",
    description:
      "Finds where a specific team plays, including cities, stadiums, dates, opponents and stage.",
    input: {
      intent: "team_schedule",
      team: "United States",
      stage: "group-stage",
      includeTbd: true,
    },
  },
  {
    name: "venue_schedule",
    description:
      "Returns all matches for a city or stadium, with optional stage or date filters.",
    input: {
      intent: "venue_schedule",
      venue: "Toronto",
      stage: "group-stage",
    },
  },
  {
    name: "match_pricing",
    description:
      "Returns official hospitality starting prices in USD for single matches, filtered by match number, team, venue or stage.",
    input: {
      intent: "match_pricing",
      team: "Mexico",
      stage: "group-stage",
    },
  },
  {
    name: "venue_series_pricing",
    description:
      "Returns official Venue Series starting prices in USD for a host city or stadium.",
    input: {
      intent: "venue_series_pricing",
      venue: "Boston",
    },
  },
  {
    name: "knockout_bracket",
    description:
      "Returns official knockout bracket paths, including slots like 1A or 3CEFHI, and can filter by group, stage or match number.",
    input: {
      intent: "knockout_bracket",
      group: "A",
      stage: "quarterfinal",
    },
  },
  {
    name: "hospitality_catalog",
    description:
      "Lists the available hospitality products, lounge types, or both.",
    input: {
      intent: "hospitality_catalog",
      category: "all",
    },
  },
  {
    name: "hospitality_recommendation",
    description:
      "Recommends the best hospitality purchase path based on team, venue, match count, privacy needs and travel flexibility.",
    input: {
      intent: "hospitality_recommendation",
      team: "Mexico",
      partySize: 4,
      desiredStages: ["group-stage"],
      desiredMatchCount: 2,
      wantsPrivate: false,
      wantsFollowTeam: true,
      travelFlexibility: "multi-city",
    },
  },
] as const;