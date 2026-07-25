// Generic handler for Supabase-backed forms.
// Works for both the Admissions Inquiry form and the Contact form —
// it reads the form's data-table attribute to know which table to insert into.

function showStatus(statusEl, message, ok) {
  statusEl.textContent = message;
  statusEl.className = "form-status " + (ok ? "ok" : "err");
}

async function handleSupabaseForm(form) {
  const statusEl = form.querySelector(".form-status");
  const submitBtn = form.querySelector('button[type="submit"]');
  const table = form.dataset.table;

  const formData = new FormData(form);
  const payload = {};
  formData.forEach((value, key) => (payload[key] = value));
  payload.created_at = new Date().toISOString();

  submitBtn.disabled = true;
  const originalLabel = submitBtn.textContent;
  submitBtn.textContent = "Sending…";

  try {
    const { error } = await supabaseClient.from(table).insert([payload]);
    if (error) throw error;

    showStatus(
      statusEl,
      table === "admission_inquiries"
        ? "Received — our admissions team will call you within 2 working days."
        : "Message sent — we'll get back to you shortly.",
      true
    );
    form.reset();
  } catch (err) {
    console.error(err);
    showStatus(
      statusEl,
      "Couldn't send that. Check your connection and try again, or call us directly.",
      false
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form[data-table]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleSupabaseForm(form);
    });
  });
});