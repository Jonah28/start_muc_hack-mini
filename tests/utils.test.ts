import assert from "node:assert/strict";
import test from "node:test";
import { hostToSlug, normalizeUrl, slugify } from "../lib/utils.ts";

test("normalizeUrl adds https", () => {
  assert.equal(normalizeUrl("example.org"), "https://example.org/");
});

test("slugify creates DNS-safe slugs", () => {
  assert.equal(slugify("Müller & Söhne GmbH"), "mueller-soehne-gmbh");
});

test("hostToSlug resolves production and localhost subdomains", () => {
  assert.equal(hostToSlug("maler-mueller.werkseite.org", "werkseite.org"), "maler-mueller");
  assert.equal(hostToSlug("maler-mueller.localhost:3333", "werkseite.org"), "maler-mueller");
  assert.equal(hostToSlug("werkseite.org", "werkseite.org"), null);
});
