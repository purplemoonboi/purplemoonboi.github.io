import {
  loadShaderSource,
  createProgram,
  createFullscreenQuad,
  readCssColor,
} from "./webgl.js";

// Limit the resolution on high-density screens to save GPU time
const MAX_PIXEL_RATIO = 2;

const canvas = document.getElementById("background-canvas");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let gl = null;
let renderer = null;
let frameId = 0;

// Load the shaders and create everything needed to draw
async function createRenderer() {
  const [vertexSource, fragmentSource] = await Promise.all([
    loadShaderSource("assets/shaders/fullscreen.vert"),
    loadShaderSource("assets/shaders/background.frag"),
  ]);

  const program = createProgram(gl, vertexSource, fragmentSource);
  const quad = createFullscreenQuad(gl);

  const uniforms = {
    time: gl.getUniformLocation(program, "u_time"),
    resolution: gl.getUniformLocation(program, "u_resolution"),
    colorCentre: gl.getUniformLocation(program, "u_colorCentre"),
    colorEdge: gl.getUniformLocation(program, "u_colorEdge"),
    colorAccent: gl.getUniformLocation(program, "u_colorAccent"),
  };

  // The colours come from the site's CSS variables and never change,
  // so they only need setting once
  gl.useProgram(program);
  gl.uniform3fv(uniforms.colorCentre, readCssColor("--color-bg-alt"));
  gl.uniform3fv(uniforms.colorEdge, readCssColor("--color-bg"));
  gl.uniform3fv(uniforms.colorAccent, readCssColor("--color-contrast-muted"));

  return { program, quad, uniforms };
}

// Match the canvas's pixel size to its size on screen
function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
  const width = Math.round(canvas.clientWidth * ratio);
  const height = Math.round(canvas.clientHeight * ratio);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
}

function drawFrame(timeMs) {
  resizeCanvas();

  gl.useProgram(renderer.program);
  gl.uniform1f(renderer.uniforms.time, timeMs / 1000);
  gl.uniform2f(renderer.uniforms.resolution, canvas.width, canvas.height);

  gl.bindVertexArray(renderer.quad.vao);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, renderer.quad.vertexCount);
}

// Draw every frame (the browser pauses this while the tab is hidden)
function renderLoop(timeMs) {
  drawFrame(timeMs);
  frameId = requestAnimationFrame(renderLoop);
}

function start() {
  stop();

  if (reducedMotion.matches) {
    drawFrame(0); // a single still frame
  } else {
    frameId = requestAnimationFrame(renderLoop);
  }
}

function stop() {
  cancelAnimationFrame(frameId);
}

async function init() {
  gl = canvas.getContext("webgl2", { alpha: false, antialias: false });

  // No WebGL2: keep the canvas hidden so the CSS gradient shows instead
  if (!gl) {
    return;
  }

  try {
    renderer = await createRenderer();
  } catch (error) {
    console.error("[WebGL]", error);
    return;
  }

  start();
  canvas.classList.add("ready"); // fade the canvas in
}

// The GPU can drop the context (e.g. on mobile when memory is low).
// Stop drawing, then rebuild everything once it comes back.
canvas.addEventListener("webglcontextlost", (event) => {
  event.preventDefault(); // tells the browser we want the context restored
  stop();
  renderer = null;
});

canvas.addEventListener("webglcontextrestored", init);

// Restart when the reduced-motion setting changes
reducedMotion.addEventListener("change", () => {
  if (renderer) {
    start();
  }
});

// A still frame needs redrawing when the window is resized
window.addEventListener("resize", () => {
  if (renderer && reducedMotion.matches) {
    drawFrame(0);
  }
});

init();
