// Renders CONTENT_FIELDS as collapsible accordions into TWO separate
// containers: "Mandatory Disclosure — *" groups go into the Disclosure
// tab (#disclosure-editor), everything else goes into the Site Content
// tab (#content-editor). Individual Save + Clear buttons per field.
// Image/video/PDF fields support direct file upload to Supabase Storage.

async function initContentEditor() {
  const siteContainer = document.getElementById("content-editor");
  const disclosureContainer = document.getElementById("disclosure-editor");
  if (!siteContainer && !disclosureContainer) return;

  let existing = {};
  try {
    const { data, error } = await supabaseClient.from("content_blocks").select("*");
    if (error) throw error;
    (data || []).forEach((row) => (existing[row.content_key] = row.content_value));
  } catch (err) {
    console.error("Could not load existing content:", err);
  }

  const siteGroups = {};
  const disclosureGroups = {};
  CONTENT_FIELDS.forEach((field) => {
    const target = field.group.startsWith("Mandatory Disclosure") ? disclosureGroups : siteGroups;
    if (!target[field.group]) target[field.group] = [];
    target[field.group].push(field);
  });

  if (siteContainer) renderAccordion(siteContainer, siteGroups, existing, "site");
  if (disclosureContainer) renderAccordion(disclosureContainer, disclosureGroups, existing, "disclosure");
}

function renderAccordion(container, groups, existing, prefix) {
  const groupNames = Object.keys(groups);
  if (!groupNames.length) {
    container.innerHTML = `<p style="color:var(--ink-soft); font-size:14px;">Nothing here yet.</p>`;
    return;
  }

  const jumpBar = `
    <div class="admin-card" style="padding:20px 30px;">
      <label style="display:block; font-family:var(--font-mono); font-size:11.5px; letter-spacing:.06em; text-transform:uppercase; color:var(--ink-soft); margin-bottom:8px;">Jump to section</label>
      <select id="${prefix}-section-jump" style="width:100%; padding:12px 14px; border:1px solid var(--line); border-radius:2px; font-family:var(--font-body); font-size:14.5px; background:var(--parchment); color:var(--ink);">
        <option value="">— Select a section —</option>
        ${groupNames.map((g) => `<option value="${cssId(prefix, g)}">${g}</option>`).join("")}
      </select>
    </div>`;

  const accordion = groupNames
    .map(
      (groupName) => `
      <div class="admin-card accordion-section" id="${cssId(prefix, groupName)}" style="padding:0; overflow:hidden;">
        <button class="accordion-header" style="width:100%; text-align:left; background:var(--parchment-dim); border:none; padding:20px 30px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; font-family:var(--font-display); font-size:18px; color:var(--navy);">
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

  container.querySelectorAll(".accordion-header").forEach((btn) => {
    btn.addEventListener("click", () => {
      const body = btn.nextElementSibling;
      const arrow = btn.querySelector(".accordion-arrow");
      const isOpen = body.style.display === "block";
      body.style.display = isOpen ? "none" : "block";
      arrow.textContent = isOpen ? "▸" : "▾";
    });
  });

  const jumpSelect = document.getElementById(`${prefix}-section-jump`);
  if (jumpSelect) {
    jumpSelect.addEventListener("change", (e) => {
      const id = e.target.value;
      if (!id) return;
      const section = document.getElementById(id);
      const body = section.querySelector(".accordion-body");
      const arrow = section.querySelector(".accordion-arrow");
      body.style.display = "block";
      arrow.textContent = "▾";
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  container.querySelectorAll(".field-save-btn").forEach((btn) => {
    btn.addEventListener("click", () => saveOneField(btn.dataset.key));
  });
  container.querySelectorAll(".field-clear-btn").forEach((btn) => {
    btn.addEventListener("click", () => clearOneField(btn.dataset.key));
  });
}

function cssId(prefix, str) {
  return prefix + "-section-" + str.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function isPdfUrl(url) {
  return url && /\.pdf($|\?)/i.test(url);
}

function renderField(f, existing) {
  const val = (existing[f.key] && existing[f.key].length > 0) ? existing[f.key] : (f.default || "");
  const escaped = String(val).replace(/"/g, "&quot;");
  const isVideo = val.match(/\.mp4($|\?)/i);
  const isPdf = isPdfUrl(val);
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
    let preview = "";
    if (val) {
      if (isPdf) {
        preview = `<a href="${val}" target="_blank" rel="noopener" style="display:inline-block; margin-top:8px; font-family:var(--font-mono); font-size:12.5px; color:var(--navy); text-decoration:underline;">📄 View uploaded PDF</a>`;
      } else if (isVideo) {
        preview = `<video src="${val}" style="height:70px; border-radius:4px; margin-top:8px;" muted></video>`;
      } else {
        preview = `<img src="${val}" style="height:70px; border-radius:4px; margin-top:8px;" onerror="this.style.display='none'" />`;
      }
    }
    return `
      <div class="field-block">
        <label>${f.label}</label>
        <input type="file" accept="image/*,video/mp4,application/pdf" id="file-${f.key}" />
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
        if (isPdfUrl(value) || file.type === "application/pdf") {
          previewEl.innerHTML = `<a href="${value}" target="_blank" rel="noopener" style="display:inline-block; margin-top:8px; font-family:var(--font-mono); font-size:12.5px; color:var(--navy); text-decoration:underline;">📄 View uploaded PDF</a>`;
        } else if (file.type.startsWith("video")) {
          previewEl.innerHTML = `<video src="${value}" style="height:70px; border-radius:4px; margin-top:8px;" muted></video>`;
        } else {
          previewEl.innerHTML = `<img src="${value}" style="height:70px; border-radius:4px; margin-top:8px;" />`;
        }
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
      if (!defaultVal) {
        previewEl.innerHTML = "";
      } else if (isPdfUrl(defaultVal)) {
        previewEl.innerHTML = `<a href="${defaultVal}" target="_blank" rel="noopener">📄 View uploaded PDF</a>`;
      } else if (defaultVal.match(/\.mp4($|\?)/i)) {
        previewEl.innerHTML = `<video src="${defaultVal}" style="height:70px; border-radius:4px; margin-top:8px;" muted></video>`;
      } else {
        previewEl.innerHTML = `<img src="${defaultVal}" style="height:70px; border-radius:4px; margin-top:8px;" />`;
      }
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