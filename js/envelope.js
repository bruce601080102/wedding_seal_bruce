const envelope = document.getElementById("envelope");
const envelopePage = document.getElementById("envelope-page");
const contentPage = document.getElementById("content-page");
const seal = document.querySelector("#envelope .seal");

function openInvitation() {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");
  document.documentElement.classList.add("opening");
  if (typeof window.startWeddingMusic === "function") {
    window.startWeddingMusic();
  }

  // 信封動畫跑完
  setTimeout(() => {
    envelopePage.style.display = "none";

    // 關鍵：解除 hidden
    contentPage.removeAttribute("hidden");

    // 觸發「首頁進場」主題與動畫
    document.documentElement.classList.remove("opening");
    document.documentElement.classList.add("entered");

    // 解鎖頁面滾動
    document.body.classList.remove("locked");
  }, 1200);
}

if (seal) {
  seal.addEventListener("click", (e) => {
    e.stopPropagation();
    openInvitation();
  });
}

envelope.addEventListener("click", openInvitation);
