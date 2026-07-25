// Pulls rows from the `gallery_images` table and renders them into the grid.
// Table columns expected: id, image_url, caption, category, sort_order, created_at

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("gallery-grid");
  const empty = document.getElementById("gallery-empty");
  if (!grid) return;

  try {
    const { data, error } = await supabaseClient
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      empty.style.display = "block";
      return;
    }

    grid.innerHTML = data
      .map(
        (item) => `
        <div class="g-item reveal" title="${escapeHtml(item.caption || "")}">
          <img src="${item.image_url}" alt="${escapeHtml(item.caption || "Academy photo")}" loading="lazy" />
        </div>`
      )
      .join("");

    // Re-trigger reveal animation for newly injected nodes
    grid.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
  } catch (err) {
    console.error(err);
    empty.textContent = "Gallery is warming up — please refresh in a moment.";
    empty.style.display = "block";
  }
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}