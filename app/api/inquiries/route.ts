import { NextResponse } from "next/server";
import { createInquiry, getSiteById } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const siteId = String(body.siteId || "");
    if (!(await getSiteById(siteId))) throw new Error("Website nicht gefunden.");

    const inquiry = await createInquiry({
      siteId,
      name: String(body.name || "").slice(0, 120),
      phone: String(body.phone || "").slice(0, 80),
      email: String(body.email || "").slice(0, 180),
      message: String(body.message || "").slice(0, 2000),
    });

    if (process.env.HEY_TELO_WEBHOOK_URL) {
      await fetch(process.env.HEY_TELO_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiry),
        signal: AbortSignal.timeout(8_000),
      }).catch((error) => console.error("Hey Telo webhook failed:", error));
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Anfrage konnte nicht gesendet werden." },
      { status: 400 },
    );
  }
}
