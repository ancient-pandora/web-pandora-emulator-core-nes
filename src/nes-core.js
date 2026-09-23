export const NES_CORE_ID = "fceumm";
export const NES_CORE_VERSION = "4.2.3";

export function configureNesRuntime({ player, gameName, gameUrl, dataPath = "./runtime/" }) {
  if (typeof player !== "string" || !player) throw new TypeError("An EmulatorJS player selector is required");
  if (typeof gameUrl !== "string" || !gameUrl) throw new TypeError("An NES ROM URL is required");
  const normalizedPath = dataPath.endsWith("/") ? dataPath : `${dataPath}/`;
  return Object.freeze({
    EJS_player: player,
    EJS_core: "nes",
    EJS_gameName: gameName || "NES Game",
    EJS_gameUrl: gameUrl,
    EJS_pathtodata: normalizedPath,
    EJS_startOnLoaded: true,
    EJS_threads: false,
    EJS_defaultOptions: Object.freeze({ retroarch_core: NES_CORE_ID }),
  });
}

export function installNesRuntimeGlobals(target, options) {
  if (!target || typeof target !== "object") throw new TypeError("A global target is required");
  Object.assign(target, configureNesRuntime(options));
  return target;
}
