const target = new Date("2026-11-01T00:00:00");

function pad2(n) {
  return String(n).padStart(2, "0");
}

function updateCountdown() {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");

  // If the section isn't on the page (or DOM not ready), do nothing.
  if (!daysEl || !hoursEl || !minutesEl) return;

  const now = new Date();
  const diff = target - now;
  const safe = Math.max(0, diff);

  const days = Math.floor(safe / (1000 * 60 * 60 * 24));
  const hours = Math.floor((safe / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((safe / (1000 * 60)) % 60);

  daysEl.textContent = String(days);
  hoursEl.textContent = pad2(hours);
  minutesEl.textContent = pad2(minutes);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    updateCountdown();
    setInterval(updateCountdown, 60000);
  });
} else {
  updateCountdown();
  setInterval(updateCountdown, 60000);
}
