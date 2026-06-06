import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteTemplate } from "@/components/SiteTemplate";
import { siteOrigin } from "@/lib/config";
import { getSiteBySlug } from "@/lib/store";

type Params = Promise<{ slug: string; path?: string[] }>;

async function resolveSite(params: Params) {
  const { slug, path = [] } = await params;
  const site = await getSiteBySlug(slug);
  const page = path[0];
  if (!site || path.length > 1 || (page && !site.pages.includes(page as never))) notFound();
  return { site, page };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { site, page } = await resolveSite(params);
  const pageName = page ? ` · ${page.replace("-", " ")}` : "";
  const title = `${site.profile.name}${pageName}`;
  const description = `${site.profile.trade} in ${site.profile.serviceArea}: ${site.profile.description}`.slice(0, 160);
  const canonical = `${siteOrigin(site.slug)}${page ? `/${page}` : ""}`;
  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: site.indexable, follow: site.indexable },
    openGraph: { title, description, url: canonical, type: "website" },
  };
}

export default async function CustomerSitePage({ params }: { params: Params }) {
  const { site, page } = await resolveSite(params);
  return <SiteTemplate site={site} page={page} />;
}
