import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Database, Inquiry, SiteConfig } from "@/lib/types";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "werkseite.json");
const EMPTY_DATABASE: Database = { sites: [], inquiries: [] };

let writeQueue = Promise.resolve();

async function readDatabase(): Promise<Database> {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf8")) as Database;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return structuredClone(EMPTY_DATABASE);
    }
    throw error;
  }
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
  patch: Partial<Pick<SiteConfig, "template" | "color" | "sections" | "pages" | "indexable">>,
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
