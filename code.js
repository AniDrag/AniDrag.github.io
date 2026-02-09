document.addEventListener('DOMContentLoaded', function () {
    const background = document.getElementById("background");

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
    let allTags = new Set(["All"]); // Start with "All" tag

    fetch("./Images/gallery.json")
        .then(res => {
            if (!res.ok) throw new Error("Gallery JSON not found");
            return res.json();
        })
        .then(data => {
            galleryData = data.gallery;
            extractAllTags();
            createFilterButtons();
            renderGallery();
        })
        .catch(err => {
            console.error("Gallery load failed:", err);
            document.getElementById("gallery-grid").innerHTML =
                '<p class="text-red-400 font-mono">Error loading gallery. Please check the JSON file.</p>';
        });

    function extractAllTags() {
        // Extract all unique tags from gallery data
        galleryData.forEach(item => {
            if (item.projects && Array.isArray(item.projects)) {
                item.projects.forEach(tag => {
                    if (tag !== "All") {
                        allTags.add(tag);
                    }
                });
            }
        });
    }

    function createFilterButtons() {
        const filterContainer = document.getElementById("filter-buttons");
        if (!filterContainer) return;

        filterContainer.innerHTML = "";

        // Create "All" button first
        const allButton = document.createElement("button");
        allButton.className = "filter-btn active";
        allButton.dataset.filter = "All";
        allButton.textContent = "All";
        filterContainer.appendChild(allButton);

        // Create buttons for all other tags
        allTags.forEach(tag => {
            if (tag === "All") return;

            const button = document.createElement("button");
            button.className = "filter-btn";
            button.dataset.filter = tag;
            button.textContent = tag;
            filterContainer.appendChild(button);
        });

        // Add event listeners to filter buttons
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                currentFilter = btn.dataset.filter;

                document.querySelectorAll(".filter-btn")
                    .forEach(b => b.classList.remove("active"));

                btn.classList.add("active");
                renderGallery();
            });
        });
    }

    function renderGallery() {
        const grid = document.getElementById("gallery-grid");
        if (!grid) return;

        grid.innerHTML = "";

        // Filter items based on current selection
        const filteredItems = galleryData.filter(item => {
            if (currentFilter === "All") return true;
            return item.projects && item.projects.includes(currentFilter);
        });

        // Create gallery items
        filteredItems.forEach(item => {
            const card = document.createElement("div");
            card.className = "card";

            // Create tags display (excluding "All")
            const tags = (item.projects || []).filter(tag => tag !== "All");
            const tagsHtml = tags.map(tag =>
                `<span class="tag">${tag}</span>`
            ).join("");

            card.innerHTML = `
                <img src="${item.src}" alt="${item.title}" loading="lazy">
                <h3 class="font-mono">${item.title}</h3>
                ${tags.length > 0 ? `<div class="tags">${tagsHtml}</div>` : ''}
            `;

            grid.appendChild(card);
        });

        // If no items found, show message
        if (filteredItems.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <p class="font-mono text-text-muted">No images found for "${currentFilter}" filter.</p>
                </div>
            `;
        }
    }
});