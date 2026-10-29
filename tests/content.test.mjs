import test from "node:test";
import assert from "node:assert/strict";
import { projects, experience, research } from "../lib/content.ts";
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
    if (project.summaryLink) {
      assert.ok(project.summary.includes(project.summaryLink.text));
      assert.equal(new URL(project.summaryLink.href).protocol, "https:");
    }
    assert.ok(project.evidence.length > 0);
    assert.ok(project.tags.length > 0);
    for (const url of [project.liveUrl, project.sourceUrl].filter(Boolean)) {
      const parsed = new URL(url);
      assert.equal(parsed.protocol, "https:");
      assert.equal(parsed.username + parsed.password, "");
    }
    if (project.featureShot) {
      assert.ok(project.featureShot.alt.trim());
      assert.ok(project.featureShot.title.trim());
      if (project.featureShot.caption !== undefined)
        assert.ok(project.featureShot.caption.trim());
      assert.ok(project.featureShot.width > 0 && project.featureShot.height > 0);
    }
    for (const asset of [project.image, project.posterUrl, project.featureShot?.image].filter(Boolean)) {
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

test("research names the UCSB lab project without a date range", () => {
  assert.equal(
    research.project,
    "Glass Antenna-in-Package for Converged FMCW Radar & Lidar TRX",
  );
  assert.equal(research.role, "Undergraduate Researcher");
  assert.equal(research.advisor, "Professor James F. Buckwalter");
  assert.equal(research.school, "UC Santa Barbara");
  assert.equal(
    research.lab,
    "RF & Mixed-signal Integrated Systems Lab",
  );
  assert.equal(
    research.summary,
    "Undergraduate research on a glass antenna-in-package for a transceiver that combines frequency-modulated continuous-wave radar and lidar.",
  );
  assert.equal(research.href, "https://rfic.ece.ucsb.edu/");
  assert.equal(research.period, undefined);
});

test("ECHO leads with source-corpus metrics and distinguishes planned estimates", () => {
  const latest = projects[0];
  assert.equal(latest.slug, "unwrapathon");
  assert.equal(latest.title, "ECHO");
  assert.equal(latest.featured, true);
  assert.equal(projects.find((project) => project.featured), latest);
  assert.equal(latest.sourceUrl, "https://github.com/kylevillepo2/Unwrapathon");
  assert.equal(latest.image, "/work/echo.jpg");
  assert.equal(latest.visual, undefined);
  assert.equal(latest.metric, "5.5M+");
  assert.equal(latest.metricLabel, "reviews in dataset");
  assert.deepEqual(latest.supportingMetrics, [
    { value: "60", label: "apps" },
    { value: "12", label: "categories" },
  ]);
  assert.match(latest.problem, /5,529,110 reviews/);
  assert.match(latest.result, /9,000 sampled reviews/);
  assert.match(latest.tradeoff, /remain future work/);
  assert.match(latest.tradeoff, /not all individually analyzed by AI/);
  assert.match(latest.tradeoff, /some demo data is simulated/);
});

test("About entries have unique identities and readable content", () => {
  assert.deepEqual(
    pieces.map((piece) => piece.id),
    ["roots", "engineer", "community", "photography", "hobbies", "learning"],
  );
  assert.deepEqual(
    pieces.map((piece) => piece.label),
    [
      "My Story",
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
