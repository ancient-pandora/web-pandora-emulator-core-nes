import { NES_CORE_ID, NES_CORE_VERSION, installNesRuntimeGlobals } from "./nes-core.js";

export const nesPlatform = Object.freeze({
  id: "nes",
  name: "NES / Famicom",
  kind: "console",
  defaultCore: NES_CORE_ID,
  media: Object.freeze({
    model: "single-media",
    extensions: Object.freeze([".nes"]),
    accept: ".nes,application/octet-stream",
  }),
  capabilities: Object.freeze({
    audio: true,
    keyboard: true,
    gamepad: true,
    batterySave: true,
    snapshots: true,
    screenshot: true,
  }),
  core: Object.freeze({
    id: NES_CORE_ID,
    version: NES_CORE_VERSION,
    frontend: "EmulatorJS",
    upstream: "https://github.com/libretro/libretro-fceumm",
    license: "GPL-2.0",
  }),
});

export function configureNesCore(target, options) {
  return installNesRuntimeGlobals(target, options);
}
