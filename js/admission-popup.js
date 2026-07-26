document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("admission-popup-overlay");
  if (!overlay) return;

  const alreadyShown = sessionStorage.getItem("admissionPopupShown");
  if (!alreadyShown) {
    setTimeout(() => {
      overlay.classList.add("show");
      sessionStorage.setItem("admissionPopupShown", "true");
    }, 3000);
  }

  function closePopup() {
    overlay.classList.remove("show");
  }

  document.getElementById("admission-popup-close").addEventListener("click", closePopup);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePopup();
  });

  const form = document.getElementById("admission-popup-form");
  const statusEl = form.querySelector(".form-status");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const fd = new FormData(form);
    const payload = {
      student_name: fd.get("student_name"),
      parent_name: fd.get("parent_name"),
      phone: fd.get("phone"),
      grade_applying: fd.get("grade_applying"),
      created_at: new Date().toISOString(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    try {
      const { error } = await supabaseClient.from("admission_inquiries").insert([payload]);
      if (error) throw error;
      statusEl.textContent = "Received — our team will call you within 2 working days.";
      statusEl.className = "form-status ok";
      form.reset();
      setTimeout(closePopup, 2000);
    } catch (err) {
      statusEl.textContent = "Couldn't send that. Please try the Admissions page instead.";
      statusEl.className = "form-status err";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Enquiry";
    }
  });
});