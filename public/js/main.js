/* ——— PORTAL PÚBLICO ——— main.js ——— */

document.addEventListener('DOMContentLoaded', function () {

    /* ── PRELOADER ── */
    window.addEventListener('load', function () {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => preloader.classList.add('hidden'), 400);
        }
    });

    /* ── CATEGORY FILTER BUTTONS (generado desde las cards ya renderizadas) ── */
    const cards      = Array.from(document.querySelectorAll('#card-grid .card'));
    const btnCont    = document.getElementById('category-buttons');
    const searchBar  = document.getElementById('searchBar');

    if (!btnCont || cards.length === 0) return;

    // Recopilar jurisdicciones únicas
    const jurisdictions = [...new Set(cards.map(c => c.dataset.jurisdiction).filter(Boolean))].sort();

    let activeJurisdiction = null;

    function renderButtons() {
        btnCont.innerHTML = '';

        // Botón "Todos"
        const allBtn = createBtn('Todos', !activeJurisdiction, () => {
            activeJurisdiction = null;
            applyFilters();
            rerenderButtons();
        });
        btnCont.appendChild(allBtn);

        jurisdictions.forEach(j => {
            const btn = createBtn(j, activeJurisdiction === j, () => {
                activeJurisdiction = j;
                applyFilters();
                rerenderButtons();
            });
            btnCont.appendChild(btn);
        });
    }

    function createBtn(label, isActive, onClick) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.className   = 'category-button' + (isActive ? ' active' : '');
        btn.addEventListener('click', onClick);
        return btn;
    }

    function rerenderButtons() {
        renderButtons();
    }

    function applyFilters() {
        const search = searchBar ? searchBar.value.toLowerCase().trim() : '';
        let visibleCount = 0;

        cards.forEach(card => {
            const matchJuris  = !activeJurisdiction || card.dataset.jurisdiction === activeJurisdiction;
            const matchSearch = !search || (card.dataset.title || '').includes(search);
            const show = matchJuris && matchSearch;
            card.style.display = show ? '' : 'none';
            if (show) visibleCount++;
        });

        // Mensaje "sin resultados"
        let noResults = document.querySelector('#card-grid .no-results');
        if (visibleCount === 0) {
            if (!noResults) {
                noResults = document.createElement('p');
                noResults.className = 'no-results';
                noResults.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> No se encontraron resultados.';
                document.getElementById('card-grid').appendChild(noResults);
            }
        } else {
            if (noResults) noResults.remove();
        }
    }

    // Búsqueda en tiempo real
    if (searchBar) {
        searchBar.addEventListener('input', applyFilters);
    }

    renderButtons();
    applyFilters();

    /* ── ANIMACIÓN STAGGERED ── */
    cards.forEach((card, i) => {
        card.style.animationDelay = `${i * 0.05}s`;
    });
});
