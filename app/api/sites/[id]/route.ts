import { NextResponse } from "next/server";
import { COLOR_IDS, PAGE_IDS, SECTION_IDS, TEMPLATE_IDS } from "@/lib/types";
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
    ...(typeof body.template === "string" && TEMPLATE_IDS.includes(body.template as never)
      ? { template: body.template as (typeof TEMPLATE_IDS)[number] }
      : {}),
    ...(typeof body.color === "string" && COLOR_IDS.includes(body.color as never)
      ? { color: body.color as (typeof COLOR_IDS)[number] }
      : {}),
    ...(Array.isArray(body.sections)
      ? { sections: body.sections.filter((value) => SECTION_IDS.includes(value as never)) }
      : {}),
    ...(Array.isArray(body.pages)
      ? { pages: body.pages.filter((value) => PAGE_IDS.includes(value as never)) }
      : {}),
  };
  const site = await updateSite(id, patch);
  return site
    ? NextResponse.json({ site })
    : NextResponse.json({ error: "Website nicht gefunden." }, { status: 404 });
}
