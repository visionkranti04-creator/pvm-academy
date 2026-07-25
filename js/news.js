// Pulls rows from `news_posts` table.
// Columns expected: id, title, summary, cover_image_url, category, published_at

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("news-grid");
  const empty = document.getElementById("news-empty");
  if (!grid) return;

  try {
    const { data, error } = await supabaseClient
      .from("news_posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      empty.style.display = "block";
      return;
    }

    grid.innerHTML = data
      .map(
        (post) => `
        <article class="card reveal in">
          <div class="thumb">
            <img src="${post.cover_image_url || "https://placehold.co/600x450/151E81/D9762E?text=PVM"}" alt="" loading="lazy" />
          </div>
          <div class="body">
            <span class="tag">${escapeHtml(post.category || "Announcement")}</span>
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.summary || "")}</p>
            <p style="font-family: var(--font-mono); font-size: 12px; color: var(--ink-soft); margin-top: 14px;">
              ${post.published_at ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
            </p>
          </div>
        </article>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    empty.textContent = "News feed is warming up — please refresh in a moment.";
    empty.style.display = "block";
  }
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}