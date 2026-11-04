# Rhys Duff — Portfolio Website

Personal portfolio showcasing work from university, jobs and personal projects.
Hosted on GitHub Pages from the `master` branch: https://purplemoonboi.github.io/
The look should be professional and modern, and the site must work well on mobile.

## Working guidelines
- Tell me when you finish a task, including bug fixes, with a short summary.
- Never push without telling me first.
- Don't download or add external web frameworks, libraries or build tools.
- Keep code consistent, clean and readable, and keep solutions simple.
- Change only what the task needs.

## Tech
- Vanilla HTML5, CSS3 and modern JavaScript (ES6 modules). No build step.
- Font Awesome icons load from a CDN link in each page. Everything else is local.
- The Inter font is self-hosted in `assets/fonts/inter/` (keep `OFL.txt` with it).

## Previewing locally
Opening `index.html` straight from disk does not work fully: the project data
(JSON) and the WebGL shaders are loaded with `fetch`, which browsers block for
`file://` pages. Use a local server from the repository root instead, e.g.
`python -m http.server 8000` (then open http://localhost:8000), or VS Code's
Live Server extension.

Check changes at desktop, tablet and mobile widths.

## Structure
- `index.html`: home page. Its sections (Home, Projects, Experience, Contact)
  are full-screen and snap when scrolling.
- `project.html`: one project's page, chosen by `?id=<project id>`.
- `data/projects.json`: all projects. `"featured": true` lists a project on the
  home page. A section shows only once it has a title, media and description.
- `data/certifications.json`: employment (`type` 0) and education (`type` 1).
- `assets/css/`:
  - `variables.css`: colours, type scale, spacing, breakpoints.
  - `reset.css`, `global.css`: base element styles.
  - `layout.css`: flex and grid utilities.
  - `sections.css`: section and list containers.
  - `components.css`: nav, cards, buttons, typewriter, etc.
- Breakpoints are desktop-first: laptop ≤ 1200px, tablet ≤ 900px,
  mobile ≤ 600px (matching `--bp-*` in `variables.css`).
- `assets/js/`:
  - `nav.js`: mobile menu.
  - `projects.js`: home page cards, fade-in and active nav link.
  - `smooth-scroll.js`: eased wheel/trackpad scrolling between home page
    sections on desktop (touch and keyboard keep CSS snapping).
  - `project-detail.js`: project page.
  - `helper.js`: JSON loading.
- WebGL2 background: `background.js` and `webgl.js`, plus `assets/shaders/`
  (`fullscreen.vert`, `background.frag`). It falls back to the CSS gradient
  if WebGL2 isn't available.
- `assets/images/`: file names are case-sensitive on GitHub Pages (many end in
  `.PNG`). Paths in `projects.json` must match exactly.
- `assets/downloads/rhys-duff-cv.pdf`: the CV behind the "Download CV" button.

## Git
- Files use Windows (CRLF) line endings. Keep them that way.
- Commits are signed with an SSH key.
- The `master` ruleset asks for pull requests. Direct pushes currently bypass it.

## Open items
- Fill in the three placeholder projects in `projects.json`
  (`algorithms-part-one`, `algorithms-part-two`, `professional-project`), then
  feature any that should appear on the home page.
- Networking (three sections) and AI (one section) have empty image paths.
- `tools-programming.PNG` is the thumbnail for two projects.
- The typewriter heading animates to a fixed `10ch`, which leaves a small gap
  after "Hi, I'm Rhys!".
- `--font-mono` names "JetBrains Mono", which isn't loaded (currently unused).
- The CV PDF runs to three pages and should be cut to two.
- Ideas: a real message form (needs a form service, as GitHub Pages can't send
  email), and more WebGL work (mouse or scroll effects, a live project demo).
