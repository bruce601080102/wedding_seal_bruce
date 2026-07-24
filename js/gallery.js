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

  // Static hosting cannot list folders, so scan sequential filenames and
  // remove slides whose image file does not exist.
  if (track) {
    const maxAttr = track.getAttribute("data-gallery-max");
    const max = Math.max(0, Math.min(999, Number(maxAttr || 0) || 0));

    if (max > 0 && track.children.length === 0) {
      for (let i = 1; i <= max; i++) {
        const n = String(i).padStart(3, "0");
        const src = `assets/images/gallery_photo_${n}.jpg`;
        const btn = document.createElement("button");
        btn.className = "carousel-slide";
        btn.type = "button";
        hydrateSlide(btn, src, i);
        track.appendChild(btn);
      }
    }
  }

  document.querySelectorAll(".gallery-item, .carousel-slide").forEach((btn) => {
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
