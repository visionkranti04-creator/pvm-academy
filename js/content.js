// Loads editable text/image content from Supabase `content_blocks` table
// and applies it to any element with a matching data-key attribute.
// Also handles data-link-key elements (updates just the href, leaving
// the icon/text inside untouched) — used for social media and document links.
// Also hides the page briefly and fades it in once real content is
// loaded, so visitors never see the placeholder defaults flash by.

document.addEventListener("DOMContentLoaded", async () => {
  const safetyTimer = setTimeout(() => document.body.classList.add("loaded"), 2500);

  const targets = document.querySelectorAll("[data-key]");
  const linkTargets = document.querySelectorAll("[data-link-key]");

  if (!targets.length && !linkTargets.length) {
    clearTimeout(safetyTimer);
    document.body.classList.add("loaded");
    document.dispatchEvent(new Event("content-ready"));
    return;
  }

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
      } else if (el.tagName === "A" && (el.getAttribute("href") || "").startsWith("tel:")) {
        el.textContent = map[key];
        el.href = "tel:" + map[key].replace(/[^0-9+]/g, "");
      } else if (el.tagName === "A" && (el.getAttribute("href") || "").startsWith("mailto:")) {
        el.textContent = map[key];
        el.href = "mailto:" + map[key];
      } else {
        el.textContent = map[key];
      }
    });

        linkTargets.forEach((el) => {
      const key = el.dataset.linkKey;
      if (key in map && map[key]) {
        el.href = map[key];
        el.classList.remove("doc-link-disabled");
      } else {
        el.removeAttribute("href");
        el.removeAttribute("download");
        el.classList.add("doc-link-disabled");
        el.setAttribute("aria-disabled", "true");
      }
    });
  } catch (err) {
    console.error("Content load failed:", err);
  } finally {
    clearTimeout(safetyTimer);
    document.body.classList.add("loaded");
    document.dispatchEvent(new Event("content-ready"));
  }
});