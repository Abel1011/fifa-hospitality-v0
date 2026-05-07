"use client";

import type { ReactNode } from "react";
import { ConversationProvider } from "@elevenlabs/react";
import { elevenLabsPublicConfig } from "@/lib/voice/public-config";
import VoiceClientTools from "./VoiceClientTools";

type VoiceAssistantProviderProps = {
  children: ReactNode;
};

export default function VoiceAssistantProvider({
  children,
}: VoiceAssistantProviderProps) {
  return (
    <ConversationProvider
      serverLocation={elevenLabsPublicConfig.serverLocation}
      onError={(error) => {
        console.error("[voice] ElevenLabs conversation error", error);
      }}
      onUnhandledClientToolCall={(toolCall) => {
        console.warn("[voice] Unhandled client tool call", toolCall);
      }}
    >
      <VoiceClientTools />
      {children}
    </ConversationProvider>
  );
}