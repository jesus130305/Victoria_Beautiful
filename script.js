document.addEventListener('DOMContentLoaded', () => {
    // Search bar focus effect
    const searchInput = document.querySelector('.search-bar input');
    const searchBar = document.querySelector('.search-bar');

    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            searchBar.style.boxShadow = '0 0 0 2px rgba(233, 30, 99, 0.2)';
            searchBar.style.borderColor = '#e91e63';
        });

        searchInput.addEventListener('blur', () => {
            searchBar.style.boxShadow = 'none';
            searchBar.style.borderColor = 'transparent';
        });
    }

    // Smooth scroll for nav links (if they were internal)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Newsletter form submission (dummy)
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            if (email) {
                alert(`Thank you for subscribing, ${email}!`);
                newsletterForm.reset();
            }
        });
    }

    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .feature-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // --- NUEVA LÓGICA PARA EL CATÁLOGO (AISLADA) ---
    function vbInitCatalog() {
        const catalogScreen = document.getElementById('catalog-screen');
        const mainElements = document.querySelectorAll('main > section:not(#catalog-screen)');

        function vbShowScreen(showCatalog) {
            console.log("Switching screen. Show catalog:", showCatalog);
            if (showCatalog) {
                mainElements.forEach(el => el.classList.add('vb-hidden'));
                catalogScreen.classList.remove('vb-hidden');
                window.scrollTo(0, 0);
            } else {
                mainElements.forEach(el => el.classList.remove('vb-hidden'));
                catalogScreen.classList.add('vb-hidden');
                window.scrollTo(0, 0);
            }
        }

        // Delegación de eventos para botones
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button');
            if (!target) return;

            const text = target.innerText.toLowerCase();

            // Si se hace clic en "Ver Colección" o en categorías del home
            if (text.includes('ver colección') || text.includes('catálogo') || target.getAttribute('href') === '#maquillaje') {
                e.preventDefault();
                vbShowScreen(true);
            }

            // Regreso al Home: Logo o botón "Inicio" en catálogo
            if (target.classList.contains('vb-back-home') || target.closest('.logo')) {
                // Solo si el catálogo está visible, evitamos el default behavior del logo si es un link
                if (!catalogScreen.classList.contains('vb-hidden')) {
                    e.preventDefault();
                    vbShowScreen(false);
                }
            }
        });

        // Interacciones básicas del catálogo (Favoritos)
        catalogScreen.addEventListener('click', (e) => {
            const wishlistBtn = e.target.closest('.vb-wishlist-btn');
            if (wishlistBtn) {
                e.stopPropagation();
                const icon = wishlistBtn.querySelector('ion-icon');
                if (icon.name === 'heart-outline') {
                    icon.name = 'heart';
                    wishlistBtn.style.color = '#e91e63';
                } else {
                    icon.name = 'heart-outline';
                    wishlistBtn.style.color = '';
                }
            }

            const addBtn = e.target.closest('.vb-add-btn');
            if (addBtn) {
                const name = addBtn.closest('.vb-card').querySelector('h3').innerText;
                alert(`¡Se agregó "${name}" al carrito!`);
            }
        });
    }

    // Inicializar si el catálogo existe
    if (document.getElementById('catalog-screen')) {
        vbInitCatalog();
    }

    // --- NUEVA LÓGICA PARA DETALLES DEL PRODUCTO (FASE 2) ---
    function vdInitDetails() {
        const catalogScreen = document.getElementById('catalog-screen');
        const detailsScreen = document.getElementById('product-details');
        const homeSections = document.querySelectorAll('main > section:not(#catalog-screen):not(#product-details)');

        function vdSwitchScreen(screenId) {
            console.log("Details Logic: Switching to", screenId);
            // Ocultar todo
            catalogScreen.classList.add('vb-hidden');
            detailsScreen.classList.add('vb-hidden');
            homeSections.forEach(s => s.classList.add('vb-hidden'));

            // Mostrar el solicitado
            if (screenId === 'catalog') {
                catalogScreen.classList.remove('vb-hidden');
            } else if (screenId === 'details') {
                detailsScreen.classList.remove('vb-hidden');
            } else {
                homeSections.forEach(s => s.classList.remove('vb-hidden'));
            }
            window.scrollTo(0, 0);
        }

        function vdPopulateDetails(data) {
            document.getElementById('vd-product-name').innerText = data.name;
            document.getElementById('vd-breadcrumb-name').innerText = data.name;
            document.getElementById('vd-product-price').innerText = data.price;
            document.getElementById('vd-product-img').src = data.img;

            // Actualizar miniaturas (usando la misma imagen para demo)
            document.querySelectorAll('.vd-thumb img').forEach(img => img.src = data.img);
        }

        // Delegación de eventos para la Fase 2
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.vb-card, .vd-back-to-catalog, .vd-size-btn, .vd-acc-header');
            if (!target) return;

            // Al hacer clic en una card del catálogo
            if (target.classList.contains('vb-card')) {
                const name = target.querySelector('h3').innerText;
                const price = target.querySelector('.vb-card-price').innerText;
                const img = target.querySelector('img').src;

                vdPopulateDetails({ name, price, img });
                vdSwitchScreen('details');
            }

            // Regresar al catálogo
            if (target.classList.contains('vd-back-to-catalog')) {
                e.preventDefault();
                vdSwitchScreen('catalog');
            }

            // Selector de tamaño
            if (target.classList.contains('vd-size-btn')) {
                document.querySelectorAll('.vd-size-btn').forEach(btn => btn.classList.remove('active'));
                target.classList.add('active');
            }

            // Acordeón
            if (target.classList.contains('vd-acc-header')) {
                const item = target.parentElement;
                item.classList.toggle('open');
                const icon = target.querySelector('ion-icon');
                icon.name = item.classList.contains('open') ? 'chevron-up-outline' : 'chevron-down-outline';
            }
        });

        // Asegurar que el logo y el inicio del catálogo también funcionen con el nuevo esquema
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.vb-back-home, .logo a');
            if (target && !detailsScreen.classList.contains('vb-hidden')) {
                vdSwitchScreen('home');
            }
        });
    }

    // Inicializar Fase 2
    if (document.getElementById('product-details')) {
        vdInitDetails();
    }

    // --- NUEVA LÓGICA PARA CONTACTO (FASE 3) ---
    function vcInitContact() {
        const catalogScreen = document.getElementById('catalog-screen');
        const detailsScreen = document.getElementById('product-details');
        const contactScreen = document.getElementById('contact-screen');
        const homeSections = document.querySelectorAll('main > section:not(#catalog-screen):not(#product-details):not(#contact-screen)');

        function vcSwitchScreen(screenId) {
            console.log("Contact Logic: Switching to", screenId);
            // Ocultar todo
            [catalogScreen, detailsScreen, contactScreen].forEach(s => s.classList.add('vb-hidden'));
            homeSections.forEach(s => s.classList.add('vb-hidden'));

            // Mostrar el solicitado
            if (screenId === 'catalog') {
                catalogScreen.classList.remove('vb-hidden');
            } else if (screenId === 'details') {
                detailsScreen.classList.remove('vb-hidden');
            } else if (screenId === 'contact') {
                contactScreen.classList.remove('vb-hidden');
            } else {
                homeSections.forEach(s => s.classList.remove('vb-hidden'));
            }
            window.scrollTo(0, 0);
        }

        // Navegación específica para Contacto
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button');
            if (!target) return;

            const text = target.innerText.toLowerCase();
            const href = target.getAttribute('href');

            // Detectar clics en "Sobre Nosotros" o "Contacto" del footer
            if (text.includes('contacto') || text.includes('sobre nosotros') || href === '#contacto') {
                e.preventDefault();
                vcSwitchScreen('contact');
            }

            // Integrar botón "Custom Orders" del menú (si se agrega)
            if (text.includes('custom orders')) {
                e.preventDefault();
                vcSwitchScreen('contact');
            }
        });

        // Manejo del Formulario
        const contactForm = document.getElementById('vc-contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const feedback = document.getElementById('vc-form-feedback');
                const btn = this.querySelector('.vc-submit-btn');

                // Efecto visual
                btn.innerText = 'Enviando...';
                btn.disabled = true;

                setTimeout(() => {
                    btn.innerText = 'Enviar de Nuevo';
                    btn.disabled = false;
                    feedback.classList.remove('vb-hidden');
                    contactForm.reset();

                    // Ocultar feedback después de unos segundos
                    setTimeout(() => {
                        feedback.classList.add('vb-hidden');
                    }, 5000);
                }, 1500);
            });
        }
    }

    // Inicializar Fase 3
    if (document.getElementById('contact-screen')) {
        vcInitContact();
    }
});
