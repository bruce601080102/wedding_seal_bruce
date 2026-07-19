function initGallery() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");
  const viewport = document.querySelector(".carousel-viewport");
  const prev = document.querySelector(".carousel-nav.prev");
  const next = document.querySelector(".carousel-nav.next");
  const track = document.querySelector(".carousel-track");

  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = "照片";
    lightbox.hidden = false;
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    if (lightboxImg) lightboxImg.src = "";
  }

  function hydrateSlide(btn, src, index) {
    btn.setAttribute("data-src", src);
    btn.setAttribute("aria-label", `查看照片 ${index}`);

    const img = document.createElement("img");
    img.src = src;
    img.alt = `照片 ${index}`;
    img.loading = index <= 3 ? "eager" : "lazy";
    img.decoding = "async";

    img.addEventListener("error", () => {
      btn.remove();
    }, { once: true });

    btn.appendChild(img);
  }

  // Auto-generate carousel slides based on sequential filenames.
  // Static hosting cannot list folders, so we scan up to data-gallery-max and
  // remove missing images as they fail to load.
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

  // Set images for both legacy grid and carousel slides.
  document.querySelectorAll(".gallery-item, .carousel-slide").forEach((btn) => {
    const src = btn.getAttribute("data-src");
    if (src && !btn.querySelector("img")) {
      btn.style.backgroundImage = `url("${src}")`;
    }

    btn.addEventListener("click", () => {
      if (!src) return;
      openLightbox(src);
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
