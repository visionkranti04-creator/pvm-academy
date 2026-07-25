// Reads ?id=<uuid> from the URL and shows that one faculty member's
// full profile (photo, name, role, full bio).

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("faculty-profile");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    container.innerHTML = `<p>No faculty member specified. <a href="faculty.html">Back to Faculty</a></p>`;
    return;
  }

  try {
    const { data, error } = await supabaseClient
      .from("faculty_members")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) {
      container.innerHTML = `<p>Faculty member not found. <a href="faculty.html">Back to Faculty</a></p>`;
      return;
    }

    document.title = `${data.name} — PVM International Academy`;

    container.innerHTML = `
      <div class="grid grid-2" style="align-items:flex-start; gap:50px;">
        <div class="reveal in">
          <img src="${data.photo_url || 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=700&q=80'}" alt="${escapeHtml(data.name)}" style="border-radius:2px; aspect-ratio:1/1; object-fit:cover; width:100%;" />
        </div>
        <div class="reveal in">
          <span class="eyebrow">${escapeHtml(data.role)}</span>
          <h1 style="margin-top:14px; font-size:clamp(28px,4vw,40px);">${escapeHtml(data.name)}</h1>
          <div class="divider-gold"></div>
          <p style="color:var(--ink-soft); font-size:16.5px; white-space:pre-line;">${escapeHtml(data.bio || "No bio added yet.")}</p>
          <a href="faculty.html" class="btn btn-outline-navy" style="margin-top:24px;">← Back to Faculty</a>
        </div>
      </div>`;
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p>Couldn't load this profile. <a href="faculty.html">Back to Faculty</a></p>`;
  }
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}