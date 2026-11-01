#version 300 es

// Vertex shader for a full-screen quad.
// The quad's corners are already in clip space (-1 to 1),
// so they pass straight through with no transform.

layout(location = 0) in vec2 a_position;

out vec2 v_uv; // 0 to 1 across the screen, (0, 0) is bottom-left

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
