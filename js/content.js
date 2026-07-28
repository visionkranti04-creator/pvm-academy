// Loads editable text/image content from Supabase `content_blocks` table
// and applies it to any element with a matching data-key attribute.
// Also hides the page briefly and fades it in once real content is
// loaded, so visitors never see the placeholder defaults flash by.

document.addEventListener("DOMContentLoaded", async () => {
  // Safety net: reveal the page after 2.5s no matter what, in case
  // something goes wrong with the fetch — better a late flash than a
  // permanently blank page.
  const safetyTimer = setTimeout(() => document.body.classList.add("loaded"), 2500);

  const targets = document.querySelectorAll("[data-key]");
  if (!targets.length) {
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
      if (!(key in map) || !map[key]) return; // keep placeholder text/image until admin sets one

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
  } catch (err) {
    console.error("Content load failed:", err);
  } finally {
    clearTimeout(safetyTimer);
    document.body.classList.add("loaded");
    document.dispatchEvent(new Event("content-ready"));
  }
});