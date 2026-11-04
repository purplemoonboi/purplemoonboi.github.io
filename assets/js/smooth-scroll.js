// Smooth section-to-section scrolling for the mouse wheel and trackpad on desktop.
// The browser's own snap animation can't be tuned with CSS, so each wheel
// gesture glides to the next section here instead. Touch screens, the keyboard
// and reduced-motion users keep the native CSS scroll snapping.
const main = document.querySelector("main");
const sections = [...main.querySelectorAll("section")];

const desktopQuery = window.matchMedia("(min-width: 901px) and (pointer: fine)");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const DURATION_MS = 650; // length of one section-to-section glide
const GESTURE_GAP_MS = 180; // a quiet gap this long starts a new wheel gesture
const MIN_DELTA = 4; // ignore tiny accidental wheel movements

let animation = null; // { from, to, direction, start }
let lastWheelTime = 0;

// Starts fast so it responds straight away, then settles gently
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Scroll position of a section's top edge within <main>
function sectionTop(section) {
  return main.scrollTop + section.getBoundingClientRect().top - main.getBoundingClientRect().top;
}

// Index of the section at the top of the view
function currentSectionIndex(scrollTop) {
  let index = 0;
  sections.forEach((section, i) => {
    if (sectionTop(section) <= scrollTop + 1) {
      index = i;
    }
  });
  return index;
}

function step(now) {
  const progress = Math.min((now - animation.start) / DURATION_MS, 1);
  const top = animation.from + (animation.to - animation.from) * easeOutCubic(progress);
  main.scrollTo({ top, behavior: "instant" });

  if (progress < 1) {
    requestAnimationFrame(step);
  } else {
    animation = null;
    main.style.scrollSnapType = ""; // hand back to CSS snapping
  }
}

function glideTo(top, direction) {
  const isRunning = animation !== null;
  main.style.scrollSnapType = "none"; // stop native snapping fighting the glide
  animation = { from: main.scrollTop, to: top, direction, start: performance.now() };
  if (!isRunning) {
    requestAnimationFrame(step);
  }
}

main.addEventListener(
  "wheel",
  (event) => {
    if (!desktopQuery.matches || reducedMotionQuery.matches) return;
    if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return; // zooming or sideways

    const now = performance.now();
    const isNewGesture = now - lastWheelTime > GESTURE_GAP_MS;
    lastWheelTime = now;

    const direction = Math.sign(event.deltaY);

    if (animation) {
      event.preventDefault();
      // Reverse straight away, or carry on to the next section on a fresh flick
      const reversing = direction !== animation.direction;
      if ((reversing || isNewGesture) && Math.abs(event.deltaY) >= MIN_DELTA) {
        const index = currentSectionIndex(animation.to) + direction;
        if (index >= 0 && index < sections.length) {
          glideTo(sectionTop(sections[index]), direction);
        }
      }
      return;
    }

    const viewTop = main.scrollTop;
    const viewBottom = viewTop + main.clientHeight;
    const index = currentSectionIndex(viewTop);
    const section = sections[index];

    // A section taller than the screen scrolls normally until its edge is reached
    const top = sectionTop(section);
    const hasMoreBelow = direction > 0 && top + section.offsetHeight > viewBottom + 1;
    const hasMoreAbove = direction < 0 && viewTop > top + 1;
    if (hasMoreBelow || hasMoreAbove) return;

    const target = sections[index + direction];
    if (!target) return;

    event.preventDefault();

    // One gesture moves one section: ignore the rest of it (e.g. trackpad momentum)
    if (!isNewGesture || Math.abs(event.deltaY) < MIN_DELTA) return;

    glideTo(sectionTop(target), direction);
  },
  { passive: false },
);
