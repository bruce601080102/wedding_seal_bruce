function initGallery() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");
  const viewport = document.querySelector(".carousel-viewport");
  const prev = document.querySelector(".carousel-nav.prev");
  const next = document.querySelector(".carousel-nav.next");
  const track = document.querySelector(".carousel-track");
  const progressBar = document.querySelector(".carousel-progress-bar");
  const progressCount = document.querySelector(".carousel-progress-count");
  let progressScheduled = false;

  function mobileSrcFor(src) {
    return src.replace(/(\.[^.]+)$/, "_mobile.jpg");
  }

  function previewSrcFor(src) {
    return mobileSrcFor(src);
  }

  function openLightbox(src, fallbackSrc) {
    if (!lightbox || !lightboxImg) return;

    lightboxImg.onerror = () => {
      if (fallbackSrc && !lightboxImg.src.endsWith(fallbackSrc)) {
        lightboxImg.src = fallbackSrc;
      }
    };
    lightboxImg.src = src;
    lightboxImg.alt = "婚紗照片";
    lightbox.hidden = false;
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    if (lightboxImg) {
      lightboxImg.onerror = null;
      lightboxImg.src = "";
    }
  }

  function hydrateSlide(btn, src, index) {
    const previewSrc = previewSrcFor(src);

    btn.setAttribute("data-src", src);
    btn.setAttribute("data-preview-src", previewSrc);
    btn.setAttribute("aria-label", `婚紗照片 ${index}`);

    const img = document.createElement("img");
    img.src = previewSrc;
    img.alt = `婚紗照片 ${index}`;
    img.loading = index <= 3 ? "eager" : "lazy";
    img.decoding = "async";

    let triedFullImage = previewSrc === src;
    img.addEventListener("error", () => {
      if (!triedFullImage) {
        triedFullImage = true;
        btn.setAttribute("data-preview-src", src);
        img.src = src;
        return;
      }

      btn.remove();
    });

    btn.appendChild(img);
  }

  function bindSlide(btn) {
    if (btn.dataset.bound === "true") return;
    btn.dataset.bound = "true";

    const src = btn.getAttribute("data-src");
    const previewSrc = btn.getAttribute("data-preview-src") || src;

    if (previewSrc && !btn.querySelector("img")) {
      btn.style.backgroundImage = `url("${previewSrc}")`;
    }

    btn.addEventListener("click", () => {
      const fullSrc = btn.getAttribute("data-src");
      const fallbackSrc = btn.getAttribute("data-preview-src");
      if (!fullSrc) return;
      openLightbox(fullSrc, fallbackSrc);
    });
  }

  function smoothScrollTo(left, duration = 620) {
    if (!viewport) return;

    const start = viewport.scrollLeft;
    const distance = left - start;
    if (Math.abs(distance) < 1) return;

    const startTime = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    function frame(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      viewport.scrollLeft = start + distance * ease(progress);
      updateProgress();
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function updateProgress() {
    if (!viewport || !progressBar) return;

    const maxScroll = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
    const ratio = Math.max(0, Math.min(1, viewport.scrollLeft / maxScroll));
    progressBar.style.width = `${Math.max(4, ratio * 100)}%`;

    if (progressCount) {
      const slides = Array.from(viewport.querySelectorAll(".carousel-slide"));
      if (!slides.length) {
        progressCount.textContent = "01";
        return;
      }

      const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
      let active = 0;
      let closest = Infinity;
      slides.forEach((slide, index) => {
        const center = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(center - viewportCenter);
        if (distance < closest) {
          closest = distance;
          active = index;
        }
      });
      progressCount.textContent = String(active + 1).padStart(2, "0");
    }
  }

  function scheduleProgress() {
    if (progressScheduled) return;
    progressScheduled = true;
    requestAnimationFrame(() => {
      progressScheduled = false;
      updateProgress();
    });
  }

  function initDragScroll() {
    if (!viewport) return;

    let isDown = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    viewport.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      isDown = true;
      moved = false;
      startX = event.clientX;
      startLeft = viewport.scrollLeft;
      viewport.classList.add("is-dragging");
      viewport.setPointerCapture?.(event.pointerId);
    });

    viewport.addEventListener("pointermove", (event) => {
      if (!isDown) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 4) moved = true;
      viewport.scrollLeft = startLeft - delta;
    });

    function endDrag(event) {
      if (!isDown) return;
      isDown = false;
      viewport.classList.remove("is-dragging");
      viewport.releasePointerCapture?.(event.pointerId);
      setTimeout(() => { moved = false; }, 40);
    }

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerleave", endDrag);

    viewport.addEventListener("click", (event) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);

    viewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      }
    });
  }

  function probeImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  async function hydrateGeneratedGallery(max) {
    for (let i = 1; i <= max; i++) {
      const n = String(i).padStart(3, "0");
      const src = `assets/images/gallery_photo_${n}.jpg`;
      const previewSrc = previewSrcFor(src);
      const exists = await probeImage(previewSrc) || await probeImage(src);

      if (!exists) {
        continue;
      }

      const btn = document.createElement("button");
      btn.className = "carousel-slide";
      btn.type = "button";
      hydrateSlide(btn, src, i);
      bindSlide(btn);
      track.appendChild(btn);
      updateProgress();
    }
  }

  // Static hosting cannot list folders, so scan sequential filenames.
  // Keep scanning through gaps because GitHub Pages is case-sensitive and
  // one missing filename should not hide later photos.
  if (track) {
    const maxAttr = track.getAttribute("data-gallery-max");
    const max = Math.max(0, Math.min(999, Number(maxAttr || 0) || 0));

    if (max > 0 && track.children.length === 0) {
      hydrateGeneratedGallery(max);
    }
  }

  document.querySelectorAll(".gallery-item, .carousel-slide").forEach((btn) => {
    bindSlide(btn);
  });

  function step(dir) {
    if (!viewport) return;
    const first = viewport.querySelector(".carousel-slide");
    const w = first ? first.getBoundingClientRect().width : viewport.clientWidth * 0.9;
    smoothScrollTo(viewport.scrollLeft + dir * (w + 14));
  }

  if (prev) prev.addEventListener("click", () => step(-1));
  if (next) next.addEventListener("click", () => step(1));
  if (viewport) {
    viewport.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress, { passive: true });
  }
  initDragScroll();
  updateProgress();

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGallery);
} else {
  initGallery();
}
