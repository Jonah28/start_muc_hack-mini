import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import * as cheerio from "cheerio";
import type { BusinessProfile } from "@/lib/types";
import { cleanText, normalizeUrl } from "@/lib/utils";

const MAX_SOURCE_LENGTH = 18_000;
const USER_AGENT =
  "Mozilla/5.0 (compatible; WerkseiteBot/1.0; +https://werkseite.org)";

function isPrivateIp(address: string) {
  if (isIP(address) === 4) {
    const [a, b] = address.split(".").map(Number);
    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }
  return (
    address === "::1" ||
    address.startsWith("fc") ||
    address.startsWith("fd") ||
    address.startsWith("fe80:")
  );
}

async function assertPublicUrl(value: string) {
  const url = new URL(value);
  const addresses = await lookup(url.hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateIp(address))) {
    throw new Error("Diese Website-Adresse kann nicht abgerufen werden.");
  }
}

function firstMatch(text: string, pattern: RegExp) {
  return cleanText(text.match(pattern)?.[0] || "");
}

function fallbackProfile(
  sourceUrl: string,
  title: string,
  description: string,
  headings: string[],
  text: string,
  phone: string,
  email: string,
  imageUrls: string[],
): BusinessProfile {
  const hostname = new URL(sourceUrl).hostname.replace(/^www\./, "");
  const rawName = title.split(/[|–—-]/)[0] || headings[0] || hostname.split(".")[0];
  const name = cleanText(rawName).slice(0, 100) || "Ihr Handwerksbetrieb";
  const serviceCandidates = headings
    .filter((heading) => heading.length >= 3 && heading.length <= 80)
    .filter((heading) => !/kontakt|impressum|datenschutz|über uns/i.test(heading));

  return {
    name,
    trade: serviceCandidates[0] || "Handwerksbetrieb",
    description:
      cleanText(description).slice(0, 500) ||
      `${name} steht für zuverlässige Handwerksarbeit, persönliche Beratung und saubere Ergebnisse.`,
    services:
      [...new Set(serviceCandidates)].slice(0, 6).length > 0
        ? [...new Set(serviceCandidates)].slice(0, 6)
        : ["Beratung", "Planung", "Fachgerechte Ausführung"],
    serviceArea: firstMatch(text, /\b(?:in|aus|für|rund um)\s+[A-ZÄÖÜ][\p{L}-]+/u) || "Ihre Region",
    phone: phone || "+49 123 456789",
    email: email || "kontakt@beispiel.de",
    address:
      firstMatch(
        text,
        /\b[\p{L}][\p{L}\s.-]+\s+\d+[a-z]?,?\s+\d{5}\s+[\p{L}\s.-]+/iu,
      ) || "Musterstraße 1, 12345 Musterstadt",
    imageUrls,
    sourceUrl,
  };
}

function extractOutputText(response: unknown) {
  if (!response || typeof response !== "object") return "";
  const body = response as {
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };
  if (body.output_text) return body.output_text;
  return (
    body.output
      ?.flatMap((item) => item.content || [])
      .find((content) => content.type === "output_text")?.text || ""
  );
}

async function enrichWithOpenAI(
  fallback: BusinessProfile,
  sourceText: string,
): Promise<BusinessProfile> {
  if (!process.env.OPENAI_API_KEY) return fallback;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
      input: [
        {
          role: "system",
          content:
            "Extrahiere ausschließlich belegbare Informationen über den Handwerksbetrieb. Schreibe auf Deutsch. Nutze sinnvolle kurze Platzhalter, wenn Angaben fehlen.",
        },
        {
          role: "user",
          content: `Quell-URL: ${fallback.sourceUrl}\n\nWebsite-Inhalt:\n${sourceText}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "business_profile",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              name: { type: "string" },
              trade: { type: "string" },
              description: { type: "string" },
              services: { type: "array", items: { type: "string" } },
              serviceArea: { type: "string" },
              phone: { type: "string" },
              email: { type: "string" },
              address: { type: "string" },
            },
            required: [
              "name",
              "trade",
              "description",
              "services",
              "serviceArea",
              "phone",
              "email",
              "address",
            ],
          },
        },
      },
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API antwortete mit ${response.status}.`);
  }

  const parsed = JSON.parse(extractOutputText(await response.json())) as Partial<BusinessProfile>;
  return {
    ...fallback,
    ...parsed,
    services: parsed.services?.filter(Boolean).slice(0, 8) || fallback.services,
    imageUrls: fallback.imageUrls,
    sourceUrl: fallback.sourceUrl,
  };
}

export async function extractBusinessProfile(inputUrl: string) {
  const sourceUrl = normalizeUrl(inputUrl);
  await assertPublicUrl(sourceUrl);

  let html = "";
  try {
    const response = await fetch(sourceUrl, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      throw new Error(`Die Website antwortete mit Status ${response.status}.`);
    }
    html = (await response.text()).slice(0, 2_000_000);
  } catch (error) {
    console.error("Website fetch failed, using placeholders:", error);
    const hostname = new URL(sourceUrl).hostname.replace(/^www\./, "").split(".")[0];
    return fallbackProfile(
      sourceUrl,
      hostname,
      "",
      [],
      "",
      "",
      "",
      [],
    );
  }

  const $ = cheerio.load(html);
  $("script, style, noscript, svg, iframe").remove();

  const title = cleanText($("title").first().text());
  const description = cleanText(
    $('meta[name="description"]').attr("content") || "",
  );
  const headings = $("h1, h2, h3")
    .map((_, element) => cleanText($(element).text()))
    .get()
    .filter(Boolean);
  const text = cleanText($("body").text()).slice(0, MAX_SOURCE_LENGTH);
  const phone =
    cleanText($('a[href^="tel:"]').first().attr("href")?.replace(/^tel:/, "") || "") ||
    firstMatch(text, /(?:\+49|0)[\d\s()/.-]{7,}/);
  const email =
    cleanText(
      $('a[href^="mailto:"]').first().attr("href")?.replace(/^mailto:/, "") || "",
    ) || firstMatch(text, /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
  const imageUrls = $("img[src]")
    .map((_, element) => {
      try {
        return new URL($(element).attr("src") || "", sourceUrl).toString();
      } catch {
        return "";
      }
    })
    .get()
    .filter((url) => /^https?:/i.test(url))
    .slice(0, 5);

  const fallback = fallbackProfile(
    sourceUrl,
    title,
    description,
    headings,
    text,
    phone,
    email,
    imageUrls,
  );

  try {
    return await enrichWithOpenAI(fallback, [title, description, ...headings, text].join("\n"));
  } catch (error) {
    console.error("OpenAI extraction failed, using fallback:", error);
    return fallback;
  }
}
