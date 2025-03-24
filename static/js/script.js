
const links = document.querySelectorAll(".section-link");
const sections = document.querySelectorAll(".section-content");

links.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        // Handle section visibility
        const targetSection = link.getAttribute("data-section");
        sections.forEach(section => section.classList.add("hidden"));
        document.getElementById(targetSection).classList.remove("hidden");

        // Handle active link styling
        links.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
    });
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        link.classList.add('active');
    });
});

const containers = document.querySelectorAll("#progress-experience, #progress-project, #progress-skill");

function startProgressBars() {
    const values = [1, 9, 100];
    const ids = ['experience-number', 'project-number', 'skill-number'];
    const colors = ['#e0befa', '#a855f7'];  // Start and end colors

    containers.forEach((container, index) => {
        // Clear any previous content (prevents double overlays)
        container.innerHTML = `<span id="${ids[index]}" class="absolute text-2xl font-semibold">0</span>`;

        // Create a new progress bar
        const bar = new ProgressBar.Circle(container, {
            color: colors[0], // Initial color
            trailColor: '#1a202c', // Color of the empty portion of the circle
            trailWidth: 1,
            duration: 3000,
            easing: 'bounce',
            strokeWidth: 6,
            from: { color: colors[0], a: 0 },
            to: { color: colors[1], a: 1 },

            step: function (state, circle) {
                circle.path.setAttribute('stroke', state.color);  // Update stroke color dynamically

                // Change the color while loading
                const value = Math.round(circle.value() * values[index]);

                // Add "+" only to the skill-number
                document.getElementById(ids[index]).textContent = index === 2 ? `${value}+` : value;
            }
        });

        // Start the animation
        bar.animate(1.0);
    });

    // Restart progress bars after 30 seconds
    setTimeout(() => startProgressBars(), 30000);
}

// Start the initial progress bars
startProgressBars();


// Toggle mobile menu
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelectorAll("#mobile-menu a");

// Toggle menu visibility
mobileMenuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

// Hide menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
    });
});






