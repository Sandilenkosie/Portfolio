
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