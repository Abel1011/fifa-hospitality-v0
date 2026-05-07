"use client";

import { useConversationClientTool } from "@elevenlabs/react";
import {
  VOICE_SECTION_IDS,
  type VoiceSectionId,
} from "@/lib/voice/starter-prompts";

const VALID_SECTION_IDS = new Set<string>(VOICE_SECTION_IDS);

type ClientToolParameters = Record<string, unknown>;

function readStringParameter(
  parameters: ClientToolParameters,
  key: string
) {
  const value = parameters[key];
  return typeof value === "string" ? value.trim() : "";
}

function readBooleanParameter(
  parameters: ClientToolParameters,
  key: string
) {
  const value = readStringParameter(parameters, key).toLowerCase();

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

function readNumberParameter(
  parameters: ClientToolParameters,
  key: string
) {
  const value = readStringParameter(parameters, key);
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function readStagesParameter(parameters: ClientToolParameters, key: string) {
  const value = readStringParameter(parameters, key);
  if (!value) {
    return undefined;
  }

  const stages = value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return stages.length ? stages : undefined;
}

async function queryHospitalityKnowledge(parameters: ClientToolParameters) {
  const payload = {
    intent: readStringParameter(parameters, "intent"),
    team: readStringParameter(parameters, "team") || undefined,
    venue: readStringParameter(parameters, "venue") || undefined,
    stage: readStringParameter(parameters, "stage") || undefined,
    category: readStringParameter(parameters, "category") || undefined,
    date: readStringParameter(parameters, "date") || undefined,
    group: readStringParameter(parameters, "group") || undefined,
    slot: readStringParameter(parameters, "slot") || undefined,
    travelFlexibility:
      readStringParameter(parameters, "travelFlexibility") || undefined,
    matchNumber: readNumberParameter(parameters, "matchNumber"),
    partySize: readNumberParameter(parameters, "partySize"),
    desiredMatchCount: readNumberParameter(parameters, "desiredMatchCount"),
    wantsPrivate: readBooleanParameter(parameters, "wantsPrivate"),
    wantsFollowTeam: readBooleanParameter(parameters, "wantsFollowTeam"),
    includeTbd: readBooleanParameter(parameters, "includeTbd"),
    desiredStages: readStagesParameter(parameters, "desiredStages"),
  };

  const response = await fetch("/api/voice/knowledge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    return JSON.stringify(
      {
        error:
          (body && typeof body === "object" && "error" in body && body.error) ||
          "Knowledge lookup failed.",
        detail:
          body && typeof body === "object" && "issues" in body
            ? body.issues
            : undefined,
      },
      null,
      2
    );
  }

  return JSON.stringify(body, null, 2);
}

export default function VoiceClientTools() {
  useConversationClientTool(
    "query_hospitality_knowledge",
    async (parameters: ClientToolParameters) => {
      const intent = readStringParameter(parameters, "intent");
      if (!intent) {
        return JSON.stringify(
          {
            error: "Missing intent for knowledge lookup.",
          },
          null,
          2
        );
      }

      return queryHospitalityKnowledge(parameters);
    }
  );

  useConversationClientTool(
    "scroll_to_section",
    (parameters: ClientToolParameters) => {
      const sectionId = readStringParameter(parameters, "sectionId") as VoiceSectionId;
      if (!sectionId || !VALID_SECTION_IDS.has(sectionId)) {
        return `Unknown section: ${readStringParameter(parameters, "sectionId") || "missing"}.`;
      }

      const section = document.getElementById(sectionId);
      if (!section) {
        return `Section ${sectionId} is not available on the page.`;
      }

      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return `Scrolled to ${sectionId}.`;
    }
  );

  useConversationClientTool(
    "set_host_browse_mode",
    (parameters: ClientToolParameters) => {
      const tab = readStringParameter(parameters, "tab");
      if (tab !== "city" && tab !== "team") {
        return "The host browser only supports city and team tabs.";
      }

      window.dispatchEvent(
        new CustomEvent("voice:set-host-browse-mode", {
          detail: { tab },
        })
      );

      return `Switched host browser to ${tab}.`;
    }
  );

  useConversationClientTool(
    "open_external_hospitality_link",
    (parameters: ClientToolParameters) => {
      const href = readStringParameter(parameters, "href");
      if (!href) {
        return "Missing href for external navigation.";
      }

      try {
        const url = new URL(href, window.location.origin);
        window.location.assign(url.toString());
        return `Navigated to ${url.toString()}.`;
      } catch {
        return `Invalid URL: ${href}.`;
      }
    }
  );

  return null;
}