document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. FILTROS DE PORTAFOLIO (Sección Tatuajes)
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const targetFilter = button.getAttribute('data-target');

                portfolioItems.forEach(item => {
                    if (targetFilter === 'all') {
                        item.classList.remove('hide');
                    } else {
                        if (item.classList.contains(targetFilter)) {
                            item.classList.remove('hide');
                        } else {
                            item.classList.add('hide');
                        }
                    }
                });
            });
        });
    }

    // ==========================================
    // 2. LOGICA DEL MODAL (Solo si existe en pantalla)
    // ==========================================
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('contact-modal');

    // Usamos condicionales para que no tire error si no estamos en la página del modal
    if (openModalBtn && closeModalBtn && modal) {
        openModalBtn.addEventListener('click', () => {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });

        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('open');
            document.body.style.overflow = 'auto';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // ==========================================
    // 3. EFECTO DEL HEADER AL HACER SCROLL
    // ==========================================
    const header = document.querySelector('.main-header-nav');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ==========================================
    // 4. RESET Y ALERTAS DEL FORMULARIO (Sección Cotizar)
    // ==========================================
    const formulario = document.querySelector('.booking-form');

    if (formulario) {
        let seEstaEnviando = false;

        // Detectar si el usuario envía el formulario
        formulario.addEventListener('submit', () => {
            seEstaEnviando = true; 
        });

        // Advertencia de cambios sin guardar al salir/recargar
        window.addEventListener('beforeunload', (event) => {
            if (seEstaEnviando) return;

            const nameInput = document.getElementById('name')?.value.trim();
            const emailInput = document.getElementById('email')?.value.trim();
            const descriptionInput = document.getElementById('description')?.value.trim();

            // Si el usuario escribió en alguno de los campos clave
            if (nameInput || emailInput || descriptionInput) {
                event.preventDefault();
                event.returnValue = '¿Seguro que quieres salir? Los datos ingresados se perderán.';
                return '¿Seguro que quieres salir? Los datos ingresados se perderán.';
            }
        });
    }
});

// Forzar limpieza al regresar de otra página (fuera del DOMContentLoaded para asegurar el ciclo de vida de la página)
window.addEventListener('pageshow', () => {
    const formulario = document.querySelector('.booking-form');
    if (formulario) {
        formulario.reset();
    }
});

// ==========================================
// 5. CARGA AUTOMÁTICA DE VIDEOS DE YOUTUBE
// ==========================================
const musicGrid = document.getElementById('youtube-music-grid');

if (musicGrid) {
    // 💡 AQUÍ AGREGA TUS VIDEOS: Solo pon el ID de YouTube y la descripción que quieras abajo
    const listaVideos = [
        { id: "RRMC_SUg1m0", desc: "Beat conceptual y atmósfera inmersiva." },
        { id: "D1poGzvkxqs", desc: "Un viaje emocional sobre el desamor y la superación, aceptando con nostalgia que esa persona especial ya sigue su camino." },
        { id: "gAmKs5_B8VM", desc: "La dolorosa pero necesaria decisión de alejarse de un amor dañino, dejando atrás el pasado para volver a empezar." },
        { id: "QYlPu5Cl5cQ", desc: "Letras directas y crudas sobre el punto de quiebre en una relación, donde la reconciliación ya no es una alternativa viable y toca priorizar el bienestar propio." },
        { id: "BWxeJ-RS_QA", desc: "Una atmósfera de atracción prohibida y relaciones complejas, donde la química y la pasión desafían las reglas establecidas." },
        { id: "7iHKlYxfRLY", desc: "Definida como una 'carta de renuncia' musical; una canción sincera que acepta con madurez que, aunque la relación valió la pena, lo mejor para ambos es tomar caminos separados." },
        { id: "sWOQapzsb2E", desc: "Un tema de trap suave y melódico que le canta al deseo de detener el tiempo y repetir esa noche perfecta con la persona ideal." },

        // Para agregar más videos, solo añade una coma y copia la estructura así:
        // { id: "NUEVO_ID_AQUI", desc: "Tu nueva descripción aquí" }
    ];

    // Recorrer cada video de la lista
    listaVideos.forEach(video => {
        // 1. Crear la estructura de la tarjeta en la memoria del navegador
        const card = document.createElement('div');
        card.className = 'video-card'; // 

        // 2. Inyectamos la plantilla HTML base dejando espacios vacíos para el título
        card.innerHTML = `
            <div class="video-wrapper">
                <iframe src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="video-info">
                <h3 id="title-${video.id}">Cargando título...</h3>
                <p>${video.desc}</p>
            </div>
        `;

        // 3. Añadir la tarjeta vacía al grid visual de tu web
        musicGrid.appendChild(card);

        // 4. ¡La magia! Consultamos de forma gratuita e interna a YouTube usando oEmbed
        // para traer el título exacto que tiene el video en su canal sin usar APIs complejas
        fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${video.id}&format=json`)
            .then(response => response.json())
            .then(data => {
                const titleElement = document.getElementById(`title-${video.id}`);
                if (titleElement && data.title) {
                    // Limpiamos el texto del canal para que solo quede el nombre de la canción si lo deseas,
                    // o ponemos el título idéntico de YouTube:
                    titleElement.textContent = data.title;
                }
            })
            .catch(error => {
                // Si algo falla o no hay internet, ponemos un título de respaldo genérico
                const titleElement = document.getElementById(`title-${video.id}`);
                if (titleElement) titleElement.textContent = "Alexart Track";
                console.error("Error al recuperar el título de YouTube:", error);
            });
    });
}