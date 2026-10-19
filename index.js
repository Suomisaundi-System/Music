const name = decodeURIComponent(location.pathname.split("/").filter(Boolean).at(-1) || "System");
document.title = `Suomisaundi System — ${name}`;
const main = document.createElement("main");
main.style.cssText = "max-width:860px;margin:10vh auto;padding:24px;font:16px system-ui,sans-serif;line-height:1.6";
const title = document.createElement("h1");
title.textContent = `Suomisaundi System — ${name}`;
const description = document.createElement("p");
description.textContent = "This independent community subsystem is initialized by index.js. Additional modules will be introduced here.";
const home = document.createElement("a");
home.href = "https://suomisaundi-system.github.io/";
home.textContent = "Return to Suomisaundi System";
main.append(title, description, home);
document.body.append(main);

// suomisaundi-browser-capabilities-v1
// Capability discovery is non-invasive: GPU and audio activation are deferred
// until a feature explicitly requests them, respecting permissions and gestures.
export const browserCapabilities = Object.freeze({
  webAssembly: typeof WebAssembly !== "undefined",
  webGPU: typeof navigator !== "undefined" && "gpu" in navigator,
  vectorGraphics: typeof document !== "undefined" &&
    typeof document.createElementNS === "function",
  webAudio: typeof window !== "undefined" &&
    Boolean(window.AudioContext || window.webkitAudioContext)
});

export async function createWebAssemblyModule(bytes, imports = {}) {
  if (!browserCapabilities.webAssembly) throw new Error("WebAssembly unavailable");
  return WebAssembly.instantiate(bytes, imports);
}

export async function requestWebGPUDevice() {
  if (!browserCapabilities.webGPU) throw new Error("WebGPU unavailable");
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw new Error("No WebGPU adapter available");
  const device = await adapter.requestDevice();
  return { adapter, device };
}

export function createSVG(width = 320, height = 180) {
  if (!browserCapabilities.vectorGraphics) throw new Error("SVG unavailable");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("role", "img");
  return svg;
}

export function createAudioContext() {
  if (!browserCapabilities.webAudio) throw new Error("Web Audio unavailable");
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  return new AudioContextClass();
}
