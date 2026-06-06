import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeUrl(input: string) {
  const value = input.trim();
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const url = new URL(candidate);
  if (!url.hostname.includes(".")) {
    throw new Error("Bitte gib eine gültige Website-Adresse ein.");
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Nur HTTP- und HTTPS-Websites werden unterstützt.");
  }
  return url.toString();
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function hostToSlug(hostname: string, rootDomain: string) {
  const host = hostname.split(":")[0].toLowerCase();
  if (
    host === rootDomain ||
    host === `www.${rootDomain}` ||
    host === "localhost" ||
    host === "127.0.0.1"
  ) {
    return null;
  }
  if (host.endsWith(`.${rootDomain}`)) {
    return host.slice(0, -(rootDomain.length + 1)).split(".")[0] || null;
  }
  if (host.endsWith(".localhost")) {
    return host.split(".")[0] || null;
  }
  return null;
}

export function isWeekend(date = new Date()) {
  return date.getDay() === 0 || date.getDay() === 6;
}
