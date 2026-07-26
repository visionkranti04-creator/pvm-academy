// Shared fullscreen lightbox for photos/videos/YouTube embeds.
// gallery.js and stage-gallery.js call initLightbox(data) after they
// render the grid, passing the same array of rows they fetched — this
// gives Next/Prev navigation across every item currently on the page.

let lightboxItems = [];
let lightboxIndex = 0;

function initLightbox(items) {
  lightboxItems = items || [];
  const overlay = document.getElementById("lightbox-overlay");
  if (!overlay) return;

  document.querySelectorAll("#gallery-grid .g-item").forEach((el, i) => {
    el.addEventListener("click", (e) => {
      // Don't hijack clicks on native video controls / YouTube iframe itself
      if (e.target.tagName === "VIDEO" || e.target.tagName === "IFRAME") return;
      openLightbox(i);
    });
  });
}

function openLightbox(index) {
  lightboxIndex = index;
  renderLightbox();
  document.getElementById("lightbox-overlay").classList.add("show");
}

function closeLightbox() {
  document.getElementById("lightbox-overlay").classList.remove("show");
  document.getElementById("lightbox-content").innerHTML = "";
}

function renderLightbox() {
  const item = lightboxItems[lightboxIndex];
  if (!item) return;
  const content = document.getElementById("lightbox-content");
  content.innerHTML = lightboxMediaHtml(item.image_url);
  document.getElementById("lightbox-caption").textContent = item.caption || "";
}

function getYouTubeIdLB(url) {
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

function lightboxMediaHtml(url) {
  const ytId = getYouTubeIdLB(url);
  if (ytId) {
    return `<iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  } else if (url && url.match(/\.mp4($|\?)/i)) {
    return `<video src="${url}" controls autoplay></video>`;
  } else {
    return `<img src="${url}" alt="" />`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("lightbox-overlay");
  if (!overlay) return;

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev").addEventListener("click", () => {
    lightboxIndex = (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
    renderLightbox();
  });
  document.getElementById("lightbox-next").addEventListener("click", () => {
    lightboxIndex = (lightboxIndex + 1) % lightboxItems.length;
    renderLightbox();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("show")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") document.getElementById("lightbox-prev").click();
    if (e.key === "ArrowRight") document.getElementById("lightbox-next").click();
  });
});