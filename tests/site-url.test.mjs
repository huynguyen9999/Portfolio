import test from "node:test";
import assert from "node:assert/strict";
import { resolveSiteUrl } from "../lib/site-url.ts";

test("canonical origin has a safe default and normalizes deployment configuration", () => {
  assert.equal(resolveSiteUrl(), "https://huythedev.vercel.app");
  assert.equal(
    resolveSiteUrl(" ", "portfolio.example.com"),
    "https://portfolio.example.com",
  );
  assert.equal(
    resolveSiteUrl(" https://Huy.example.com/ ", "ignored.example.com"),
    "https://huy.example.com",
  );
});

test("invalid canonical configuration fails before publication", () => {
  for (const url of [
    "not a URL",
    "http://example.com",
    "javascript:alert(1)",
    "https://user:password@example.com",
    "https://example.com/path",
    "https://example.com/?tracking=1",
    "https://example.com/#work",
  ]) {
    assert.throws(() => resolveSiteUrl(url));
  }
});
