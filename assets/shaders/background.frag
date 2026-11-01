#version 300 es

// Fragment shader for the site background.
// Recreates the CSS radial gradient (lighter centre, darker corners)
// and adds slow, faint waves in the accent colour.

precision highp float;

uniform float u_time;        // seconds since the page loaded
uniform vec2 u_resolution;   // canvas size in pixels
uniform vec3 u_colorCentre;  // --color-bg-alt
uniform vec3 u_colorEdge;    // --color-bg
uniform vec3 u_colorAccent;  // --color-contrast-muted

in vec2 v_uv;

out vec4 outColor;

void main() {
  // Centre the coordinates and correct for the screen's aspect ratio
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = (v_uv - 0.5) * vec2(aspect, 1.0);

  // Radial gradient: 0 at the centre, 1 at the corners
  float distanceToCorner = length(vec2(aspect, 1.0) * 0.5);
  float radial = length(p) / distanceToCorner;
  vec3 color = mix(u_colorCentre, u_colorEdge, radial);

  // Slow waves, faded out towards the corners
  float t = u_time * 0.15;
  float wave = sin(p.x * 3.0 + t * 2.0)
             + sin(p.y * 4.0 - t * 1.5)
             + sin((p.x + p.y) * 2.5 + t);
  wave = wave / 3.0 * 0.5 + 0.5; // remap from -1..1 to 0..1

  color = mix(color, u_colorAccent, wave * 0.12 * (1.0 - radial));

  outColor = vec4(color, 1.0);
}
