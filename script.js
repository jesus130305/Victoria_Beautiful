document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = mobileBtn.querySelector('ion-icon');
            if (nav.classList.contains('active')) {
                icon.name = 'close-outline';
            } else {
                icon.name = 'menu-outline';
            }
        });
    }

    // Mobile Submenu Toggle (Accordion) & Desktop Catalog Navigation
    const dropdownItems = document.querySelectorAll('.dropdown-item > a');
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Mobile/Tablet: Toggle Submenu
            if (window.innerWidth <= 992) {
                const parent = item.parentElement;
                if (parent.querySelector('.mega-menu')) {
                    e.preventDefault();
                    parent.classList.toggle('active');
                }
            } else {
                // Desktop: Navigate to Catalog
                let targetId = item.getAttribute('data-target');
                const text = item.innerText.toLowerCase();

                if (!targetId) {
                    if (text.includes('box')) targetId = 'product-catalog';
                    else if (text.includes('ramos')) targetId = 'ramos-catalog';
                    else if (text.includes('accesorios')) targetId = 'accesorios-catalog';
                }

                if (targetId) {
                    e.preventDefault();
                    console.log("Header Link Clicked (Desktop):", targetId);

                    if (typeof switchCatalog === 'function') {
                        switchCatalog(targetId);
                    }
                }
            }
        });
    });

    // Helper to force scroll to top (Global)
    window.forceScrollToTop = function () {
        if (document.activeElement) {
            document.activeElement.blur(); // Prevent focus scrolling
        }
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        // Double check after layout update
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 10);
    }

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

    // Smooth scroll for nav links removed to prevent conflict with switchCatalog
    // document.querySelectorAll('a[href^="#"]').forEach(anchor => { ... });

    // Reveal animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product-card, .feature-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // --- NUEVA LÓGICA PARA DETALLES DEL PRODUCTO (FASE 2) ---
    function vdInitDetails() {
        const catalogScreen = document.getElementById('product-catalog');
        const detailsScreen = document.getElementById('product-details');
        const homeSections = document.querySelectorAll('main > section:not(#product-catalog):not(#product-details)');

        function vdSwitchScreen(screenId) {
            console.log("Details Logic: Switching to", screenId);
            // Ocultar todo
            if (catalogScreen) catalogScreen.classList.add('vb-hidden');
            if (detailsScreen) detailsScreen.classList.add('vb-hidden');
            homeSections.forEach(s => s.classList.add('vb-hidden'));

            // Mostrar el solicitado
            if (screenId === 'catalog' && catalogScreen) {
                catalogScreen.classList.remove('vb-hidden');
            } else if (screenId === 'details' && detailsScreen) {
                detailsScreen.classList.remove('vb-hidden');
            } else {
                homeSections.forEach(s => s.classList.remove('vb-hidden'));
            }
            window.scrollTo(0, 0);
        }

        function vdPopulateDetails(data) {
            const nameEl = document.getElementById('vd-product-name');
            const breadEl = document.getElementById('vd-breadcrumb-name');
            const priceEl = document.getElementById('vd-product-price');
            const imgEl = document.getElementById('vd-product-img');

            if (nameEl) nameEl.innerText = data.name;
            if (breadEl) breadEl.innerText = data.name;
            if (priceEl) priceEl.innerText = data.price;
            if (imgEl) imgEl.src = data.img;

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
                if (icon) {
                    icon.name = item.classList.contains('open') ? 'chevron-up-outline' : 'chevron-down-outline';
                }
            }
        });

        // Asegurar que el logo y el inicio del catálogo también funcionen con el nuevo esquema
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.vb-back-home, .logo a');
            if (target && detailsScreen && !detailsScreen.classList.contains('vb-hidden')) {
                vdSwitchScreen('home');
            }
        });
        // Expose functions globally for handleVerDetalle
        window.vdPopulateDetails = vdPopulateDetails;
        window.vdSwitchScreen = vdSwitchScreen;
    }

    // Inicializar Fase 2
    if (document.getElementById('product-details')) {
        vdInitDetails();
    }

    // --- NUEVA LÓGICA PARA CONTACTO (FASE 3) ---
    function vcInitContact() {
        const detailsScreen = document.getElementById('product-details');
        const contactScreen = document.getElementById('contact-screen');
        const homeSections = document.querySelectorAll('main > section:not(#product-catalog):not(#product-details):not(#contact-screen)');

        function vcSwitchScreen(screenId) {
            console.log("Contact Logic: Switching to", screenId);
            // Ocultar todo
            [detailsScreen, contactScreen].forEach(s => s && s.classList.add('vb-hidden'));
            homeSections.forEach(s => s.classList.add('vb-hidden'));

            // Mostrar el solicitado
            if (screenId === 'catalog') {
                homeSections.forEach(s => s.classList.remove('vb-hidden'));
            } else if (screenId === 'details' && detailsScreen) {
                detailsScreen.classList.remove('vb-hidden');
            } else if (screenId === 'contact' && contactScreen) {
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

            // Integrar botón "Custom Orders" del menú
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
                    if (feedback) feedback.classList.remove('vb-hidden');
                    contactForm.reset();

                    // Ocultar feedback después de unos segundos
                    setTimeout(() => {
                        if (feedback) feedback.classList.add('vb-hidden');
                    }, 50000);
                }, 1500);
            });
        }
    }

    // Inicializar Fase 3
    if (document.getElementById('contact-screen')) {
        vcInitContact();
    }
});

// --- NUEVA LÓGICA PARA EL CATÁLOGO DE PRODUCTOS ---

const catalogProducts = {
    'desayunos': [
        {
            name: "Box Desayuno Amanecer",
            price: "S/85.00",
            img: "assets/box-desayuno.jpg",
            category: "Box Desayunos"
        },
        {
            name: "Box Desayuno Premium",
            price: "S/120.00",
            img: "assets/box-desayuno.jpg",
            category: "Box Desayunos"
        },
        {
            name: "Box Desayuno Sorpresa",
            price: "S/95.00",
            img: "assets/box-desayuno.jpg",
            category: "Box Desayunos"
        }
    ],
    'antojitos': [
        {
            name: "Box Antojitos Salados",
            price: "S/45.00",
            img: "assets/box-piqueo-cumpleanero.png",
            category: "Box Antojitos al Paso"
        },
        {
            name: "Box Piqueo Snack",
            price: "S/35.00",
            img: "assets/box-piqueo-cumpleanero.png",
            category: "Box Antojitos al Paso"
        }
    ],
    'dulces': [
        {
            name: "Box Dulce Tentación",
            price: "S/55.00",
            img: "assets/ramo-rosas-bombones-1.png",
            category: "Box Dulces"
        },
        {
            name: "Mega Box Dulce",
            price: "S/80.00",
            img: "assets/ramo-rosas-bombones-2.png",
            category: "Box Dulces"
        }
    ],
    'dulces-fotos': [
        {
            name: "Box Recuerdos Dulces",
            price: "S/65.00",
            img: "assets/box-personalizado.png",
            category: "Box Dulces con Fotos"
        },
        {
            name: "Box Galería Premium",
            price: "S/90.00",
            img: "assets/box-personalizado.png",
            category: "Box Dulces con Fotos"
        }
    ],
    'personajes': [
        {
            name: "Box Disney Magic",
            price: "S/110.00",
            img: "assets/ramo-maquillaje-minnie-1.png",
            category: "Box Personajes"
        },
        {
            name: "Box Superhero Edition",
            price: "S/115.00",
            img: "assets/ramo-maquillaje-minnie-2.png",
            category: "Box Personajes"
        }
    ],
    'donas': [
        {
            name: "Box Mini Donas Festivas",
            price: "S/40.00",
            img: "assets/box-personalizado.png",
            category: "Box Mini Donas"
        },
        {
            name: "Pack 12 Donas Decoradas",
            price: "S/60.00",
            img: "assets/box-personalizado.png",
            category: "Box Mini Donas"
        }
    ],
    'fresas': [
        {
            name: "Box Fresas con Glamour",
            price: "S/75.00",
            img: "assets/box-fresas-san-valentin.png",
            category: "Box Fresas"
        },
        {
            name: "Fantasía de Fresas",
            price: "S/90.00",
            img: "assets/box-fresas-san-valentin.png",
            category: "Box Fresas"
        }
    ]
};

function initCatalog() {
    const catalogGrid = document.getElementById('catalog-grid');
    const noProductsMsg = document.getElementById('no-products-msg');
    const categoryBtns = document.querySelectorAll('.cat-btn');

    if (!catalogGrid) return;

    function renderProducts(category) {
        // Clear grid
        catalogGrid.innerHTML = '';
        const products = catalogProducts[category] || [];

        if (products.length === 0) {
            catalogGrid.classList.add('vb-hidden');
            if (noProductsMsg) noProductsMsg.classList.remove('vb-hidden');
            return;
        }

        catalogGrid.classList.remove('vb-hidden');
        if (noProductsMsg) noProductsMsg.classList.add('vb-hidden');

        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card animate';
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="product-image" onclick="handleVerDetalle('${product.name}', '${product.price}', '${product.img}')" style="cursor: pointer;">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <span class="badge badge-pink">${product.category}</span>
                    <h3>${product.name}</h3>
                    <div class="product-meta">
                        <span class="price">${product.price}</span>
                    </div>
                    <button class="btn-ver-detalle" onclick="handleVerDetalle('${product.name}', '${product.price}', '${product.img}')">
                        Ver detalle
                    </button>
                </div>
            `;
            catalogGrid.appendChild(card);
        });
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Catalog: Category clicked", btn.getAttribute('data-categoria'));

            // Update active state
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Render products
            const category = btn.getAttribute('data-categoria');
            renderProducts(category);

            // Scroll to top
            if (typeof forceScrollToTop === 'function') {
                forceScrollToTop();
            } else {
                window.scrollTo(0, 0);
            }
        });
    });

    // --- ARQUITECTURA DE CATÁLOGOS ACTIVADOS POR CLICK ---
    const catalogSections = {
        'product-catalog': document.getElementById('product-catalog'),
        'ramos-catalog': document.getElementById('ramos-catalog'),
        'accesorios-catalog': document.getElementById('accesorios-catalog'),
        'skincare-catalog': document.getElementById('skincare-catalog'),
        'perfumes-catalog': document.getElementById('perfumes-catalog'),
        'maquillaje-catalog': document.getElementById('maquillaje-catalog')
    };

    window.switchCatalog = function (targetId, subCategory = null, scroll = true) {
        console.log("Switching Catalog to:", targetId, "Sub:", subCategory);

        // 1. Ocultar Hero y Pantallas de Detalles/Contacto
        const heroSection = document.querySelector('.hero');
        if (heroSection) heroSection.classList.add('vb-hidden');

        const detailsScreen = document.getElementById('product-details');
        if (detailsScreen) detailsScreen.classList.add('vb-hidden');

        const contactScreen = document.getElementById('contact-screen');
        if (contactScreen) contactScreen.classList.add('vb-hidden');

        // Hide other Home sections (Boxes & Why Choose)
        const boxesSection = document.getElementById('boxes');
        if (boxesSection) boxesSection.classList.add('vb-hidden');

        const whyChooseSection = document.querySelector('.why-choose');
        if (whyChooseSection) whyChooseSection.classList.add('vb-hidden');

        // 2. Gestionar visibilidad de los catálogos
        Object.keys(catalogSections).forEach(id => {
            if (catalogSections[id]) {
                if (id === targetId) {
                    catalogSections[id].classList.remove('vb-hidden');
                } else {
                    catalogSections[id].classList.add('vb-hidden');
                }
            }
        });

        // 3. Deep-link subcategory if provided
        if (subCategory) {
            const selector = `.cat-btn[data-categoria="${subCategory}"], .cat-btn-ramos[data-categoria="${subCategory}"], .cat-btn-accesorios[data-categoria="${subCategory}"], .cat-btn-skincare[data-categoria="${subCategory}"], .cat-btn-perfumes[data-categoria="${subCategory}"], .cat-btn-maquillaje[data-categoria="${subCategory}"]`;
            const subBtn = document.querySelector(selector);
            if (subBtn) {
                subBtn.click();
            }
        }

        // 4. Save state
        localStorage.setItem('selectedCatalog', targetId);

        // 5. Scroll
        if (scroll) {
            if (typeof forceScrollToTop === 'function') {
                forceScrollToTop();
            } else {
                window.scrollTo(0, 0);
            }
        }
    };

    // Global function to return to home from catalog breadcrumbs
    window.showHome = function () {
        console.log("Returning Home...");

        // Show home sections
        const heroSection = document.querySelector('.hero');
        if (heroSection) heroSection.classList.remove('vb-hidden');

        const boxesSection = document.getElementById('boxes');
        if (boxesSection) boxesSection.classList.remove('vb-hidden');

        const whyChooseSection = document.querySelector('.why-choose');
        if (whyChooseSection) whyChooseSection.classList.remove('vb-hidden');

        // Hide all catalogs
        const catalogSections = [
            'product-catalog', 'ramos-catalog', 'accesorios-catalog',
            'skincare-catalog', 'perfumes-catalog', 'maquillaje-catalog'
        ];
        catalogSections.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('vb-hidden');
        });

        // Hide details and contact
        const detailsScreen = document.getElementById('product-details');
        if (detailsScreen) detailsScreen.classList.add('vb-hidden');

        const contactScreen = document.getElementById('contact-screen');
        if (contactScreen) contactScreen.classList.add('vb-hidden');

        // Remove state from localStorage
        localStorage.removeItem('selectedCatalog');

        // Scroll to top
        if (typeof forceScrollToTop === 'function') {
            forceScrollToTop();
        } else {
            window.scrollTo(0, 0);
        }
    };

    // --- INTEGRACIÓN CON MENU SUPERIOR ---
    const megaMenuLinks = document.querySelectorAll('.mega-menu a');
    megaMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Always prevent default scroll/hash change

            // Close Mobile Menu if open
            const nav = document.querySelector('.nav');
            const mobileBtn = document.querySelector('.mobile-menu-btn');
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                if (mobileBtn) {
                    const icon = mobileBtn.querySelector('ion-icon');
                    if (icon) icon.name = 'menu-outline';
                }
            }

            const text = link.innerText.toLowerCase();
            let categoryToMatch = '';
            let targetCatalogId = '';

            // Lógica para determinar el catálogo y la categoría
            if (text.includes('desayunos')) { categoryToMatch = 'desayunos'; targetCatalogId = 'product-catalog'; }
            else if (text.includes('antojitos')) { categoryToMatch = 'antojitos'; targetCatalogId = 'product-catalog'; }
            else if (text.includes('dulces') && !text.includes('fotos')) { categoryToMatch = 'dulces'; targetCatalogId = 'product-catalog'; }
            else if (text.includes('fotos') && !text.includes('ramos')) { categoryToMatch = 'dulces-fotos'; targetCatalogId = 'product-catalog'; }
            else if (text.includes('personajes')) { categoryToMatch = 'personajes'; targetCatalogId = 'product-catalog'; }
            else if (text.includes('donas')) { categoryToMatch = 'donas'; targetCatalogId = 'product-catalog'; }
            else if (text.includes('fresas')) { categoryToMatch = 'fresas'; targetCatalogId = 'product-catalog'; }

            // Lógica para Ramos
            else if (text.includes('maquillaje')) { categoryToMatch = 'ramos-maquillaje'; targetCatalogId = 'ramos-catalog'; }
            else if (text.includes('skincare')) { categoryToMatch = 'ramos-skincare'; targetCatalogId = 'ramos-catalog'; }
            else if (text.includes('ramos de fotos') || text.includes('ramos con fotos')) { categoryToMatch = 'ramos-dulces'; targetCatalogId = 'ramos-catalog'; }
            else if (text.includes('eterna')) { categoryToMatch = 'ramos-eternos'; targetCatalogId = 'ramos-catalog'; }
            else if (text.includes('hot wheels')) { categoryToMatch = 'ramos-hotwheels'; targetCatalogId = 'ramos-catalog'; }
            else if (text.includes('peluche')) { categoryToMatch = 'ramos-peluches'; targetCatalogId = 'ramos-catalog'; }

            // Lógica para Accesorios
            else if (text.includes('espejo') && text.includes('cartera')) { categoryToMatch = 'espejos-cartera'; targetCatalogId = 'accesorios-catalog'; }
            else if (text.includes('led')) { categoryToMatch = 'espejos-led'; targetCatalogId = 'accesorios-catalog'; }

            // Lógica para Skincare
            else if (text.includes('crema de manos')) { categoryToMatch = 'crema-manos'; targetCatalogId = 'skincare-catalog'; }
            else if (text.includes('exfoliantes')) { categoryToMatch = 'exfoliantes'; targetCatalogId = 'skincare-catalog'; }
            else if (text.includes('limpiador facial')) { categoryToMatch = 'limpiador-facial'; targetCatalogId = 'skincare-catalog'; }
            else if (text.includes('jabón facial')) { categoryToMatch = 'jabon-facial'; targetCatalogId = 'skincare-catalog'; }
            else if (text.includes('vincha skincare')) { categoryToMatch = 'vincha-skincare'; targetCatalogId = 'skincare-catalog'; }
            else if (text.includes('puntos negros')) { categoryToMatch = 'puntos-negros'; targetCatalogId = 'skincare-catalog'; }
            else if (text.includes('ojeras')) { categoryToMatch = 'mascarilla-ojeras'; targetCatalogId = 'skincare-catalog'; }
            else if (text.includes('labios')) { categoryToMatch = 'mascarilla-labios'; targetCatalogId = 'skincare-catalog'; }
            else if (text.includes('mascarilla facial')) { categoryToMatch = 'mascarilla-facial'; targetCatalogId = 'skincare-catalog'; }
            else if (text.includes('exfoliador de silicona')) { categoryToMatch = 'exfoliador-silicona'; targetCatalogId = 'skincare-catalog'; }
            else if (text.includes('masajeadores')) { categoryToMatch = 'masajeadores'; targetCatalogId = 'skincare-catalog'; }

            // Lógica para Perfumes
            else if (text.includes('mini perfumes')) { categoryToMatch = 'mini-perfumes'; targetCatalogId = 'perfumes-catalog'; }
            else if (text.includes('colonias refrescantes')) { categoryToMatch = 'colonias-refrescantes'; targetCatalogId = 'perfumes-catalog'; }
            else if (text.includes('colonias shimmer')) { categoryToMatch = 'colonias-shimmer'; targetCatalogId = 'perfumes-catalog'; }
            else if (text.includes('colonias con crema')) { categoryToMatch = 'pack-colonias'; targetCatalogId = 'perfumes-catalog'; }

            // Lógica para Maquillaje
            else if (text.includes('labiales líquidos')) { categoryToMatch = 'labiales-liquidos'; targetCatalogId = 'maquillaje-catalog'; }
            else if (text.includes('labiales en barra')) { categoryToMatch = 'labiales-barra'; targetCatalogId = 'maquillaje-catalog'; }
            else if (text.includes('lip gloss')) { categoryToMatch = 'lip-gloss'; targetCatalogId = 'maquillaje-catalog'; }
            else if (text.includes('bálsamo labial')) { categoryToMatch = 'balsamo-labial'; targetCatalogId = 'maquillaje-catalog'; }
            else if (text.includes('labiales tinta')) { categoryToMatch = 'labiales-tinta'; targetCatalogId = 'maquillaje-catalog'; }
            else if (text.includes('rubores')) { categoryToMatch = 'rubores'; targetCatalogId = 'maquillaje-catalog'; }
            else if (text.includes('sombras para ojos')) { categoryToMatch = 'sombras-ojos'; targetCatalogId = 'maquillaje-catalog'; }
            else if (text.includes('sombras para cejas')) { categoryToMatch = 'sombras-cejas'; targetCatalogId = 'maquillaje-catalog'; }
            else if (text.includes('delineador de ojos')) { categoryToMatch = 'delineador-ojos'; targetCatalogId = 'maquillaje-catalog'; }
            else if (text.includes('iluminadores')) { categoryToMatch = 'iluminadores'; targetCatalogId = 'maquillaje-catalog'; }
            else if (text.includes('polvo de hadas')) { categoryToMatch = 'polvo-hadas'; targetCatalogId = 'maquillaje-catalog'; }
            else if (text.includes('polvo compacto')) { categoryToMatch = 'polvo-compacto'; targetCatalogId = 'maquillaje-catalog'; }
            else if (text.includes('correctores')) { categoryToMatch = 'correctores'; targetCatalogId = 'maquillaje-catalog'; }
            else if (text.includes('esmaltes')) { categoryToMatch = 'esmaltes'; targetCatalogId = 'maquillaje-catalog'; }
            else if (text.includes('rizadores')) { categoryToMatch = 'rizadores'; targetCatalogId = 'maquillaje-catalog'; }
            else if (text.includes('brochas')) { categoryToMatch = 'brochas'; targetCatalogId = 'maquillaje-catalog'; }

            if (categoryToMatch && targetCatalogId) {
                console.log("MegaMenu: Match found", categoryToMatch, "in", targetCatalogId);
                switchCatalog(targetCatalogId, categoryToMatch);
            } else {
                console.log("MegaMenu: No direct match found for", text);
            }
        });
    });

    renderProducts('desayunos');
}

// Global function for "Ver detalle" to integrate with Fase 2 logic
window.handleVerDetalle = function (name, price, img) {
    if (typeof vdPopulateDetails === 'function') {
        vdPopulateDetails({ name, price, img });
        if (typeof vdSwitchScreen === 'function') {
            vdSwitchScreen('details');
        }
    } else {
        console.log("Details functionality not available yet", { name, price, img });
    }
};

const ramosProducts = {
    'ramos-maquillaje': [
        {
            name: "Ramo Minnie & Mickey",
            price: "S/70.00",
            img: "assets/ramo-maquillaje-minnie-1.png",
            desc: "Sombras, labiales, delineador y esmalte.",
            category: "Ramos de Maquillaje"
        },
        {
            name: "Ramo Maquillaje Glamour",
            price: "S/80.00",
            img: "assets/ramo-maquillaje-2.png",
            desc: "Brochas sirenita, labial gloss, paleta de rubores.",
            category: "Ramos de Maquillaje"
        },
        {
            name: "Ramo Maquillaje Niña",
            price: "S/55.00",
            img: "assets/ramo-maquillaje-nina.png",
            desc: "3 Brillos labiales, vincha Minnie, espejo y dulces.",
            category: "Ramos de Maquillaje"
        }
    ],
    'ramos-skincare': [
        {
            name: "Ramo Skincare Relax",
            price: "S/40.00",
            img: "assets/ramo-skincare-1.png",
            desc: "Mascarilla facial, parches ojeras y labios.",
            category: "Ramos de Skincare"
        },
        {
            name: "Ramo Spa Facial",
            price: "S/60.00",
            img: "assets/ramo-skincare-2.png",
            desc: "Limpiador, vincha skincare y mascarillas premium.",
            category: "Ramos de Skincare"
        }
    ],
    'ramos-dulces': [
        {
            name: "Ramo Dulce Recuerdo",
            price: "S/65.00",
            img: "assets/ramo-maquillaje-3.png",
            desc: "Combinación de dulces premium y fotos personalizadas.",
            category: "Ramos de Fotos y Dulces"
        },
        {
            name: "Ramo Chocofotos",
            price: "S/50.00",
            img: "assets/ramo-maquillaje-2.png",
            desc: "Chocolates variados y polaroids impresas.",
            category: "Ramos de Fotos y Dulces"
        }
    ],
    'ramos-eternos': [
        {
            name: "Ramo Rosas & Bombones",
            price: "S/60.00",
            img: "assets/ramo-rosas-bombones-1.png",
            desc: "Rosas eternas artesanales and bombones de lujo.",
            category: "Rosas Eternas"
        },
        {
            name: "Ramo Eterno Premium",
            price: "S/85.00",
            img: "assets/ramo-rosas-bombones-2.png",
            desc: "Arreglo grande con rosas de tela y chocolates.",
            category: "Rosas Eternas"
        }
    ],
    'ramos-hotwheels': [
        {
            name: "Ramo Hot Wheels Speed",
            price: "S/120.00",
            img: "assets/ramo-maquillaje-2.png",
            desc: "4 Carritos originales y dulces surtidos.",
            category: "Ramos Hot Wheels"
        },
        {
            name: "Ramo Coleccionista",
            price: "S/150.00",
            img: "assets/ramo-maquillaje-3.png",
            desc: "Edición especial con pista y carritos premium.",
            category: "Ramos Hot Wheels"
        }
    ],
    'ramos-peluches': [
        {
            name: "Ramo Osito & Dulces",
            price: "S/75.00",
            img: "assets/ramo-maquillaje-nina.png",
            desc: "Peluche de felpa suave con canasta de dulces.",
            category: "Ramos con Peluches"
        },
        {
            name: "Ramo Abrazo Dulce",
            price: "S/95.00",
            img: "assets/ramo-maquillaje-2.png",
            desc: "Peluche grande y selección de chocolates importados.",
            category: "Ramos con Peluches"
        }
    ]
};

function initRamosCatalog() {
    const ramosGrid = document.getElementById('ramos-grid');
    const noRamosMsg = document.getElementById('no-ramos-msg');
    const ramosBtns = document.querySelectorAll('.cat-btn-ramos');

    if (!ramosGrid) return;

    function renderRamos(category) {
        ramosGrid.innerHTML = '';
        const products = ramosProducts[category] || [];

        if (products.length === 0) {
            ramosGrid.classList.add('vb-hidden');
            if (noRamosMsg) noRamosMsg.classList.remove('vb-hidden');
            return;
        }

        ramosGrid.classList.remove('vb-hidden');
        if (noRamosMsg) noRamosMsg.classList.add('vb-hidden');

        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card animate';
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="product-image" onclick="handleVerDetalle('${product.name}', '${product.price}', '${product.img}')" style="cursor: pointer;">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <span class="badge badge-pink">${product.category}</span>
                    <h3>${product.name}</h3>
                    <p class="product-details" style="display:block; margin-bottom: 10px;">${product.desc}</p>
                    <div class="product-meta">
                        <span class="price">${product.price}</span>
                    </div>
                    <button class="btn-ver-detalle" onclick="handleVerDetalle('${product.name}', '${product.price}', '${product.img}')">
                        Personalizar
                    </button>
                </div>
            `;
            ramosGrid.appendChild(card);
        });
    }

    ramosBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            ramosBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-categoria');
            renderRamos(category);

            if (typeof forceScrollToTop === 'function') {
                forceScrollToTop();
            } else {
                window.scrollTo(0, 0);
            }
        });
    });

    renderRamos('ramos-maquillaje');
}

const accesoriosProducts = {
    'espejos-cartera': [
        {
            name: "Espejo Glam Mini",
            price: "S/15.00",
            img: "assets/espejo-cartera-1.png",
            desc: "Doble cara (normal y aumento), diseño floral elegante.",
            category: "Espejos Cartera"
        },
        {
            name: "Espejo Minimal Rose",
            price: "S/12.00",
            img: "assets/espejo-cartera-2.png",
            desc: "Ultra delgado, acabado metálico oro rosa.",
            category: "Espejos Cartera"
        }
    ],
    'espejos-led': [
        {
            name: "Espejo LED Touch",
            price: "S/45.00",
            img: "assets/espejo-led-1.png",
            desc: "Luz ajustable, rotación 180°, base organizadora.",
            category: "Espejos LED"
        },
        {
            name: "Espejo Hollywood Slim",
            price: "S/85.00",
            img: "assets/espejo-led-2.png",
            desc: "Carga USB, espejo de alta definición y luz cálida/fría.",
            category: "Espejos LED"
        }
    ]
};

function initAccesoriosCatalog() {
    const accesoriosGrid = document.getElementById('accesorios-grid');
    const noAccesoriosMsg = document.getElementById('no-accesorios-msg');
    const accesoriosBtns = document.querySelectorAll('.cat-btn-accesorios');

    if (!accesoriosGrid) return;

    function renderAccesorios(category) {
        accesoriosGrid.innerHTML = '';
        const products = accesoriosProducts[category] || [];

        if (products.length === 0) {
            accesoriosGrid.classList.add('vb-hidden');
            if (noAccesoriosMsg) noAccesoriosMsg.classList.remove('vb-hidden');
            return;
        }

        accesoriosGrid.classList.remove('vb-hidden');
        if (noAccesoriosMsg) noAccesoriosMsg.classList.add('vb-hidden');

        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card animate';
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="product-image" onclick="handleVerDetalle('${product.name}', '${product.price}', '${product.img}')" style="cursor: pointer;">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <span class="badge badge-pink">${product.category}</span>
                    <h3>${product.name}</h3>
                    <p class="product-details" style="display:block; margin-bottom: 10px;">${product.desc}</p>
                    <div class="product-meta">
                        <span class="price">${product.price}</span>
                    </div>
                    <button class="btn-ver-detalle" onclick="handleVerDetalle('${product.name}', '${product.price}', '${product.img}')">
                        Agregar
                    </button>
                </div>
            `;
            accesoriosGrid.appendChild(card);
        });
    }

    accesoriosBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            accesoriosBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-categoria');
            renderAccesorios(category);

            if (typeof forceScrollToTop === 'function') {
                forceScrollToTop();
            } else {
                window.scrollTo(0, 0);
            }
        });
    });

    renderAccesorios('espejos-cartera');
}

const skincareProducts = {
    'crema-manos': [
        {
            name: "Crema de Manos Seda",
            price: "S/18.00",
            img: "assets/ramo-skincare-1.png",
            desc: "Hidratación profunda con aroma a jazmín.",
            category: "Crema de Manos"
        },
        {
            name: "Pack Cremas Mini",
            price: "S/45.00",
            img: "assets/ramo-skincare-2.png",
            desc: "Trío de cremas para llevar en la cartera.",
            category: "Crema de Manos"
        }
    ],
    'exfoliantes': [
        {
            name: "Exfoliante de Café",
            price: "S/25.00",
            img: "assets/ramo-skincare-1.png",
            desc: "Revitaliza tu piel con granos de café orgánico.",
            category: "Exfoliantes"
        }
    ],
    'limpiador-facial': [
        {
            name: "Limpiador Espuma Suave",
            price: "S/32.00",
            img: "assets/ramo-skincare-2.png",
            desc: "Limpieza profunda sin resecar la piel.",
            category: "Limpiador Facial"
        }
    ],
    'jabon-facial': [
        {
            name: "Jabón de Avena",
            price: "S/15.00",
            img: "assets/ramo-skincare-1.png",
            desc: "Ideal para pieles sensibles y delicadas.",
            category: "Jabón Facial"
        }
    ],
    'vincha-skincare': [
        {
            name: "Vincha Bunny Soft",
            price: "S/12.00",
            img: "assets/ramo-maquillaje-nina.png",
            desc: "Suave y cómoda para tu rutina diaria.",
            category: "Vincha Skincare"
        }
    ],
    'puntos-negros': [
        {
            name: "Mascarilla Carbón Activo",
            price: "S/20.00",
            img: "assets/ramo-skincare-2.png",
            desc: "Elimina impurezas y puntos negros eficazmente.",
            category: "Puntos Negros"
        }
    ],
    'mascarilla-ojeras': [
        {
            name: "Parches de Colágeno Oro",
            price: "S/8.00",
            img: "assets/ramo-skincare-1.png",
            desc: "Reduce bolsas y ojeras en minutos.",
            category: "Mascarilla Ojeras"
        }
    ],
    'mascarilla-labios': [
        {
            name: "Mascarilla de Cereza",
            price: "S/7.00",
            img: "assets/ramo-skincare-2.png",
            desc: "Labios suaves e hidratados.",
            category: "Mascarilla Labios"
        }
    ],
    'mascarilla-facial': [
        {
            name: "Mascarilla Velo Hialurónico",
            price: "S/10.00",
            img: "assets/ramo-skincare-1.png",
            desc: "Hidratación intensiva inmediata.",
            category: "Mascarilla Facial"
        }
    ],
    'exfoliador-silicona': [
        {
            name: "Pulpito Exfoliador",
            price: "S/15.00",
            img: "assets/ramo-skincare-2.png",
            desc: "Masajea y limpia profundamente tus poros.",
            category: "Exfoliador Silicona"
        }
    ],
    'masajeadores': [
        {
            name: "Rodillo de Jade & Gua Sha",
            price: "S/55.00",
            img: "assets/ramo-skincare-1.png",
            desc: "Set premium para drenaje linfático facial.",
            category: "Masajeadores"
        }
    ]
};

function initSkincareCatalog() {
    const skincareGrid = document.getElementById('skincare-grid');
    const noSkincareMsg = document.getElementById('no-skincare-msg');
    const skincareBtns = document.querySelectorAll('.cat-btn-skincare');

    if (!skincareGrid) return;

    function renderSkincare(category) {
        skincareGrid.innerHTML = '';
        const products = skincareProducts[category] || [];

        if (products.length === 0) {
            skincareGrid.classList.add('vb-hidden');
            if (noSkincareMsg) noSkincareMsg.classList.remove('vb-hidden');
            return;
        }

        skincareGrid.classList.remove('vb-hidden');
        if (noSkincareMsg) noSkincareMsg.classList.add('vb-hidden');

        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card animate';
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="product-image" onclick="handleVerDetalle('${product.name}', '${product.price}', '${product.img}')" style="cursor: pointer;">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <span class="badge badge-pink">${product.category}</span>
                    <h3>${product.name}</h3>
                    <p class="product-details" style="display:block; margin-bottom: 10px;">${product.desc}</p>
                    <div class="product-meta">
                        <span class="price">${product.price}</span>
                    </div>
                    <button class="btn-ver-detalle" onclick="handleVerDetalle('${product.name}', '${product.price}', '${product.img}')">
                        Agregar
                    </button>
                </div>
            `;
            skincareGrid.appendChild(card);
        });
    }

    skincareBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            skincareBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-categoria');
            renderSkincare(category);

            if (typeof forceScrollToTop === 'function') {
                forceScrollToTop();
            } else {
                window.scrollTo(0, 0);
            }
        });
    });

    renderSkincare('crema-manos');
}

const perfumesProducts = {
    'mini-perfumes': [
        {
            name: "Mini Perfume Floral",
            price: "S/35.00",
            img: "assets/ramo-maquillaje-nina.png",
            desc: "Fragancia ligera con notas de jazmín y rosas.",
            category: "Mini Perfumes"
        },
        {
            name: "Mini Perfume Sweet",
            price: "S/35.00",
            img: "assets/ramo-maquillaje-nina.png",
            desc: "Toque dulce de vainilla y caramelo.",
            category: "Mini Perfumes"
        }
    ],
    'colonias-refrescantes': [
        {
            name: "Colonia Brisa Marina",
            price: "S/28.00",
            img: "assets/ramo-skincare-1.png",
            desc: "Refrescante y energizante para uso diario.",
            category: "Colonias Refrescantes"
        }
    ],
    'colonias-shimmer': [
        {
            name: "Colonia Gold Shimmer",
            price: "S/42.00",
            img: "assets/ramo-skincare-2.png",
            desc: "Fragancia con destellos dorados para tu piel.",
            category: "Colonias Shimmer"
        }
    ],
    'pack-colonias': [
        {
            name: "Pack Dúo Elegance",
            price: "S/65.00",
            img: "assets/ramo-skincare-1.png",
            desc: "Colonia y crema hidratante con el mismo aroma.",
            category: "Pack Colonias"
        }
    ]
};

function initPerfumesCatalog() {
    const perfumesGrid = document.getElementById('perfumes-grid');
    const noPerfumesMsg = document.getElementById('no-perfumes-msg');
    const perfumesBtns = document.querySelectorAll('.cat-btn-perfumes');

    if (!perfumesGrid) return;

    function renderPerfumes(category) {
        perfumesGrid.innerHTML = '';
        const products = perfumesProducts[category] || [];

        if (products.length === 0) {
            perfumesGrid.classList.add('vb-hidden');
            if (noPerfumesMsg) noPerfumesMsg.classList.remove('vb-hidden');
            return;
        }

        perfumesGrid.classList.remove('vb-hidden');
        if (noPerfumesMsg) noPerfumesMsg.classList.add('vb-hidden');

        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card animate';
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="product-image" onclick="handleVerDetalle('${product.name}', '${product.price}', '${product.img}')" style="cursor: pointer;">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <span class="badge badge-pink">${product.category}</span>
                    <h3>${product.name}</h3>
                    <p class="product-details" style="display:block; margin-bottom: 10px;">${product.desc}</p>
                    <div class="product-meta">
                        <span class="price">${product.price}</span>
                    </div>
                    <button class="btn-ver-detalle" onclick="handleVerDetalle('${product.name}', '${product.price}', '${product.img}')">
                        Agregar
                    </button>
                </div>
            `;
            perfumesGrid.appendChild(card);
        });
    }

    perfumesBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            perfumesBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-categoria');
            renderPerfumes(category);

            if (typeof forceScrollToTop === 'function') {
                forceScrollToTop();
            } else {
                window.scrollTo(0, 0);
            }
        });
    });

    renderPerfumes('mini-perfumes');
}

const maquillajeProducts = {
    'labiales-liquidos': [
        {
            name: "Labial Líquido Mate",
            price: "S/25.00",
            img: "assets/ramo-maquillaje-minnie-1.png",
            desc: "Larga duración y acabado aterciopelado.",
            category: "Labiales"
        }
    ],
    'labiales-barra': [
        {
            name: "Labial en Barra Hydra",
            price: "S/20.00",
            img: "assets/ramo-maquillaje-minnie-2.png",
            desc: "Hidratación profunda con color intenso.",
            category: "Labiales"
        }
    ],
    'lip-gloss': [
        {
            name: "Brillo Labial Crystal",
            price: "S/18.00",
            img: "assets/ramo-maquillaje-2.png",
            desc: "Efecto espejo y volumen inmediato.",
            category: "Labiales"
        }
    ],
    'balsamo-labial': [
        {
            name: "Bálsamo Labial Frutal",
            price: "S/12.00",
            img: "assets/ramo-maquillaje-nina.png",
            desc: "Protección y aroma delicioso.",
            category: "Labiales"
        }
    ],
    'labiales-tinta': [
        {
            name: "Tinta de Labios Cherry",
            price: "S/22.00",
            img: "assets/ramo-maquillaje-3.png",
            desc: "Color natural que dura todo el día.",
            category: "Labiales"
        }
    ],
    'rubores': [
        {
            name: "Rubor en Crema Pink",
            price: "S/28.00",
            img: "assets/ramo-maquillaje-2.png",
            desc: "Acabado natural y fácil de difuminar.",
            category: "Maquillaje"
        }
    ],
    'sombras-ojos': [
        {
            name: "Paleta de Sombras Nude",
            price: "S/45.00",
            img: "assets/ramo-maquillaje-3.png",
            desc: "12 tonos altamente pigmentados.",
            category: "Maquillaje"
        }
    ],
    'sombras-cejas': [
        {
            name: "Kit de Sombras para Cejas",
            price: "S/20.00",
            img: "assets/ramo-maquillaje-2.png",
            desc: "Define y rellena con acabado natural.",
            category: "Maquillaje"
        }
    ],
    'delineador-ojos': [
        {
            name: "Delineador Líquido Black",
            price: "S/18.00",
            img: "assets/ramo-maquillaje-3.png",
            desc: "Punta ultra fina para trazos precisos.",
            category: "Maquillaje"
        }
    ],
    'iluminadores': [
        {
            name: "Iluminador Líquido Glow",
            price: "S/30.00",
            img: "assets/ramo-maquillaje-nina.png",
            desc: "Destellos radiantes para tu piel.",
            category: "Maquillaje"
        }
    ],
    'polvo-hadas': [
        {
            name: "Polvo de Hadas Shimmer",
            price: "S/15.00",
            img: "assets/ramo-maquillaje-2.png",
            desc: "Brillo mágico para cara y cuerpo.",
            category: "Maquillaje"
        }
    ],
    'polvo-compacto': [
        {
            name: "Polvo Compacto Mate",
            price: "S/25.00",
            img: "assets/ramo-maquillaje-3.png",
            desc: "Control de brillo y cobertura uniforme.",
            category: "Maquillaje"
        }
    ],
    'correctores': [
        {
            name: "Corrector de Alta Cobertura",
            price: "S/22.00",
            img: "assets/ramo-maquillaje-2.png",
            desc: "Oculta imperfecciones y ojeras.",
            category: "Maquillaje"
        }
    ],
    'esmaltes': [
        {
            name: "Esmalte de Uñas Gel",
            price: "S/15.00",
            img: "assets/ramo-maquillaje-3.png",
            desc: "Color vibrante y secado rápido.",
            category: "Maquillaje"
        }
    ],
    'rizadores': [
        {
            name: "Rizador de Pestañas Pro",
            price: "S/12.00",
            img: "assets/ramo-maquillaje-nina.png",
            desc: "Curvatura perfecta y duradera.",
            category: "Accesorios"
        }
    ],
    'brochas': [
        {
            name: "Set de Brochas Profesionales",
            price: "S/55.00",
            img: "assets/ramo-maquillaje-2.png",
            desc: "10 piezas de cerdas sintéticas suaves.",
            category: "Accesorios"
        }
    ]
};

function initMaquillajeCatalog() {
    const maquillajeGrid = document.getElementById('maquillaje-grid');
    const noMaquillajeMsg = document.getElementById('no-maquillaje-msg');
    const maquillajeBtns = document.querySelectorAll('.cat-btn-maquillaje');

    if (!maquillajeGrid) return;

    function renderMaquillaje(category) {
        maquillajeGrid.innerHTML = '';
        const products = maquillajeProducts[category] || [];

        if (products.length === 0) {
            maquillajeGrid.classList.add('vb-hidden');
            if (noMaquillajeMsg) noMaquillajeMsg.classList.remove('vb-hidden');
            return;
        }

        maquillajeGrid.classList.remove('vb-hidden');
        if (noMaquillajeMsg) noMaquillajeMsg.classList.add('vb-hidden');

        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card animate';
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="product-image" onclick="handleVerDetalle('${product.name}', '${product.price}', '${product.img}')" style="cursor: pointer;">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <span class="badge badge-pink">${product.category}</span>
                    <h3>${product.name}</h3>
                    <p class="product-details" style="display:block; margin-bottom: 10px;">${product.desc}</p>
                    <div class="product-meta">
                        <span class="price">${product.price}</span>
                    </div>
                    <button class="btn-ver-detalle" onclick="handleVerDetalle('${product.name}', '${product.price}', '${product.img}')">
                        Agregar
                    </button>
                </div>
            `;
            maquillajeGrid.appendChild(card);
        });
    }

    maquillajeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            maquillajeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-categoria');
            renderMaquillaje(category);

            if (typeof forceScrollToTop === 'function') {
                forceScrollToTop();
            } else {
                window.scrollTo(0, 0);
            }
        });
    });

    renderMaquillaje('labiales-liquidos');
}

// Global initialization
function globalInit() {
    initCatalog();
    initRamosCatalog();
    initAccesoriosCatalog();
    initSkincareCatalog();
    initPerfumesCatalog();
    initMaquillajeCatalog();

    // Force start at top and Hero visibility
    if (typeof forceScrollToTop === 'function') {
        forceScrollToTop();
    } else {
        window.scrollTo(0, 0);
    }

    // Ensure Hero is visible
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.classList.remove('vb-hidden');
    }

    // Restore Home sections
    const boxesSection = document.getElementById('boxes');
    if (boxesSection) boxesSection.classList.remove('vb-hidden');

    const whyChooseSection = document.querySelector('.why-choose');
    if (whyChooseSection) whyChooseSection.classList.add('vb-hidden');

    // Ensure Catalogs are hidden initially if Hero is present
    const catalogs = ['product-catalog', 'ramos-catalog', 'accesorios-catalog', 'skincare-catalog', 'perfumes-catalog', 'maquillaje-catalog'];
    catalogs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('vb-hidden');
    });

    // Ensure other screens are hidden
    const details = document.getElementById('product-details');
    if (details) details.classList.add('vb-hidden');
    const contact = document.getElementById('contact-screen');
    if (contact) contact.classList.add('vb-hidden');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', globalInit);
} else {
    globalInit();
}
