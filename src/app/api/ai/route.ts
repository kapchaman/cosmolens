import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildContext, buildSystemPrompt } from "@/lib/ai/prompt";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { assistantRequestSchema } from "@/lib/ai/validation";

export const runtime = "nodejs";

function getClientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "local";
}

function keyFingerprint(value?: string) {
  if (!value) {
    return null;
  }

  return createHash("sha256").update(value.trim()).digest("hex").slice(0, 12);
}

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
  const apiKey = getServerEnv("OPENAI_API_KEY");

  return NextResponse.json({
    configured: Boolean(apiKey),
    keyFingerprint: keyFingerprint(apiKey),
    keyLooksLikeOpenAIKey: Boolean(apiKey?.startsWith("sk-")),
    model: getServerEnv("OPENAI_MODEL") || "gpt-5-mini",
  });
}

export async function POST(request: NextRequest) {
  const apiKey = getServerEnv("OPENAI_API_KEY");

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "CosmoLens AI is not configured yet. Add OPENAI_API_KEY to .env.local.",
      },
      { status: 503 },
    );
  }

  const limit = checkRateLimit(getClientKey(request));
  if (!limit.ok) {
    return NextResponse.json(
      { error: "CosmoLens AI is receiving too many requests. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = assistantRequestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "The request was incomplete. Please refine the question and try again." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const context = buildContext(input.mode, input.objectId, input.scaleId, input.comparisonObjectId);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: getServerEnv("OPENAI_MODEL") || "gpt-5-mini",
        instructions: buildSystemPrompt(),
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify(
                  {
                    task: "Answer the user's astronomy question using the supplied CosmoLens context.",
                    mode: input.mode,
                    modeInstruction: context.modeInstruction,
                    educationLevel: input.educationLevel || "not provided",
                    currentObject: context.objectContext,
                    comparisonObject: context.comparisonObjectContext,
                    currentScale: context.scaleContext,
                    recentSessionHistory: input.history,
                    userQuestion: input.question,
                  },
                  null,
                  2,
                ),
              },
            ],
          },
        ],
        max_output_tokens: 900,
        store: false,
      }),
    });

    const data = (await response.json()) as OpenAIResponsePayload;

    if (!response.ok) {
      const status = response.status === 401 || response.status === 403 ? 401 : 502;
      return NextResponse.json(
        {
          error:
            status === 401
              ? "CosmoLens AI could not authenticate with OpenAI. Check OPENAI_API_KEY in .env.local and restart the dev server."
              : "CosmoLens AI could not complete the OpenAI request. Please try again shortly.",
        },
        { status },
      );
    }

    const answer = extractResponseText(data);

    return NextResponse.json({
      answer: answer || "CosmoLens AI returned an empty response.",
      model: data.model,
    });
  } catch (error) {
    console.error("CosmoLens AI request failed", error instanceof Error ? error.name : "UnknownError");
    return NextResponse.json(
      {
        error:
          "CosmoLens AI could not answer right now. The astronomy atlas still works, and you can try again shortly.",
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
