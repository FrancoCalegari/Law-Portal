const cards = [
    {
        title: "CODIGO PROCESAL PENAL",
        link: "https://www.argentina.gob.ar/normativa/nacional/ley-23984-383/actualizacion",
        image: "https://images.cdn3.buscalibre.com/fit-in/360x360/d9/fb/d9fb47d1c1b2474c385cb6c1dac51f87.jpg",
        jurisdiction: "Nacional",
        pdf: "https://www.example.com/procesal-penal.pdf",
        coment: "https://www.example.com/procesal-penal-comentarios"
    },
    {
        title: "CODIGO AERONAUTICO",
        link: "https://www.argentina.gob.ar/normativa/nacional/ley-17285-24963/actualizacion",
        image: "https://http2.mlstatic.com/D_NQ_NP_710813-MLA26936708643_032018-O.webp",
        jurisdiction: "Nacional",
        pdf: "https://www.example.com/aeronautico.pdf",
        coment: ""
    },
    {
        title: "CODIGO DE MINERIA",
        link: "https://www.argentina.gob.ar/normativa/nacional/ley-1919-43797/actualizacion",
        image: "https://edicionesdelpais.com/editorial/wp-content/uploads/2019/04/Codigo_Mineria_tapa.jpg",
        jurisdiction: "Nacional",
        pdf: "",
        coment: "https://www.example.com/mineria-comentarios"
    },
    {
        title: "Código Procesal Laboral",
        link: "https://www.argentina.gob.ar/normativa/provincial/ley-2144-123456789-0abc-defg-441-2000mvorpyel/actualizacion",
        image: "https://www.rubinzal.com.ar/expedicion/tapas/tapa_2319.jpg.jpg",
        jurisdiction: "Provincial",
        pdf: "https://www.example.com/procesal-laboral.pdf",
        coment: "https://www.example.com/procesal-laboral-comentarios"
    },
    {
        title: "CODIGO ELECTORAL NACIONAL",
        link: "https://www.argentina.gob.ar/normativa/nacional/ley-19945-19442/actualizacion",
        image: "https://acdn.mitiendanube.com/stores/081/038/products/whatsapp-image-2023-12-22-at-3-24-28-pm-4d3b0cbd929154079b17032700034334-1024-1024.jpeg",
        jurisdiction: "Nacional",
        pdf: "",
        coment: ""
    },
    {
        title: "CODIGO ADUANERO",
        link: "https://www.argentina.gob.ar/normativa/nacional/ley-22415-16536/actualizacion",
        image: "https://acdn.mitiendanube.com/stores/196/954/products/codigoaduanero20221-d17666485ac4e474a216546204232492-480-0.png",
        jurisdiction: "Nacional",
        pdf: "https://www.example.com/aduanero.pdf",
        coment: "https://www.example.com/aduanero-comentarios"
    },
    {
        title: "CODIGO ALIMENTARIO ARGENTINO",
        link: "https://www.argentina.gob.ar/normativa/nacional/ley-18284-21841/texto",
        image: "https://www.fedecom.org.ar/wp-content/uploads/2019/02/codigo-alimentario-argentino.jpg",
        jurisdiction: "Nacional",
        pdf: "https://www.example.com/alimentario.pdf",
        coment: ""
    },
    {
        title: "Código procesal civil de la provincia de Mendoza",
        link: "https://www.argentina.gob.ar/normativa/provincial/ley-2269-123456789-0abc-defg-962-2000mvorpyel/actualizacion",
        image: "https://mendozalegal.com/wp-content/uploads/2020/02/4-Tapa-Codigo-Procesal-230x332.jpg",
        jurisdiction: "Provincial",
        pdf: "https://www.example.com/procesal-civil-mendoza.pdf",
        coment: "https://www.example.com/procesal-civil-mendoza-comentarios"
    },
    {
        title: "Senado Mendoza",
        link: "https://www.senadomendoza.gob.ar/",
        image: "https://www.senadomendoza.gob.ar/wp-content/uploads/2021/11/WhatsApp-Image-2021-11-08-at-13.19.41-1024x683.jpeg",
        jurisdiction: "Provincial",
        pdf: "",
        coment: "https://www.example.com/senado-mendoza-comentarios"
    },
    {
        title: "CÓDIGO PROCESAL PENAL DE MENDOZA",
        link: "https://www.argentina.gob.ar/normativa/provincial/ley-6730-123456789-0abc-defg-037-6001mvorpyel",
        image: "https://acdn.mitiendanube.com/stores/001/293/016/products/tapa_cpp-comentado_penasco1-979b0f2a33cf61dac116448447827406-640-0.jpg",
        jurisdiction: "Provincial",
        pdf: "https://www.example.com/procesal-penal-mendoza.pdf",
        coment: ""
    },
    {
        title: "Convención Americana DDHH",
        link: "https://www.argentina.gob.ar/sites/default/files/derechoshumanos_publicaciones_colecciondebolsillo_10_convencion_americana_ddhh.pdf",
        image: "https://bibliotecacorteidh.winkel.la/content/images/thumbs/0000825_convencion-americana-sobre-derechos-humanos-comentario-segunda-edicion_550.png",
        jurisdiction: "Internacional",
        pdf: "https://www.example.com/ddhh.pdf",
        coment: "https://www.example.com/ddhh-comentarios"
    },
    {
        title: "CODIGO PROCESAL CIVIL Y COMERCIAL DE LA NACION",
        link: "https://www.argentina.gob.ar/normativa/nacional/ley-17454-16547/actualizacion",
        image: "https://www.rubinzal.com.ar/expedicion/tapas/tapa_2465.jpg",
        jurisdiction: "Nacional",
        pdf: "https://www.example.com/civil-comercial.pdf",
        coment: "https://www.example.com/civil-comercial-comentarios"
    },
    {
        title: "Código Procesal Civil, Comercial y Tributario de la Provincia de Mendoza",
        link: "https://www.argentina.gob.ar/normativa/provincial/ley-9001-123456789-0abc-defg-100-9000mvorpyel/actualizacion",
        image: "https://acdn.mitiendanube.com/stores/001/293/016/products/cpc_revisado1-59c9d01a54049d82f616504569158361-640-0.jpg",
        jurisdiction: "Provincial",
        pdf: "https://www.example.com/procesal-civil-comercial-tributario-mendoza.pdf",
        coment: "https://www.example.com/procesal-civil-comercial-tributario-mendoza-comentarios"
    },
    {
        title: "Constitución de la provincia de Mendoza",
        link: "https://www.argentina.gob.ar/normativa/provincial/ley-0-123456789-0abc-defg-000-0000mvorpyel/actualizacion",
        image: "https://storage-aws-production.publica.la/asc-libros-juridicos-sa/issues/2020/07/SCQA0WEl5ua6mbre/1596130174_cover.jpeg",
        jurisdiction: "Provincial",
        pdf: "",
        coment: "https://www.example.com/constitucion-mendoza-comentarios"
    },
    {
        title: "CODIGO PENAL DE LA NACION ARGENTINA",
        link: "https://www.argentina.gob.ar/normativa/nacional/ley-11179-16546/actualizacion",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1rO9dauRoGQVORuLQ7WNE3gYoS7ezwwcjag&s",
        jurisdiction: "Nacional",
        pdf: "https://www.example.com/penal.pdf",
        coment: "https://www.example.com/penal-comentarios"
    },
    {
        title: "CODIGO CIVIL Y COMERCIAL DE LA NACION",
        link: "https://www.argentina.gob.ar/normativa/nacional/ley-26994-235975/actualizacion",
        image: "https://www.tematika.com/media/catalog/Ilhsa/Imagenes/716116.jpg",
        jurisdiction: "Nacional",
        pdf: "https://www.example.com/civil-comercial.pdf",
        coment: ""
    },
    {
        title: "CONSTITUCION NACIONAL ARGENTINA",
        link: "https://www.argentina.gob.ar/normativa/nacional/constitucionnacional18481860-texactoactualizado/actualizacion",
        image: "https://www.buscabiografias.com/img/people/Constitucion-Argentina.jpg",
        jurisdiction: "Nacional",
        pdf: "https://www.example.com/constitucion-nacional.pdf",
        coment: "https://www.example.com/constitucion-nacional-comentarios"
    }
];

// Seleccionar el contenedor de las tarjetas y el campo de búsqueda
const cardGrid = document.getElementById('card-grid');
const searchBar = document.getElementById('searchBar');

// Categorizar y generar las tarjetas dinámicamente según la jurisdicción
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
        const cardElement = document.createElement('div'); // Cambiar a 'div' en lugar de 'a'
        cardElement.classList.add('card');
        cardElement.innerHTML = `
            <img src="${card.image}" alt="${card.title}">
            <div class="card-title">${card.title}</div>
            <div class="card-buttons">
                ${card.pdf ? `<a href="${card.pdf}" target="_blank">PDF</a>` : ''}
                ${card.coment ? `<a href="${card.coment}" target="_blank">Comentarios</a>` : ''}
            </div>
        `;
    
        // Agregar evento para redireccionar al hacer clic en la imagen
        cardElement.querySelector('img').addEventListener('click', () => {
            window.open(card.link, '_blank');
        });
    
        cardSectionGrid.appendChild(cardElement);
    });

    section.appendChild(cardSectionGrid);
    cardGrid.appendChild(section);
});

// Filtrar tarjetas según el texto del buscador
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

    // Reorganizar las tarjetas visibles
    document.querySelectorAll('.card-grid').forEach(grid => {
        const visibleCards = Array.from(grid.querySelectorAll('.card:not(.hidden)'));
        visibleCards.forEach(card => grid.appendChild(card));
    });

    // Si el campo de búsqueda está vacío, mostrar todas las tarjetas
    if (filter === '') {
        cards.forEach(card => card.classList.remove('hidden'));
    }
});

// Esconde el preloader una vez que la página ha cargado
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');
});
