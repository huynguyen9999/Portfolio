import test from "node:test";
import assert from "node:assert/strict";
import { projects, experience } from "../lib/content.ts";

test("project content supports unique static routes and complete breakdowns", () => {
  assert.equal(projects.length, 5);
  assert.equal(new Set(projects.map(project => project.slug)).size, projects.length);
  for (const project of projects) {
    assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    for (const key of ["title", "summary", "problem", "contribution", "tradeoff", "result"]) {
      assert.ok(project[key].trim().length > 0, `${project.slug}: ${key}`);
    }
    assert.ok(project.evidence.length > 0);
    assert.ok(project.tags.length > 0);
    if (project.liveUrl) assert.equal(new URL(project.liveUrl).protocol, "https:");
  }
  assert.equal(experience.length, 3);
});
