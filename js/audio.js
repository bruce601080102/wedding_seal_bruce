function initAudioToggle() {
  const bgm = document.getElementById("bgm");
  const toggle = document.getElementById("music-toggle");
  if (!toggle || !bgm) return;

  function setIcon(isPlaying) {
    toggle.textContent = isPlaying ? "♪" : "♫";
    toggle.classList.toggle("is-playing", isPlaying);
    toggle.setAttribute("aria-pressed", String(isPlaying));
    toggle.setAttribute("title", isPlaying ? "暫停音樂" : "播放音樂");
  }

  async function playMusic() {
    try {
      await bgm.play();
      setIcon(true);
    } catch (error) {
      setIcon(false);
    }
  }

  function pauseMusic() {
    bgm.pause();
    setIcon(false);
  }

  window.startWeddingMusic = playMusic;
  window.pauseWeddingMusic = pauseMusic;

  bgm.addEventListener("play", () => setIcon(true));
  bgm.addEventListener("pause", () => setIcon(false));
  bgm.addEventListener("ended", () => setIcon(false));

  toggle.addEventListener("click", () => {
    if (bgm.paused) {
      playMusic();
      return;
    }

    pauseMusic();
  });

  setIcon(false);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAudioToggle);
} else {
  initAudioToggle();
}
