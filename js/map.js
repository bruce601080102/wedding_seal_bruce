(() => {
  const mapSection = document.querySelector("section.map");
  if (!mapSection) return;

  const iframe = mapSection.querySelector("iframe");
  const link = mapSection.querySelector(".map-open");

  // When opened from file://, many browsers treat the page as a unique origin and
  // block third-party iframes (like Google Maps embeds). Fallback to a button link.
  const isFile = window.location && window.location.protocol === "file:";
  if (!isFile) return;

  if (iframe) iframe.hidden = true;
  if (link) link.hidden = false;
})();

