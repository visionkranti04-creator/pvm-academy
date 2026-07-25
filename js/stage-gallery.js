// Same as gallery.js, but filters photos to only the category matching
// this page — set via <body data-gallery-category="Early Years">.
// Staff set that same category when uploading a photo in admin.html.

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("gallery-grid");
  const empty = document.getElementById("gallery-empty");
  if (!grid) return;

  const category = document.body.dataset.galleryCategory;

  try {
    let query = supabaseClient.from("gallery_images").select("*").order("sort_order", { ascending: true });
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error) throw error;

    if (!data || data.length === 0) {
      empty.style.display = "block";
      return;
    }

    grid.innerHTML = data
      .map(
        (item) => `
        <div class="g-item reveal in" title="${escapeHtml(item.caption || "")}">
          <img src="${item.image_url}" alt="${escapeHtml(item.caption || "Academy photo")}" loading="lazy" />
        </div>`
      )
      .join("");
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