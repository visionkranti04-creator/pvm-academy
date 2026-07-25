// Minimal admin panel: Supabase email/password auth + CRUD for
// gallery_images and news_posts. Only staff you create in Supabase
// Auth (Dashboard → Authentication → Users) can log in here.

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

// ---------- Gallery CRUD ----------
const galleryForm = document.getElementById("gallery-form");
galleryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(galleryForm);
  const { error } = await supabaseClient.from("gallery_images").insert([
    {
      image_url: fd.get("image_url"),
      caption: fd.get("caption"),
      category: fd.get("category"),
      sort_order: Number(fd.get("sort_order")) || 0,
    },
  ]);
  if (!error) {
    galleryForm.reset();
    loadGalleryList();
  } else {
    alert("Could not add image: " + error.message);
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
        <img src="${row.image_url}" alt="" />
        <span>${row.caption || "(no caption)"}</span>
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

function attachDeleteHandlers() {
  document.querySelectorAll(".admin-delete").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this item?")) return;
      const { error } = await supabaseClient
        .from(btn.dataset.target)
        .delete()
        .eq("id", btn.dataset.id);
      if (error) return alert(error.message);
      btn.dataset.target === "gallery_images" ? loadGalleryList() : loadNewsList();
    });
  });
}

refreshSession();