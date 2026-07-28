// PVM International Academy — shared front-end behaviour

document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav.main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      toggle.textContent = nav.classList.contains("open") ? "✕" : "☰";
    });
  }

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll reveal
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }
});

// Animated stat counters — deliberately wait for content.js to finish
// applying any Supabase-saved numbers first, so we never animate from
// the HTML's default placeholder value by mistake.
function initStatCounters() {
  const stats = document.querySelectorAll(".stat .num[data-count]");
  if (!("IntersectionObserver" in window) || !stats.length) return;

  const statObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        const duration = 1200;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          el.textContent = Math.floor(progress * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(tick);
        statObs.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  stats.forEach((el) => statObs.observe(el));
}

// content.js dispatches "content-ready" once it's done fetching/applying
// Supabase data (success or failure). Wait for that signal specifically
// for the counters. Fallback timeout in case content.js isn't on this page.
document.addEventListener("content-ready", initStatCounters);
setTimeout(() => {
  const stats = document.querySelectorAll(".stat .num[data-count]");
  const alreadyStarted = Array.from(stats).some((el) => el.textContent !== "0");
  if (stats.length && !alreadyStarted) initStatCounters();
}, 2000);
// Gallery: keep auto-scrolling, but pause briefly whenever someone
// touches/swipes it, then resume after they let go.
document.addEventListener("DOMContentLoaded", () => {
  let resumeTimer;
  document.querySelectorAll(".gallery-grid").forEach((grid) => {
    const pause = () => {
      const track = grid.querySelector(".gallery-marquee-track");
      if (track) track.classList.add("user-paused");
      clearTimeout(resumeTimer);
    };
    const scheduleResume = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        const track = grid.querySelector(".gallery-marquee-track");
        if (track) track.classList.remove("user-paused");
      }, 2000);
    };
    grid.addEventListener("touchstart", pause, { passive: true });
    grid.addEventListener("touchend", scheduleResume);
    grid.addEventListener("mousedown", pause);
    grid.addEventListener("mouseup", scheduleResume);
  });
});