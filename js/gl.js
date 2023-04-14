export const glCanvas = document.getElementById("renderer");
export const gl = glCanvas.getContext("webgl2", {
    stencil: false,
    antialias: false,
    desynchronized: false,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true,
    premultipliedAlpha: false,
    alpha: false
});