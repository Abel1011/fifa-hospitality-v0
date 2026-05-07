import "server-only";

import { elevenLabsPublicConfig } from "./public-config";

export function getElevenLabsServerConfig() {
  return {
    apiKey: process.env.ELEVENLABS_API_KEY?.trim() || "",
    agentId: process.env.ELEVENLABS_AGENT_ID?.trim() || "",
    serverLocation: elevenLabsPublicConfig.serverLocation,
  };
}

export function isElevenLabsConfigured() {
  const { apiKey, agentId } = getElevenLabsServerConfig();
  return Boolean(apiKey && agentId);
}