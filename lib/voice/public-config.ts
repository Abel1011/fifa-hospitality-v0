export type ElevenLabsServerLocation =
  | "us"
  | "eu-residency"
  | "in-residency"
  | "global";

const VALID_SERVER_LOCATIONS = new Set<ElevenLabsServerLocation>([
  "us",
  "eu-residency",
  "in-residency",
  "global",
]);

function parseServerLocation(value: string | undefined): ElevenLabsServerLocation {
  const normalized = value?.trim() as ElevenLabsServerLocation | undefined;
  if (normalized && VALID_SERVER_LOCATIONS.has(normalized)) {
    return normalized;
  }

  return "us";
}

export const DEFAULT_ELEVENLABS_SIGNED_URL_ENDPOINT = "/api/voice/signed-url";

export const elevenLabsPublicConfig = {
  enabled: process.env.NEXT_PUBLIC_ELEVENLABS_ENABLED === "true",
  serverLocation: parseServerLocation(process.env.NEXT_PUBLIC_ELEVENLABS_SERVER_LOCATION),
  signedUrlEndpoint:
    process.env.NEXT_PUBLIC_ELEVENLABS_SIGNED_URL_ENDPOINT?.trim() ||
    DEFAULT_ELEVENLABS_SIGNED_URL_ENDPOINT,
  agentLabel:
    process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_LABEL?.trim() ||
    "Match Guide",
  guestUserPrefix:
    process.env.NEXT_PUBLIC_ELEVENLABS_GUEST_USER_PREFIX?.trim() ||
    "landing-guest",
} as const;

export function buildGuestVoiceUserId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${elevenLabsPublicConfig.guestUserPrefix}-${crypto.randomUUID()}`;
  }

  return `${elevenLabsPublicConfig.guestUserPrefix}-${Date.now()}`;
}