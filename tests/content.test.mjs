import test from "node:test";
import assert from "node:assert/strict";
import { projects, experience } from "../lib/content.ts";
import { existsSync } from "node:fs";
import { pieces } from "../components/about/content.ts";

test("project content supports unique static routes and complete breakdowns", () => {
  assert.ok(projects.length > 0);
  assert.equal(projects.filter((project) => project.featured).length, 1);
  assert.equal(
    new Set(projects.map((project) => project.slug)).size,
    projects.length,
  );
  for (const project of projects) {
    assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    for (const key of [
      "title",
      "summary",
      "problem",
      "contribution",
      "tradeoff",
      "result",
    ]) {
      assert.ok(project[key].trim().length > 0, `${project.slug}: ${key}`);
    }
    assert.ok(project.evidence.length > 0);
    assert.ok(project.tags.length > 0);
    for (const url of [project.liveUrl, project.sourceUrl].filter(Boolean)) {
      const parsed = new URL(url);
      assert.equal(parsed.protocol, "https:");
      assert.equal(parsed.username + parsed.password, "");
    }
    for (const asset of [project.image, project.posterUrl].filter(Boolean)) {
      assert.match(asset, /^\/(?!\/)/);
      assert.ok(
        existsSync(new URL(`../public${asset}`, import.meta.url)),
        asset,
      );
    }
    assert.ok(
      project.visual || project.image,
      `${project.slug}: missing visual`,
    );
    if (project.image)
      assert.ok(
        project.imageAlt?.trim(),
        `${project.slug}: missing image description`,
      );
  }
  assert.ok(experience.length > 0);
});

test("Unwrap is the newest and featured project with a repository link", () => {
  const latest = projects[0];
  assert.equal(latest.slug, "unwrapathon");
  assert.equal(latest.title, "Unwrap");
  assert.equal(latest.featured, true);
  assert.equal(projects.find((project) => project.featured), latest);
  assert.equal(latest.sourceUrl, "https://github.com/kylevillepo2/Unwrapathon");
  assert.equal(latest.visual, "unwrap");
  assert.match(latest.metricLabel, /demo/);
  assert.match(latest.tradeoff, /generated metadata/);
});

test("About entries have unique identities and readable content", () => {
  assert.deepEqual(
    pieces.map((piece) => piece.id),
    ["roots", "engineer", "community", "photography", "hobbies", "learning"],
  );
  assert.deepEqual(
    pieces.map((piece) => piece.label),
    [
      "My Roots",
      "The Engineer",
      "People & Community",
      "Behind the Lens",
      "Off the Clock",
      "Still Figuring It Out",
    ],
  );
  assert.equal(new Set(pieces.map((piece) => piece.id)).size, pieces.length);
  for (const piece of pieces) {
    for (const field of ["label", "question", "answer", "icon"])
      assert.ok(piece[field].trim());
    assert.ok(piece.shortLabel.length >= 1 && piece.shortLabel.length <= 2);
    assert.match(piece.color, /^#[\da-f]{6}$/i);
    assert.equal(piece.image, undefined);
  }
});
