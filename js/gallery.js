// Pulls rows from the `gallery_images` table and renders them into the grid.
// Handles three media types automatically based on the saved URL:
// - YouTube links -> embedded iframe player
// - .mp4 links -> native video player
// - anything else -> image
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

    const itemsHtml = data
      .map(
        (item) => `
        <div class="g-item reveal in" title="${escapeHtml(item.caption || "")}">
          ${mediaHtml(item.image_url, item.caption)}
        </div>`
      )
      .join("");

    if (grid.classList.contains("gallery-grid-full")) {
      grid.innerHTML = `<div class="gallery-marquee-track">${itemsHtml}</div>`;
    } else if (data.length >= 4) {
      grid.innerHTML = `<div class="gallery-marquee-track">${itemsHtml}${itemsHtml}</div>`;
    } else {
      grid.innerHTML = `<div class="gallery-marquee-track" style="animation:none;">${itemsHtml}</div>`;
    }

    if (typeof initLightbox === "function") initLightbox(data);
  } catch (err) {
    console.error(err);
    empty.textContent = "Gallery is warming up — please refresh in a moment.";
    empty.style.display = "block";
  }
});

function getYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function mediaHtml(url, caption) {
  const ytId = getYouTubeId(url);
  if (ytId) {
    return `<iframe src="https://www.youtube.com/embed/${ytId}" style="width:100%;height:100%;border:0;" allowfullscreen loading="lazy"></iframe>`;
  } else if (url && url.match(/\.mp4($|\?)/i)) {
    return `<video src="${url}" style="width:100%;height:100%;object-fit:cover;" muted loop playsinline controls preload="none"></video>`;
  } else {
    return `<img src="${url}" alt="${escapeHtml(caption || "Academy photo")}" loading="lazy" />`;
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}