// Minimal admin panel: Supabase email/password auth + CRUD for
// gallery_images, news_posts, and faculty_members. Only staff you
// create in Supabase Auth (Dashboard → Authentication → Users) can
// log in here.

const loginPanel = document.getElementById("login-panel");
const adminPanel = document.getElementById("admin-panel");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");
const whoami = document.getElementById("whoami");

async function refreshSession() {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    loginPanel.style.display = "none";
    adminPanel.style.display = "block";
    whoami.textContent = data.session.user.email;
    loadGalleryList();
    loadNewsList();
    loadFacultyList();
  } else {
    loginPanel.style.display = "block";
    adminPanel.style.display = "none";
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.style.display = "none";
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    loginError.textContent = "Sign-in failed — check the email and password.";
    loginError.style.display = "block";
    return;
  }
  refreshSession();
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  refreshSession();
});

// ---------- Gallery: helpers for YouTube detection ----------
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

function mediaEmbedHtml(url, style) {
  const ytId = getYouTubeId(url);
  if (ytId) {
    return `<iframe src="https://www.youtube.com/embed/${ytId}" style="${style}" frameborder="0" allowfullscreen></iframe>`;
  } else if (url && url.match(/\.mp4($|\?)/i)) {
    return `<video src="${url}" style="${style}" muted controls></video>`;
  } else {
    return `<img src="${url}" style="${style}" alt="" />`;
  }
}

// ---------- Gallery: live YouTube preview while typing ----------
const youtubeInput = document.getElementById("gallery-youtube-input");
const youtubePreview = document.getElementById("youtube-preview");
if (youtubeInput) {
  youtubeInput.addEventListener("input", () => {
    const id = getYouTubeId(youtubeInput.value);
    youtubePreview.innerHTML = id
      ? `<iframe width="280" height="158" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`
      : "";
  });
}

// ---------- Gallery CRUD ----------
const galleryForm = document.getElementById("gallery-form");
galleryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(galleryForm);
  const fileInput = document.getElementById("gallery-file-input");
  const youtubeUrl = document.getElementById("gallery-youtube-input").value.trim();

  let finalUrl = "";

  try {
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const path = `gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error: uploadError } = await supabaseClient.storage.from("media").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabaseClient.storage.from("media").getPublicUrl(path);
      finalUrl = publicUrlData.publicUrl;
    } else if (youtubeUrl) {
      finalUrl = youtubeUrl;
    } else {
      alert("Please upload a photo/video, or paste a YouTube link.");
      return;
    }

    const { error } = await supabaseClient.from("gallery_images").insert([
      {
        image_url: finalUrl,
        caption: fd.get("caption"),
        category: fd.get("category"),
        sort_order: Number(fd.get("sort_order")) || 0,
      },
    ]);
    if (error) throw error;

    galleryForm.reset();
    youtubePreview.innerHTML = "";
    loadGalleryList();
  } catch (err) {
    alert("Could not add media: " + err.message);
  }
});

async function loadGalleryList() {
  const list = document.getElementById("gallery-list");
  const { data, error } = await supabaseClient
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    list.innerHTML = `<p>Couldn't load gallery: ${error.message}</p>`;
    return;
  }
  list.innerHTML = data
    .map(
      (row) => `
      <div class="admin-row">
        ${mediaEmbedHtml(row.image_url, "width:60px; height:46px; object-fit:cover; border-radius:2px;")}
        <span>${row.caption || "(no caption)"} ${row.category ? `— <em>${row.category}</em>` : ""}</span>
        <button data-id="${row.id}" class="admin-delete" data-target="gallery_images">Delete</button>
      </div>`
    )
    .join("");
  attachDeleteHandlers();
}

// ---------- News CRUD ----------
const newsForm = document.getElementById("news-form");
newsForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(newsForm);
  const { error } = await supabaseClient.from("news_posts").insert([
    {
      title: fd.get("title"),
      summary: fd.get("summary"),
      cover_image_url: fd.get("cover_image_url"),
      category: fd.get("category"),
      published_at: new Date().toISOString(),
    },
  ]);
  if (!error) {
    newsForm.reset();
    loadNewsList();
  } else {
    alert("Could not add post: " + error.message);
  }
});

async function loadNewsList() {
  const list = document.getElementById("news-list");
  const { data, error } = await supabaseClient
    .from("news_posts")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) {
    list.innerHTML = `<p>Couldn't load news: ${error.message}</p>`;
    return;
  }
  list.innerHTML = data
    .map(
      (row) => `
      <div class="admin-row">
        <span><strong>${row.title}</strong> — ${row.category || ""}</span>
        <button data-id="${row.id}" class="admin-delete" data-target="news_posts">Delete</button>
      </div>`
    )
    .join("");
  attachDeleteHandlers();
}

// ---------- Faculty CRUD ----------
const facultyForm = document.getElementById("faculty-form");
if (facultyForm) {
  facultyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(facultyForm);
    const fileInput = document.getElementById("faculty-file-input");
    let photoUrl = "";

    try {
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const path = `faculty/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const { error: uploadError } = await supabaseClient.storage.from("media").upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabaseClient.storage.from("media").getPublicUrl(path);
        photoUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabaseClient.from("faculty_members").insert([
        {
          name: fd.get("name"),
          role: fd.get("role"),
          category: fd.get("category"),
          bio: fd.get("bio"),
          photo_url: photoUrl,
          sort_order: Number(fd.get("sort_order")) || 0,
        },
      ]);
      if (error) throw error;

      facultyForm.reset();
      loadFacultyList();
    } catch (err) {
      alert("Could not add faculty member: " + err.message);
    }
  });
}

async function loadFacultyList() {
  const list = document.getElementById("faculty-list");
  if (!list) return;
  const { data, error } = await supabaseClient
    .from("faculty_members")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    list.innerHTML = `<p>Couldn't load faculty: ${error.message}</p>`;
    return;
  }
  list.innerHTML = data
    .map(
      (row) => `
      <div class="admin-row">
        <img src="${row.photo_url || 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=100&q=80'}" alt="" />
        <span>${row.name} — <em>${row.role}</em></span>
        <button data-id="${row.id}" class="admin-delete" data-target="faculty_members">Delete</button>
      </div>`
    )
    .join("");
  attachDeleteHandlers();
}

function attachDeleteHandlers() {
  document.querySelectorAll(".admin-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this item?")) return;
      const { error } = await supabaseClient
        .from(btn.dataset.target)
        .delete()
        .eq("id", btn.dataset.id);
      if (error) return alert(error.message);
      if (btn.dataset.target === "gallery_images") loadGalleryList();
      else if (btn.dataset.target === "faculty_members") loadFacultyList();
      else loadNewsList();
    });
  });
}

refreshSession();