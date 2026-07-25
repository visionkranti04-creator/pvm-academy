// Renders a form from CONTENT_FIELDS as a collapsible accordion (one
// section per page/group), with a jump-to dropdown at the top so long
// lists are easy to navigate. Individual Save + Clear buttons per field.
// Image/video fields support direct file upload to Supabase Storage.

async function initContentEditor() {
  const container = document.getElementById("content-editor");
  if (!container) return;

  let existing = {};
  try {
    const { data, error } = await supabaseClient.from("content_blocks").select("*");
    if (error) throw error;
    (data || []).forEach((row) => (existing[row.content_key] = row.content_value));
  } catch (err) {
    console.error("Could not load existing content:", err);
  }

  const groups = {};
  CONTENT_FIELDS.forEach((field) => {
    if (!groups[field.group]) groups[field.group] = [];
    groups[field.group].push(field);
  });
  const groupNames = Object.keys(groups);

  // Jump-to dropdown
  const jumpBar = `
    <div class="admin-card" style="padding:20px 30px;">
      <label style="display:block; font-family:var(--font-mono); font-size:11.5px; letter-spacing:.06em; text-transform:uppercase; color:var(--ink-soft); margin-bottom:8px;">Jump to section</label>
      <select id="section-jump" style="width:100%; padding:12px 14px; border:1px solid var(--line); border-radius:2px; font-family:var(--font-body); font-size:14.5px; background:var(--parchment); color:var(--ink);">
        <option value="">— Select a section —</option>
        ${groupNames.map((g) => `<option value="${cssId(g)}">${g}</option>`).join("")}
      </select>
    </div>`;

  const accordion = groupNames
    .map(
      (groupName, i) => `
      <div class="admin-card accordion-section" id="${cssId(groupName)}" style="padding:0; overflow:hidden;">
        <button class="accordion-header" data-index="${i}" style="width:100%; text-align:left; background:var(--parchment-dim); border:none; padding:20px 30px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; font-family:var(--font-display); font-size:18px; color:var(--navy);">
          <span>${groupName}</span>
          <span class="accordion-arrow" style="font-family:var(--font-mono); font-size:14px;">▸</span>
        </button>
        <div class="accordion-body" style="display:none; padding:24px 30px;">
          ${groups[groupName].map((f) => renderField(f, existing)).join("")}
        </div>
      </div>`
    )
    .join("");

  container.innerHTML = jumpBar + accordion;

  // Accordion toggle
  document.querySelectorAll(".accordion-header").forEach((btn) => {
    btn.addEventListener("click", () => {
      const body = btn.nextElementSibling;
      const arrow = btn.querySelector(".accordion-arrow");
      const isOpen = body.style.display === "block";
      body.style.display = isOpen ? "none" : "block";
      arrow.textContent = isOpen ? "▸" : "▾";
    });
  });

  // Jump-to dropdown behaviour
  document.getElementById("section-jump").addEventListener("change", (e) => {
    const id = e.target.value;
    if (!id) return;
    const section = document.getElementById(id);
    const header = section.querySelector(".accordion-header");
    const body = section.querySelector(".accordion-body");
    const arrow = section.querySelector(".accordion-arrow");
    body.style.display = "block";
    arrow.textContent = "▾";
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.querySelectorAll(".field-save-btn").forEach((btn) => {
    btn.addEventListener("click", () => saveOneField(btn.dataset.key));
  });
  document.querySelectorAll(".field-clear-btn").forEach((btn) => {
    btn.addEventListener("click", () => clearOneField(btn.dataset.key));
  });
}

function cssId(str) {
  return "section-" + str.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function renderField(f, existing) {
  const val = (existing[f.key] && existing[f.key].length > 0) ? existing[f.key] : (f.default || "");
  const escaped = String(val).replace(/"/g, "&quot;");
  const isVideo = val.match(/\.mp4($|\?)/i);
  const hasSavedValue = existing[f.key] && existing[f.key].length > 0;

  if (f.type === "textarea") {
    return `
      <div class="field-block">
        <label>${f.label}</label>
        <textarea id="input-${f.key}">${val}</textarea>
        <div class="field-row">
          <button class="btn btn-outline-navy field-save-btn" data-key="${f.key}">Save</button>
          <button class="btn field-clear-btn" data-key="${f.key}" style="border:1px solid #B23A3A; color:#B23A3A; background:none;" ${hasSavedValue ? "" : "disabled"}>Clear / Reset to Default</button>
          <span class="field-status" id="status-${f.key}"></span>
        </div>
      </div>`;
  } else if (f.type === "image") {
    const preview = val
      ? isVideo
        ? `<video src="${val}" style="height:70px; border-radius:4px; margin-top:8px;" muted></video>`
        : `<img src="${val}" style="height:70px; border-radius:4px; margin-top:8px;" onerror="this.style.display='none'" />`
      : "";
    return `
      <div class="field-block">
        <label>${f.label}</label>
        <input type="file" accept="image/*,video/mp4" id="file-${f.key}" />
        <input type="hidden" id="input-${f.key}" value="${escaped}" />
        <div id="preview-${f.key}">${preview}</div>
        <div class="field-row">
          <button class="btn btn-outline-navy field-save-btn" data-key="${f.key}">Upload &amp; Save</button>
          <button class="btn field-clear-btn" data-key="${f.key}" style="border:1px solid #B23A3A; color:#B23A3A; background:none;" ${hasSavedValue ? "" : "disabled"}>Remove / Reset to Default</button>
          <span class="field-status" id="status-${f.key}"></span>
        </div>
      </div>`;
  } else {
    return `
      <div class="field-block">
        <label>${f.label}</label>
        <input type="text" id="input-${f.key}" value="${escaped}" />
        <div class="field-row">
          <button class="btn btn-outline-navy field-save-btn" data-key="${f.key}">Save</button>
          <button class="btn field-clear-btn" data-key="${f.key}" style="border:1px solid #B23A3A; color:#B23A3A; background:none;" ${hasSavedValue ? "" : "disabled"}>Clear / Reset to Default</button>
          <span class="field-status" id="status-${f.key}"></span>
        </div>
      </div>`;
  }
}

async function saveOneField(key) {
  const statusEl = document.getElementById(`status-${key}`);
  const fileInput = document.getElementById(`file-${key}`);
  const textInput = document.getElementById(`input-${key}`);
  statusEl.textContent = "Saving…";
  statusEl.className = "field-status";

  try {
    let value = textInput.value;

    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const path = `${key}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error: uploadError } = await supabaseClient.storage.from("media").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabaseClient.storage.from("media").getPublicUrl(path);
      value = publicUrlData.publicUrl;
      textInput.value = value;
      const previewEl = document.getElementById(`preview-${key}`);
      if (previewEl) {
        const isVideo = file.type.startsWith("video");
        previewEl.innerHTML = isVideo
          ? `<video src="${value}" style="height:70px; border-radius:4px; margin-top:8px;" muted></video>`
          : `<img src="${value}" style="height:70px; border-radius:4px; margin-top:8px;" />`;
      }
    }

    const { error } = await supabaseClient
      .from("content_blocks")
      .upsert([{ content_key: key, content_value: value, updated_at: new Date().toISOString() }], { onConflict: "content_key" });
    if (error) throw error;

    statusEl.textContent = "✓ Saved";
    statusEl.className = "field-status ok";
    const clearBtn = document.querySelector(`.field-clear-btn[data-key="${key}"]`);
    if (clearBtn) clearBtn.disabled = false;
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Failed: " + err.message;
    statusEl.className = "field-status err";
  }
}

async function clearOneField(key) {
  const statusEl = document.getElementById(`status-${key}`);
  if (!confirm("Remove this saved content and revert to the default placeholder?")) return;
  statusEl.textContent = "Clearing…";
  statusEl.className = "field-status";

  try {
    const { error } = await supabaseClient.from("content_blocks").delete().eq("content_key", key);
    if (error) throw error;

    const field = CONTENT_FIELDS.find((f) => f.key === key);
    const defaultVal = field && field.default ? field.default : "";
    const textInput = document.getElementById(`input-${key}`);
    if (textInput) textInput.value = defaultVal;
    const previewEl = document.getElementById(`preview-${key}`);
    if (previewEl) {
      previewEl.innerHTML = defaultVal
        ? (defaultVal.match(/\.mp4($|\?)/i)
            ? `<video src="${defaultVal}" style="height:70px; border-radius:4px; margin-top:8px;" muted></video>`
            : `<img src="${defaultVal}" style="height:70px; border-radius:4px; margin-top:8px;" />`)
        : "";
    }
    const fileInput = document.getElementById(`file-${key}`);
    if (fileInput) fileInput.value = "";

    statusEl.textContent = "✓ Reverted to default";
    statusEl.className = "field-status ok";
    const clearBtn = document.querySelector(`.field-clear-btn[data-key="${key}"]`);
    if (clearBtn) clearBtn.disabled = true;
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Failed: " + err.message;
    statusEl.className = "field-status err";
  }
}

initContentEditor();