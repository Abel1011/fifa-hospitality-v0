import { NextResponse } from "next/server";
import {
  voiceKnowledgeRequestSchema,
  voiceKnowledgeToolBlueprints,
} from "@/lib/voice/knowledge/contracts";
import { executeVoiceKnowledgeRequest } from "@/lib/voice/knowledge/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    source: "json",
    contracts: voiceKnowledgeToolBlueprints,
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = voiceKnowledgeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid voice knowledge request.",
        issues: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const result = await executeVoiceKnowledgeRequest(parsed.data);
  return NextResponse.json(result);
}