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

    let galleryData = [];
    let currentFilter = "All";

    fetch("Images/gallery.json")
        .then(res => {
            if (!res.ok) throw new Error("Gallery JSON not found");
            return res.json();
        })
        .then(data => {
            galleryData = data.gallery;
            renderGallery();
        })
        .catch(err => {
            console.error("Gallery load failed:", err);
        });

    function renderGallery() {
        const grid = document.getElementById("gallery-grid");
        if (!grid) return;

        grid.innerHTML = "";

        galleryData
            .filter(item => item.projects.includes(currentFilter))
            .forEach(item => {
                const card = document.createElement("div");
                card.className = "card";

                card.innerHTML = `
                <img src="${item.src}" alt="${item.title}" class="mb-3 rounded">
                <h3 class="font-mono text-sm">${item.title}</h3>
            `;

                grid.appendChild(card);
            });
    }

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            currentFilter = btn.dataset.filter;

            document.querySelectorAll(".filter-btn")
                .forEach(b => b.classList.remove("active"));

            btn.classList.add("active");
            renderGallery();
        });
    });
});