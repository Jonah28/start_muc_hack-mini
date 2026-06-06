import { headers } from "next/headers";
import { ROOT_DOMAIN, siteOrigin } from "@/lib/config";
import { getSiteBySlug } from "@/lib/store";
import { hostToSlug } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET() {
  const slug = hostToSlug((await headers()).get("host") || "", ROOT_DOMAIN);
  const site = slug ? await getSiteBySlug(slug) : null;
  const origin = site ? siteOrigin(site.slug) : "";
  const urls = site?.indexable ? ["", ...site.pages.map((page) => `/${page}`)] : [];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `<url><loc>${origin}${path}</loc><lastmod>${site?.updatedAt}</lastmod></url>`).join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
