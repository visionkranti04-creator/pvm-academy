document.addEventListener("DOMContentLoaded", async () => {
  const targets = document.querySelectorAll("[data-key]");
  if (!targets.length) return;

  try {
    const { data, error } = await supabaseClient.from("content_blocks").select("*");
    if (error) throw error;

    const map = {};
    (data || []).forEach((row) => {
      map[row.content_key] = row.content_value;
    });

    targets.forEach((el) => {
      const key = el.dataset.key;
      if (!(key in map) || !map[key]) return;

      if (el.tagName === "IMG") {
        el.src = map[key];
      } else if (el.tagName === "VIDEO") {
        const source = el.querySelector("source");
        if (source) {
          source.src = map[key];
          el.load();
        }
      } else if (el.hasAttribute("data-count")) {
        el.setAttribute("data-count", map[key]);
      } else {
        el.textContent = map[key];
      }
    });
  } catch (err) {
    console.error("Content load failed:", err);
  }
});