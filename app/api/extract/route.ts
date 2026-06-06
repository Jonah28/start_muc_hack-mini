import { NextResponse } from "next/server";
import { extractBusinessProfile } from "@/lib/extract";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: string };
    if (!body.url) throw new Error("Bitte gib eine Website-Adresse ein.");
    return NextResponse.json({ profile: await extractBusinessProfile(body.url) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Website konnte nicht analysiert werden." },
      { status: 400 },
    );
  }
}
