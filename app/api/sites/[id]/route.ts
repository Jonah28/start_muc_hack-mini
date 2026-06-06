import { NextResponse } from "next/server";
import { updateSite } from "@/lib/store";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  const patch = {
    ...(typeof body.indexable === "boolean" ? { indexable: body.indexable } : {}),
  };
  const site = await updateSite(id, patch);
  return site
    ? NextResponse.json({ site })
    : NextResponse.json({ error: "Website nicht gefunden." }, { status: 404 });
}
