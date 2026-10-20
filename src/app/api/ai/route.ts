import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Public paid AI is disabled until trusted identification, shared throttling,
// and enforceable budget protections are implemented for the actual host.
// Do not enable by environment variable alone.
export function GET() {
  return NextResponse.json({ available: false }, { status: 503 });
}

export function POST() {
  return NextResponse.json(
    { error: "CosmoLens AI is temporarily unavailable." },
    { status: 503 },
  );
}
