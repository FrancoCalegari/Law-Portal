fetch('./assets/json/cards.json')
    .then(response => response.json())
    .then(cards => {
        const cardGrid = document.getElementById('card-grid');
        const searchBar = document.getElementById('searchBar');

        const categorizedCards = cards.reduce((acc, card) => {
            if (!acc[card.jurisdiction]) acc[card.jurisdiction] = [];
            acc[card.jurisdiction].push(card);
            return acc;
        }, {});

        Object.keys(categorizedCards).forEach(jurisdiction => {
            const section = document.createElement('section');
            section.classList.add('card-category');
            section.innerHTML = `<h2>${jurisdiction.charAt(0).toUpperCase() + jurisdiction.slice(1)}</h2>`;

            const cardSectionGrid = document.createElement('div');
            cardSectionGrid.classList.add('card-grid');

            categorizedCards[jurisdiction].forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');
                cardElement.innerHTML = `
                    <img src="${card.image}" alt="${card.title}">
                    <div class="card-title">${card.title}</div>
                    <div class="card-buttons">
                        ${card.pdf ? `<a href="${card.pdf}" target="_blank">PDF</a>` : ''}
                        ${card.coment ? `<a href="${card.coment}" target="_blank">Comentado</a>` : ''}
                    </div>
                `;

                cardElement.querySelector('img').addEventListener('click', () => {
                    window.open(card.link, '_blank');
                });

                cardSectionGrid.appendChild(cardElement);
            });

            section.appendChild(cardSectionGrid);
            cardGrid.appendChild(section);
        });

        searchBar.addEventListener('input', function() {
            const filter = searchBar.value.toLowerCase();
            const cards = document.querySelectorAll('.card');

            cards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                if (title.includes(filter)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            document.querySelectorAll('.card-grid').forEach(grid => {
                const visibleCards = Array.from(grid.querySelectorAll('.card:not(.hidden)'));
                visibleCards.forEach(card => grid.appendChild(card));
            });

            if (filter === '') {
                cards.forEach(card => card.classList.remove('hidden'));
            }
        });
    })
    .catch(error => console.error('Error loading cards:', error));

window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');
});
