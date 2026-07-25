(() => {
  const section = document.querySelector(".google-form");
  if (!section) return;

  const rawUrl = (section.getAttribute("data-google-form-url") || "").trim();
  const shell = section.querySelector(".google-form-shell");
  const link = section.querySelector(".google-form-link");
  if (!rawUrl || !shell) return;

  const publicUrl = rawUrl
    .replace(/\/edit(\?[^#]*)?$/, "/viewform")
    .replace(/\/edit#.*$/, "/viewform");

  const embedUrl = rawUrl.includes("embedded=true")
    ? rawUrl
    : publicUrl.replace(/\/viewform(\?[^#]*)?/, "/viewform?embedded=true");

  shell.innerHTML = "";
  const iframe = document.createElement("iframe");
  iframe.src = embedUrl;
  iframe.title = "婚禮出席問卷";
  iframe.loading = "lazy";
  shell.appendChild(iframe);

  if (link) {
    link.href = publicUrl;
    link.hidden = false;
  }
})();
