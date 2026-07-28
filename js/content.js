// Loads editable text/image content from Supabase `content_blocks` table
// and applies it to any element with a matching data-key attribute.
// Example: <span data-key="about_founder_name">[Founder's Name]</span>
// Example: <img data-key="about_founder_photo" src="...">
// Example (video): <video data-key="home_hero_video"><source src="..."></video>
// Example (animated stat): <span class="num" data-key="home_stat_years" data-count="15">0</span>
// Example (phone link): <a href="tel:+919999999999" data-key="site_phone">+91 99999 99999</a>

document.addEventListener("DOMContentLoaded", async () => {
  const targets = document.querySelectorAll("[data-key]");
  if (!targets.length) {
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
        // Phone links: update both the visible text AND the actual dial number
        el.textContent = map[key];
        el.href = "tel:" + map[key].replace(/[^0-9+]/g, "");
      } else if (el.tagName === "A" && (el.getAttribute("href") || "").startsWith("mailto:")) {
        // Email links: update both the visible text AND the actual mailto address
        el.textContent = map[key];
        el.href = "mailto:" + map[key];
      } else {
        el.textContent = map[key];
      }
    });
  } catch (err) {
    console.error("Content load failed:", err);
  } finally {
    // Tell main.js it's now safe to animate stat counters with the
    // real (possibly Supabase-updated) numbers, not the HTML defaults.
    document.dispatchEvent(new Event("content-ready"));
  }
});