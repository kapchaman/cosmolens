export const dynamic = "force-dynamic";
// Liveness only: no upstream calls, credentials, versions or configuration values.
export function GET() {
  return Response.json({ status: "ok", ai: "disabled" }, { headers: { "Cache-Control": "no-store" } });
}
