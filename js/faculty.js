// Pulls faculty members from Supabase and renders them as clickable cards
// linking to faculty-profile.html?id=<row id> for full bio details.

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("faculty-grid");
  const empty = document.getElementById("faculty-empty");
  if (!grid) return;

  try {
    const { data, error } = await supabaseClient
      .from("faculty_members")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    if (!data || data.length === 0) {
      empty.style.display = "block";
      return;
    }

    grid.innerHTML = data
      .map(
        (row) => `
        <a href="faculty-profile.html?id=${row.id}" class="card reveal in">
          <div class="thumb"><img src="${row.photo_url || 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=500&q=80'}" alt="${escapeHtml(row.name)}" loading="lazy" /></div>
          <div class="body">
            <span class="tag">${escapeHtml(row.role)}</span>
            <h3>${escapeHtml(row.name)}</h3>
            <p>${escapeHtml((row.bio || "").slice(0, 90))}${row.bio && row.bio.length > 90 ? "…" : ""}</p>
          </div>
        </a>`
      )
      .join("");
  } catch (err) {
    console.error(err);
    empty.textContent = "Faculty list is warming up — please refresh in a moment.";
    empty.style.display = "block";
  }
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}