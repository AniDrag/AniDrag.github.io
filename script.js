// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const navLinks = document.getElementById("nav-links");

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("hidden");
    });
}

// Tech Art toggle
const techArtToggle = document.getElementById("tech-art-toggle");
const techArtContent = document.getElementById("tech-art-content");
const techArtToggleText = document.getElementById("tech-art-toggle-text");

if (techArtToggle && techArtContent && techArtToggleText) {
    techArtToggle.addEventListener("click", () => {
        const isHidden = techArtContent.classList.contains("max-h-0");

        techArtContent.classList.toggle("max-h-0", !isHidden);
        techArtContent.classList.toggle("max-h-screen", isHidden);
        techArtToggleText.textContent = isHidden ? "[Hide]" : "[Show]";
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) return;

        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: "smooth"
        });

        navLinks?.classList.add("hidden");
    });
});
