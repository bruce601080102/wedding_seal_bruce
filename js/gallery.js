function initGallery() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");
  const viewport = document.querySelector(".carousel-viewport");
  const prev = document.querySelector(".carousel-nav.prev");
  const next = document.querySelector(".carousel-nav.next");

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

  // Set cover images for both legacy grid and carousel slides.
  document.querySelectorAll(".gallery-item, .carousel-slide").forEach((btn) => {
    const src = btn.getAttribute("data-src");
    if (src) btn.style.backgroundImage = `url("${src}")`;

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
