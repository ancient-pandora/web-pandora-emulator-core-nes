const input = document.querySelector("#rom");
const screen = document.querySelector("#screen");
const status = document.querySelector("#status");
let romUrl = null;
let loaderStarted = false;

input.addEventListener("change", async () => {
  const file = input.files?.[0];
  if (!file) return;

  try {
    status.textContent = `${file.name} 읽는 중…`;
    if (loaderStarted) {
      location.reload();
      return;
    }

    romUrl = URL.createObjectURL(file);
    const { installNesRuntimeGlobals } = await import("../src/nes-core.js");
    installNesRuntimeGlobals(globalThis, {
      player: "#screen",
      gameName: file.name.replace(/\.nes$/i, ""),
      gameUrl: romUrl,
      dataPath: "../runtime/",
    });
    globalThis.EJS_ready = () => {
      status.textContent = `${file.name} · FCEUmm 준비 완료`;
    };
    globalThis.EJS_onGameStart = () => {
      status.textContent = `${file.name} · FCEUmm 실행 중`;
    };

    loaderStarted = true;
    const loader = document.createElement("script");
    loader.src = "../runtime/loader.js";
    loader.onerror = () => {
      loaderStarted = false;
      status.textContent = "실행 실패: FCEUmm 로더를 가져오지 못했습니다.";
    };
    loader.onload = () => {
      status.textContent = `${file.name} · FCEUmm 초기화 중…`;
    };
    document.body.append(loader);
  } catch (error) {
    status.textContent = `실행 실패: ${error instanceof Error ? error.message : String(error)}`;
  }
});

window.addEventListener("error", (event) => {
  status.textContent = `실행 실패: ${event.message || "브라우저 코어 오류"}`;
});

window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason instanceof Error ? event.reason.message : String(event.reason);
  status.textContent = `실행 실패: ${reason}`;
});

window.addEventListener("pagehide", () => {
  if (romUrl) URL.revokeObjectURL(romUrl);
}, { once: true });
