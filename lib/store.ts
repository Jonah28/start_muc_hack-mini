import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { createFallbackSiteContent } from "@/lib/site-content";
import type { Database, DesignChoices, Inquiry, SiteConfig } from "@/lib/types";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "werkseite.json");
const EMPTY_DATABASE: Database = { sites: [], inquiries: [] };

let writeQueue = Promise.resolve();

async function readDatabase(): Promise<Database> {
  try {
    const database = JSON.parse(await readFile(DATA_FILE, "utf8")) as Database;
    database.sites = database.sites.map(normalizeSite);
    return database;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return structuredClone(EMPTY_DATABASE);
    }
    throw error;
  }
}

function normalizeSite(site: SiteConfig & { template?: string; color?: string; sections?: string[] }) {
  const legacyPalettes: Record<string, DesignChoices["palette"]> = {
    blau: { name: "Trusted Blue", colors: ["#123046", "#195f92", "#e9f3fa", "#475569"] },
    gruen: { name: "Fresh Green", colors: ["#173a2b", "#2d6a4f", "#e7f2ec", "#475569"] },
    orange: { name: "Warm Craft", colors: ["#51280d", "#c45d18", "#fbefe5", "#475569"] },
    anthrazit: { name: "Slate Pro", colors: ["#1e2228", "#424952", "#eef0f2", "#475569"] },
  };
  return {
    ...site,
    design:
      site.design ||
      {
        template: { id: "classic-trades", name: "Classic Trades" },
        palette: legacyPalettes[site.color || "blau"] || legacyPalettes.blau,
        font: { name: "Modern Sans", heading: "'Poppins', sans-serif", body: "'Inter', sans-serif" },
        heroLayout: "split" as const,
        sections: ["hero", ...(site.sections || ["services", "about", "contact"])],
      },
    content: site.content || createFallbackSiteContent(site.profile),
  };
}

async function writeDatabase(database: Database) {
  await mkdir(DATA_DIR, { recursive: true });
  const temporaryFile = `${DATA_FILE}.${process.pid}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(database, null, 2));
  await rename(temporaryFile, DATA_FILE);
}

async function mutateDatabase<T>(mutation: (database: Database) => T | Promise<T>) {
  let result!: T;
  const operation = writeQueue.then(async () => {
    const database = await readDatabase();
    result = await mutation(database);
    await writeDatabase(database);
  });
  writeQueue = operation.catch(() => undefined);
  await operation;
  return result;
}

export async function listSites() {
  return (await readDatabase()).sites;
}

export async function getSiteBySlug(slug: string) {
  return (await readDatabase()).sites.find((site) => site.slug === slug) || null;
}

export async function getSiteById(id: string) {
  return (await readDatabase()).sites.find((site) => site.id === id) || null;
}

export async function createSite(
  input: Omit<SiteConfig, "id" | "createdAt" | "updatedAt">,
) {
  return mutateDatabase((database) => {
    const now = new Date().toISOString();
    const site: SiteConfig = { ...input, id: randomUUID(), createdAt: now, updatedAt: now };
    database.sites.push(site);
    return site;
  });
}

export async function updateSite(
  id: string,
  patch: Partial<Pick<SiteConfig, "design" | "pages" | "indexable">>,
) {
  return mutateDatabase((database) => {
    const site = database.sites.find((candidate) => candidate.id === id);
    if (!site) return null;
    Object.assign(site, patch, { updatedAt: new Date().toISOString() });
    return site;
  });
}

export async function createInquiry(input: Omit<Inquiry, "id" | "createdAt">) {
  return mutateDatabase((database) => {
    const inquiry: Inquiry = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    database.inquiries.push(inquiry);
    return inquiry;
  });
}
