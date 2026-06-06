import { NextResponse, type NextRequest } from "next/server";
import { ROOT_DOMAIN } from "@/lib/config";
import { hostToSlug } from "@/lib/utils";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/sites/") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.[a-z0-9]+$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const slug = hostToSlug(request.headers.get("host") || "", ROOT_DOMAIN);
  if (!slug) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/sites/${slug}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
