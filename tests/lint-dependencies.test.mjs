import test, { after } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { ESLint } from "eslint";

const require = createRequire(import.meta.url);
const configRequire = createRequire(require.resolve("eslint-config-next"));
const pluginEntry = configRequire.resolve("@next/eslint-plugin-next");
const pluginRequire = createRequire(pluginEntry);
const { getRootDirs } = pluginRequire("./utils/get-root-dirs.js");
const fixture = mkdtempSync(join(tmpdir(), "portfolio-lint-roots-"));
const normalized = path => path.replaceAll("\\", "/");
const root = normalized(fixture);
for (const path of ["apps/web/pages", "apps/admin/pages", "apps/.hidden", "packages/ui", "apps/web/nested"]) {
  mkdirSync(join(fixture, path), { recursive: true });
}
writeFileSync(join(fixture, "apps/web/pages/about.tsx"), "export default function About() { return null; }");
writeFileSync(join(fixture, "apps/readme.txt"), "not a directory");
after(() => rmSync(fixture, { recursive: true, force: true }));

const roots = rootDir => getRootDirs({ cwd: fixture, settings: { next: { rootDir } } }).map(path => normalized(resolve(path))).sort();

test("Next lint root discovery preserves default, literal, wildcard, and brace roots", () => {
  assert.deepEqual(roots(undefined), [root]);
  assert.deepEqual(roots(`${root}/apps/web`), [`${root}/apps/web`]);
  assert.deepEqual(roots(`${root}/apps/web/`), [`${root}/apps/web`]);
  assert.deepEqual(roots(`${root}/apps/*`), [`${root}/apps/admin`, `${root}/apps/web`]);
  assert.deepEqual(roots(`${root}/apps/{admin,web}`), [`${root}/apps/admin`, `${root}/apps/web`]);
  assert.deepEqual(roots([`${root}/apps/web`, `${root}/packages/*`, null, 17]), [`${root}/apps/web`, `${root}/packages/ui`]);
  assert.deepEqual(roots(`${root}/missing/*`), []);
  assert.deepEqual(roots(`${root}/apps/readme.txt`), []);
  assert.deepEqual(roots(`${root}/apps/web`.replaceAll("/", "\\")), [`${root}/apps/web`]);
});

test("the installed lint dependency resolves to tinyglobby and excludes the vulnerable chain", () => {
  assert.equal(pluginRequire("fast-glob/package.json").name, "tinyglobby");
  assert.equal(pluginRequire("fast-glob/package.json").version, "0.2.17");
  const lockfile = readFileSync(new URL("../pnpm-lock.yaml", import.meta.url), "utf8");
  assert.doesNotMatch(lockfile, /^\s+(?:braces|micromatch|fast-glob)@/m);
});

test("deeply nested patterns terminate without a stack overflow", () => {
  // Isolate adversarial input so an unexpected regression cannot hang the suite.
  const result = spawnSync(process.execPath, ["-e", `
    const { getRootDirs } = require(${JSON.stringify(join(dirname(pluginEntry), "utils/get-root-dirs.js"))});
    const patterns = ["{".repeat(4000) + "x" + "}".repeat(4000), "(".repeat(4000) + "x" + ")".repeat(4000)];
    for (const pattern of patterns) {
      const roots = getRootDirs({ cwd: process.cwd(), settings: { next: { rootDir: pattern } } });
      if (roots.length !== 0) process.exit(1);
    }
  `], { cwd: fixture, timeout: 5000, encoding: "utf8" });
  assert.equal(result.error, undefined, result.error?.message);
  assert.equal(result.status, 0, result.stderr);
});

test("Next lint rules still detect problems in configured project roots", async () => {
  const eslint = new ESLint({ overrideConfig: { settings: { next: { rootDir: `${root}/apps/*` } } } });
  const [result] = await eslint.lintText('export default function Example() { return <a href="/about">About</a>; }', {
    filePath: "components/__lint-regression-probe.tsx",
  });
  assert.ok(result.messages.some(message => message.ruleId === "@next/next/no-html-link-for-pages" && message.severity === 2), JSON.stringify(result.messages));
});
