document.addEventListener('DOMContentLoaded', function () {
    fetch('./assets/json/cards.json')
        .then(response => response.json())
        .then(cards => {
            const cardGrid = document.getElementById('card-grid');
            const searchBar = document.getElementById('searchBar');
            const container = document.querySelector('.container');
            const categoryButtonsContainer = document.createElement('div');
            categoryButtonsContainer.id = 'category-buttons';
            container.insertBefore(categoryButtonsContainer, cardGrid);

            let activeCategory = null;

            const categorizedCards = cards.reduce((acc, card) => {
                if (!acc[card.jurisdiction]) acc[card.jurisdiction] = [];
                acc[card.jurisdiction].push(card);
                return acc;
            }, {});

            function renderCategoryButtons() {
                categoryButtonsContainer.innerHTML = '';

                Object.keys(categorizedCards).forEach(jurisdiction => {
                    const button = document.createElement('button');
                    button.textContent = jurisdiction.charAt(0).toUpperCase() + jurisdiction.slice(1);
                    button.classList.add('category-button');

                    button.addEventListener('click', () => {
                        activeCategory = jurisdiction;
                        renderCards(jurisdiction);
                    });

                    categoryButtonsContainer.appendChild(button);
                });

                // Botón para mostrar todas las categorías
                const showAllButton = document.createElement('button');
                showAllButton.textContent = 'Mostrar Todos';
                showAllButton.classList.add('category-button');

                showAllButton.addEventListener('click', () => {
                    activeCategory = null;
                    renderCards(null); // Mostrar todas las tarjetas
                });

                categoryButtonsContainer.appendChild(showAllButton);
            }

            function renderCards(category) {
                cardGrid.innerHTML = '';

                const cardsToRender = category ? categorizedCards[category] : cards;

                cardsToRender.forEach(card => {
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

                    cardGrid.appendChild(cardElement);
                });
            }

            renderCategoryButtons();
            renderCards(null); // Mostrar todas las tarjetas al cargar la página

            searchBar.addEventListener('input', function () {
                const filter = searchBar.value.toLowerCase();

                if (filter === '') {
                    // Si el campo de búsqueda está vacío, mostrar la categoría seleccionada
                    renderCards(activeCategory);
                } else {
                    // Filtrar las tarjetas por título
                    const filteredCards = cards.filter(card =>
                        card.title.toLowerCase().includes(filter)
                    );

                    cardGrid.innerHTML = ''; // Limpiar la cuadrícula antes de mostrar los resultados

                    if (filteredCards.length > 0) {
                        filteredCards.forEach(card => {
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

                            cardGrid.appendChild(cardElement);
                        });
                    } else {
                        // Si no hay resultados, mostrar un mensaje de "No se encontraron resultados"
                        const noResultsElement = document.createElement('p');
                        noResultsElement.textContent = 'No se encontraron resultados';
                        noResultsElement.classList.add('no-results');
                        cardGrid.appendChild(noResultsElement);
                    }
                }
            });
        })
        .catch(error => console.error('Error loading cards:', error));

    // Preloader
    window.addEventListener('load', function () {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('hidden');
    });
});
