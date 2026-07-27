// Shared crop-before-upload tool. Any photo <input type="file"> across the
// admin panel automatically opens this crop popup before the file is used.
// Video files skip cropping entirely.

let cropperInstance = null;
let cropCallback = null;

async function openCropper(file, callback) {
  cropCallback = callback;
  const modal = document.getElementById("crop-modal");
  const imgEl = document.getElementById("crop-image-el");
  if (!modal || !imgEl) {
    callback(file);
    return;
  }

  // iPhone photos are often saved as HEIC, which browsers can't display
  // directly in an <img> tag. Convert to JPEG first if needed.
  const isHeic =
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    /\.(heic|heif)$/i.test(file.name);

  let workingFile = file;
  if (isHeic && typeof heic2any === "function") {
    try {
      const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
      const blobToUse = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      workingFile = new File([blobToUse], file.name.replace(/\.(heic|heif)$/i, ".jpg"), { type: "image/jpeg" });
    } catch (err) {
      console.error("HEIC conversion failed:", err);
      alert("Couldn't read this iPhone photo format. Please try a JPG or PNG instead.");
      return;
    }
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    imgEl.src = e.target.result;
    modal.style.display = "flex";
    if (cropperInstance) cropperInstance.destroy();
    cropperInstance = new Cropper(imgEl, {
      viewMode: 1,
      autoCropArea: 1,
      aspectRatio: NaN, // starts free — user picks a ratio button if they want one
    });
  };
  reader.readAsDataURL(workingFile);
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("crop-modal");
  if (!modal) return; // page has no crop modal (shouldn't happen on admin.html)

  document.querySelectorAll("#crop-modal [data-ratio]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const r = parseFloat(btn.dataset.ratio);
      if (cropperInstance) cropperInstance.setAspectRatio(r === 0 ? NaN : r);
    });
  });

  document.getElementById("crop-confirm-btn").addEventListener("click", () => {
    if (!cropperInstance) return;
    cropperInstance.getCroppedCanvas().toBlob(
      (blob) => {
        modal.style.display = "none";
        cropperInstance.destroy();
        cropperInstance = null;
        if (cropCallback) cropCallback(blob);
      },
      "image/jpeg",
      0.9
    );
  });

  document.getElementById("crop-cancel-btn").addEventListener("click", () => {
    modal.style.display = "none";
    if (cropperInstance) {
      cropperInstance.destroy();
      cropperInstance = null;
    }
  });

  // Intercept every photo <input type="file"> on the page automatically —
  // covers the Gallery upload, Faculty photo upload, and every Site Content
  // image field (all use ids starting with "file-" or these two exact ids).
  document.body.addEventListener("change", (e) => {
    const el = e.target;
    if (el.tagName !== "INPUT" || el.type !== "file") return;
    const isPhotoField =
      el.id === "gallery-file-input" || el.id === "faculty-file-input" || el.id.startsWith("file-");
    if (!isPhotoField) return;

    const file = el.files && el.files[0];
    if (!file) return;
    const looksLikePhoto = file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
    if (!looksLikePhoto) return; // skip videos — no cropping needed

    openCropper(file, (blob) => {
      const croppedFile = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
      const dt = new DataTransfer();
      dt.items.add(croppedFile);
      el.files = dt.files;
    });
  });
});