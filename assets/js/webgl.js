// Reusable WebGL2 helpers

// Load a shader's source code from a file
export async function loadShaderSource(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load shader: ${path}`);
  }

  // "#version 300 es" must be the very first line, so strip any
  // leading whitespace or blank lines
  return (await response.text()).trim();
}

// Compile one shader stage (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error:\n${log}`);
  }

  return shader;
}

// Compile both stages and link them into a program
export function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // The shaders are no longer needed once the program is linked
  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error:\n${log}`);
  }

  return program;
}

// Create a quad covering the whole screen, drawn as a triangle strip
export function createFullscreenQuad(gl) {
  // Corners in clip space: bottom-left, bottom-right, top-left, top-right
  const vertices = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1,
  ]);

  // The vertex array object records the buffer and attribute layout below
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Attribute 0 (a_position): two floats per vertex, tightly packed
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);

  return { vao, buffer, vertexCount: 4 };
}

// Read a hex colour CSS variable (e.g. --color-bg) as an [r, g, b] array from 0 to 1
export function readCssColor(name) {
  const hex = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = parseInt(hex.slice(1), 16);

  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}
