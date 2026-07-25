const targets = Array.from(document.querySelectorAll(".fold, .album-page"));

let lastY = window.scrollY;
let dir = 1; // 1 = down, -1 = up
let scheduled = false;

function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    for (const el of targets) updateFold(el);
  });
}

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  dir = y >= lastY ? 1 : -1;
  lastY = y;
  schedule();
}, { passive: true });

window.addEventListener("resize", schedule, { passive: true });

function clearInline(el) {
  // We previously used inline transforms for "continuous" mode. Clear them so CSS animation works.
  el.style.opacity = "";
  el.style.transform = "";
  el.style.transformOrigin = "";
}

function updateFold(el) {
  const vh = window.innerHeight || 1;
  const r = el.getBoundingClientRect();
  const isFold = el.classList.contains("fold");

  // Trigger point: a bit below the top so it feels like "page turning"
  const enterLine = vh * 0.72;
  const bottomLine = vh * 0.92;

  const shouldShow = r.top < enterLine && r.bottom > vh * 0.12;
  if (shouldShow) {
    if (isFold) clearInline(el);
    el.classList.add("show");
    return;
  }

  // While returning to the top, avoid folding every section at once.
  // A simple reset prevents sections from visually bunching together.
  if (dir < 0 && r.top >= bottomLine) {
    if (isFold) clearInline(el);
    el.classList.remove("show");
    return;
  }

  if (isFold) clearInline(el);
  el.classList.remove("show");
}

schedule();
