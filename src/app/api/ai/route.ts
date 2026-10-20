import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildContext, buildSystemPrompt } from "@/lib/ai/prompt";
import { assistantRequestSchema } from "@/lib/ai/validation";

export const runtime = "nodejs";

function readLocalEnv(name: string) {
  if (process.env.NODE_ENV === "production") {
    return undefined;
  }

  try {
    const file = readFileSync(join(process.cwd(), ".env.local"), "utf8");
    const line = file
      .split(/\r?\n/)
      .find((entry) => entry.trim().startsWith(`${name}=`));

    if (!line) {
      return undefined;
    }

    return line
      .slice(line.indexOf("=") + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  } catch {
    return undefined;
  }
}

function getServerEnv(name: string) {
  return (readLocalEnv(name) || process.env[name] || "").trim();
}

type OpenAIResponsePayload = {
  output_text?: string;
  model?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  error?: { message?: string };
};

function extractResponseText(data: OpenAIResponsePayload) {
  if (data.output_text) {
    return data.output_text;
  }

  const textFromOutput = data.output
    ?.flatMap((item) => item.content || [])
    .filter((content) => content.type === "output_text" && content.text)
    .map((content) => content.text)
    .join("\n\n")
    .trim();

  return textFromOutput || "";
}

export function GET() {
  return NextResponse.json({ available: false }, { status: 503 });
}

export async function POST(request: NextRequest) {
  // Fail closed: a public paid AI endpoint must not rely on spoofable headers
  // or a process-local limiter. Re-enable only after deployment-specific
  // shared limits, budget protection, and trusted identity are implemented.
  if (getServerEnv("AI_PUBLIC_ENABLED") !== "true") {
    return NextResponse.json(
      { error: "CosmoLens AI is temporarily unavailable." },
      { status: 503 },
    );
  }

  // Even when explicitly enabled, refuse paid upstream calls until the
  // production protection layer is implemented and verified.
  return NextResponse.json(
    { error: "Public AI access requires additional server-side protections." },
    { status: 503 },
  );
}
