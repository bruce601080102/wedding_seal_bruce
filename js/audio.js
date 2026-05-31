function initAudioToggle() {
  const bgm = document.getElementById("bgm");
  const toggle = document.getElementById("music-toggle");
  if (!toggle) return;

  function setIcon(isPlaying) {
    toggle.textContent = isPlaying ? "⏸" : "♫";
    toggle.setAttribute("aria-pressed", String(isPlaying));
  }

  setIcon(false);

  toggle.addEventListener("click", () => {
    if (!bgm) return;
    bgm.paused ? bgm.play() : bgm.pause();
    setIcon(!bgm.paused);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAudioToggle);
} else {
  initAudioToggle();
}
