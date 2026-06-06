import { NextResponse } from "next/server";
import { ROOT_DOMAIN, siteOrigin } from "@/lib/config";
import { parseSiteInput } from "@/lib/site-input";
import { createSite, getSiteBySlug } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const input = parseSiteInput(await request.json());
    let slug = input.slug;
    let suffix = 2;
    while (await getSiteBySlug(slug)) slug = `${input.slug}-${suffix++}`;

    const site = await createSite({ ...input, slug });
    return NextResponse.json({
      site,
      url: siteOrigin(site.slug),
      rootDomain: ROOT_DOMAIN,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Website konnte nicht erstellt werden." },
      { status: 400 },
    );
  }
}
