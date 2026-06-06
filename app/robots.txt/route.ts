import { headers } from "next/headers";
import { ROOT_DOMAIN, siteOrigin } from "@/lib/config";
import { getSiteBySlug } from "@/lib/store";
import { hostToSlug } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET() {
  const slug = hostToSlug((await headers()).get("host") || "", ROOT_DOMAIN);
  const site = slug ? await getSiteBySlug(slug) : null;
  const content = site?.indexable
    ? `User-agent: *\nAllow: /\nSitemap: ${siteOrigin(site.slug)}/sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n";
  return new Response(content, { headers: { "Content-Type": "text/plain" } });
}
