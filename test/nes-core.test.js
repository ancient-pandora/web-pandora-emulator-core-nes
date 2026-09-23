import assert from "node:assert/strict";
import test from "node:test";
import { configureNesRuntime, installNesRuntimeGlobals, NES_CORE_ID, NES_CORE_VERSION } from "../src/nes-core.js";
import { configureNesCore, nesPlatform } from "../src/platform.js";
import { readFile } from "node:fs/promises";

test("declares the pinned FCEUmm single-media platform", () => {
  assert.equal(NES_CORE_ID, "fceumm");
  assert.equal(NES_CORE_VERSION, "4.2.3");
  assert.equal(nesPlatform.kind, "console");
  assert.deepEqual(nesPlatform.media.extensions, [".nes"]);
  assert.equal(nesPlatform.core.frontend, "EmulatorJS");
  assert.equal("dos" in nesPlatform, false);
});

test("builds the exact EmulatorJS runtime configuration", () => {
  const config = configureNesRuntime({ player: "#screen", gameName: "Test", gameUrl: "blob:test", dataPath: "/core/nes/runtime" });
  assert.equal(config.EJS_core, "nes");
  assert.equal(config.EJS_pathtodata, "/core/nes/runtime/");
  assert.deepEqual(config.EJS_defaultOptions, { retroarch_core: "fceumm" });
  assert.equal(config.EJS_threads, false);
});

test("installs runtime globals without owning product persistence", () => {
  const target = {};
  assert.equal(configureNesCore(target, { player: "#screen", gameUrl: "blob:test" }), target);
  assert.equal(target.EJS_core, "nes");
  assert.equal("indexedDB" in target, false);
});

test("rejects incomplete runtime configuration", () => {
  assert.throws(() => configureNesRuntime({ gameUrl: "blob:test" }), /player selector/);
  assert.throws(() => configureNesRuntime({ player: "#screen" }), /ROM URL/);
  assert.throws(() => installNesRuntimeGlobals(null, { player: "#screen", gameUrl: "blob:test" }), /global target/);
});

test("manifest pins the core archives and their runtime decompressor", async () => {
  const manifest = JSON.parse(await readFile(new URL("../core-manifest.json", import.meta.url), "utf8"));
  assert.equal(Object.keys(manifest.sha256).length, 11);
  assert.ok(manifest.sha256["runtime/compression/extract7z.js"]);
});
