const links = document.querySelectorAll(".section-link");
const sections = document.querySelectorAll(".section-content");

// Navbar: transparent over hero, solid after scroll
(() => {
  const nav = document.getElementById("site-nav");
  if (!nav) return;

  function setScrolled(isScrolled) {
    nav.classList.toggle("nav--scrolled", isScrolled);
    nav.classList.toggle("nav--transparent", !isScrolled);
  }

  // Switch as soon as the user starts scrolling
  const onScroll = () => setScrolled(window.scrollY > 0);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

// Background: rain animation (canvas)
(() => {
  const canvas = document.getElementById("rain-canvas");
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let w = 0;
  let h = 0;
  let dpr = 1;

  const drops = [];
  const maxDrops = 380;

  // Thunderstorm tuning
  let wind = 0.6; // horizontal drift
  let windTarget = 0.6;
  let lightning = 0; // 0..1 flash intensity
  const splashes = [];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnDrop() {
    const heavy = Math.random() < 0.22;
    return {
      x: rand(-50, w + 50),
      y: rand(-h, 0),
      len: heavy ? rand(18, 34) : rand(12, 26),
      width: heavy ? rand(1.2, 1.9) : rand(0.8, 1.4),
      vy: heavy ? rand(16, 26) : rand(10, 18),
      vx: rand(-0.25, 0.25),
      alpha: heavy ? rand(0.16, 0.3) : rand(0.1, 0.22),
      heavy,
    };
  }

  function init() {
    drops.length = 0;
    const count = Math.min(Math.floor((w * h) / 6500), maxDrops);
    for (let i = 0; i < count; i++) drops.push(spawnDrop());
  }

  function spawnSplash(x) {
    // a few short-lived particles that shoot upward slightly
    const n = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++) {
      splashes.push({
        x: x + rand(-3, 3),
        y: h - rand(2, 10),
        vx: rand(-1.2, 1.2),
        vy: rand(-3.8, -1.4),
        life: rand(10, 18),
        alpha: rand(0.12, 0.22),
      });
    }
  }

  let lastTs = performance.now();
  function tick(ts) {
    const dt = Math.min((ts - lastTs) / 16.67, 2);
    lastTs = ts;

    // gusty wind
    windTarget += rand(-0.03, 0.03);
    windTarget = Math.max(-1.8, Math.min(1.8, windTarget));
    wind += (windTarget - wind) * 0.012;

    // occasional lightning
    if (Math.random() < 0.003) lightning = 1;
    lightning *= 0.9;

    // fade previous frame slightly for a smooth trail
    ctx.fillStyle = "rgba(11, 18, 32, 0.24)";
    ctx.fillRect(0, 0, w, h);

    if (lightning > 0.02) {
      // quick flash overlay
      ctx.fillStyle = `rgba(220, 235, 255, ${0.18 * lightning})`;
      ctx.fillRect(0, 0, w, h);
    }

    for (const d of drops) {
      ctx.strokeStyle = `rgba(200, 220, 255, ${d.alpha})`;
      ctx.lineWidth = d.width;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      const dx = (d.vx + wind) * 2.2;
      ctx.lineTo(d.x + dx, d.y + d.len);
      ctx.stroke();

      d.y += d.vy * dt;
      d.x += (d.vx + wind) * dt;

      if (d.y > h + 30) {
        if (d.heavy && Math.random() < 0.6) spawnSplash(d.x);
        d.x = rand(-50, w + 50);
        d.y = rand(-200, -20);
      }
    }

    // splash particles
    for (let i = splashes.length - 1; i >= 0; i--) {
      const p = splashes[i];
      ctx.fillStyle = `rgba(200, 220, 255, ${p.alpha})`;
      ctx.fillRect(p.x, p.y, 1.2, 1.2);

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 0.25 * dt;
      p.life -= 1 * dt;
      p.alpha *= 0.94;

      if (p.life <= 0 || p.alpha < 0.02) splashes.splice(i, 1);
    }

    requestAnimationFrame(tick);
  }

  resize();
  init();
  // paint first background
  ctx.fillStyle = "rgba(11, 18, 32, 1)";
  ctx.fillRect(0, 0, w, h);
  requestAnimationFrame(tick);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      init();
    }, 120);
  });
})();

// Mobile menu (Tailwind dropdown)
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Handle section visibility
    const targetSection = link.getAttribute("data-section");
    sections.forEach((section) => section.classList.add("hidden"));
    document.getElementById(targetSection).classList.remove("hidden");

    // Handle active link styling
    links.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-link")
      .forEach((link) => link.classList.remove("active"));
    link.classList.add("active");

    // Close mobile dropdown on navigation
    if (mobileMenu) mobileMenu.classList.add("hidden");
  });
});

// Toggle menu visibility
if (mobileMenuToggle && mobileMenu) {
  mobileMenuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// AI stats card glow (mouse tracking)
(() => {
  const cards = document.querySelectorAll(".ai-stat");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener(
      "pointermove",
      (e) => {
        const r = card.getBoundingClientRect();
        const mx = ((e.clientX - r.left) / r.width) * 100;
        const my = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty("--mx", `${mx}%`);
        card.style.setProperty("--my", `${my}%`);
      },
      { passive: true },
    );
  });
})();

const containers = document.querySelectorAll(
  "#progress-experience, #progress-project, #progress-skill",
);

function startProgressBars() {
  const values = [3, 19, 100];
  const ids = ["experience-number", "project-number", "skill-number"];
  const colors = ["#e0befa", "#a855f7"]; // Start and end colors

  containers.forEach((container, index) => {
    // Clear any previous content (prevents double overlays)
    container.innerHTML = `<span id="${ids[index]}" class="ai-stat__value">0</span>`;

    // Create a new progress bar
    const bar = new ProgressBar.Circle(container, {
      color: colors[0], // Initial color
      trailColor: "#1a202c", // Color of the empty portion of the circle
      trailWidth: 1,
      duration: 3000,
      easing: "bounce",
      strokeWidth: 6,
      from: { color: colors[0], a: 0 },
      to: { color: colors[1], a: 1 },

      step: function (state, circle) {
        circle.path.setAttribute("stroke", state.color); // Update stroke color dynamically

        // Change the color while loading
        const value = Math.round(circle.value() * values[index]);

        // Add "+" only to the skill-number
        document.getElementById(ids[index]).textContent =
          index === 2 ? `${value}+` : value;
      },
    });

    // Start the animation
    bar.animate(1.0);
  });

  // Restart progress bars after 30 seconds
  setTimeout(() => startProgressBars(), 30000);
}

// Start the initial progress bars
startProgressBars();

// Legacy mobile menu removed in favor of Shoelace drawer

window.onload = function () {
  window.location.hash = "#home";
};
