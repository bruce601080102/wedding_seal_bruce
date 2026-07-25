function initGallery() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");
  const viewport = document.querySelector(".carousel-viewport");
  const prev = document.querySelector(".carousel-nav.prev");
  const next = document.querySelector(".carousel-nav.next");
  const track = document.querySelector(".carousel-track");
  const prefersMobileImages = window.matchMedia("(max-width: 768px)").matches;

  function mobileSrcFor(src) {
    return src.replace(/(\.[^.]+)$/, "_mobile.jpg");
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
    const previewSrc = prefersMobileImages ? mobileSrcFor(src) : src;

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

  function probeImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }

  async function hydrateGeneratedGallery(max) {
    let misses = 0;
    const stopAfterMisses = 10;

    for (let i = 1; i <= max && misses < stopAfterMisses; i++) {
      const n = String(i).padStart(3, "0");
      const src = `assets/images/gallery_photo_${n}.jpg`;
      const previewSrc = prefersMobileImages ? mobileSrcFor(src) : src;
      const exists = await probeImage(previewSrc) || await probeImage(src);

      if (!exists) {
        misses += 1;
        continue;
      }

      misses = 0;
      const btn = document.createElement("button");
      btn.className = "carousel-slide";
      btn.type = "button";
      hydrateSlide(btn, src, i);
      bindSlide(btn);
      track.appendChild(btn);
    }
  }

  // Static hosting cannot list folders, so scan sequential filenames and
  // stop after several misses instead of requesting every possible image.
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
    viewport.scrollBy({ left: dir * (w + 14), behavior: "smooth" });
  }

  if (prev) prev.addEventListener("click", () => step(-1));
  if (next) next.addEventListener("click", () => step(1));

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
