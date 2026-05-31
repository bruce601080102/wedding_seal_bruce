const form = document.getElementById("rsvp-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const count = String(fd.get("count") || "1").trim();
    const note = String(fd.get("note") || "").trim();

    const subject = `婚禮出席回覆 - ${name || "未填姓名"}`;
    const lines = [
      "嗨，我想回覆婚禮出席資訊：",
      "",
      `姓名：${name || "-"}`,
      `人數：${count || "-"}`,
      `備註：${note || "-"}`,
      "",
      "謝謝！",
    ];

    // TODO: Replace with your real RSVP email.
    const to = "bruce@example.com";
    const url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = url;
  });
}

