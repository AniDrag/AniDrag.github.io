document.addEventListener('DOMContentLoaded', function () {
    const background = document.getElementById("background");

    if (background) {
        window.addEventListener("scroll", () => {
            const scrollY = window.scrollY;
            background.style.transform = `translateY(${scrollY * -0.1}px)`;
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});