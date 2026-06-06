import assert from "node:assert/strict";
import test from "node:test";
import { createFallbackSiteContent } from "../lib/site-content.ts";

const profile = {
  name: "Maler Müller",
  trade: "Malerbetrieb",
  description: "Wir gestalten Innenräume und Fassaden.",
  services: ["Innenanstrich", "Fassadenanstrich"],
  serviceArea: "München",
  phone: "089 123456",
  email: "hallo@maler-mueller.de",
  address: "Musterweg 1, 80331 München",
  imageUrls: [],
  sourceUrl: "https://maler-mueller.de",
};

test("fallback content creates distinct copy for every subpage", () => {
  const content = createFallbackSiteContent(profile);

  assert.equal(content.services.services.length, profile.services.length);
  assert.equal(content.about.paragraphs.length, 2);
  assert.match(content.contact.areaText, /München/);
  assert.notEqual(content.services.title, content.about.title);
});

test("fallback content prepares two future image generations per subpage", () => {
  const content = createFallbackSiteContent(profile);
  const images = Object.values(content).flatMap((page) => Object.values(page.images));

  assert.equal(images.length, 6);
  assert.ok(images.every((image) => image.prompt.includes(profile.name)));
  assert.ok(images.every((image) => image.url === undefined));
});
