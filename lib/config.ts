export const ROOT_DOMAIN = process.env.ROOT_DOMAIN || "werkseite.org";
export const HEY_TELO_PHONE_NUMBER =
  process.env.HEY_TELO_PHONE_NUMBER || "+491234567890";

export function siteOrigin(slug: string) {
  if (process.env.NODE_ENV === "development") {
    return `http://${slug}.localhost:3333`;
  }
  return `https://${slug}.${ROOT_DOMAIN}`;
}
