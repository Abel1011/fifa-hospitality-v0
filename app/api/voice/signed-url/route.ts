import { NextResponse } from "next/server";
import {
  getElevenLabsServerConfig,
  isElevenLabsConfigured,
} from "@/lib/voice/server-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const config = getElevenLabsServerConfig();

  if (!isElevenLabsConfigured()) {
    return NextResponse.json(
      {
        error:
          "ElevenLabs infrastructure is installed, but ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID are not configured yet.",
      },
      { status: 503 }
    );
  }

  const url = new URL(
    "https://api.elevenlabs.io/v1/convai/conversation/get-signed-url"
  );
  url.searchParams.set("agent_id", config.agentId);

  const response = await fetch(url.toString(), {
    headers: {
      "xi-api-key": config.apiKey,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");

    return NextResponse.json(
      {
        error: "Failed to generate an ElevenLabs signed URL.",
        detail: detail || undefined,
      },
      { status: response.status }
    );
  }

  const body = (await response.json()) as { signed_url?: string };
  if (!body.signed_url) {
    return NextResponse.json(
      {
        error: "ElevenLabs signed URL response did not include a signed URL.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ signedUrl: body.signed_url });
}