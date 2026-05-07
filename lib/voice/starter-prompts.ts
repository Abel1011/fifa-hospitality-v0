export const VOICE_STARTER_PROMPTS = [
  "Where will Mexico play in the group stage?",
  "Which hospitality option fits a group of four?",
  "Compare lounge access with private suites.",
] as const;

export const VOICE_SECTION_IDS = [
  "top",
  "hosts",
  "offerings",
  "premium",
  "lounges",
  "why",
] as const;

export type VoiceSectionId = (typeof VOICE_SECTION_IDS)[number];