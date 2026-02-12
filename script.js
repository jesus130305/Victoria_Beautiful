document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            // Change icon based on state
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
                // Check if it has a mega-menu
                if (parent.querySelector('.mega-menu')) {
                    e.preventDefault(); // Prevent navigation
                    parent.classList.toggle('active');

                    // Optional: Close other open menus?
                    // For simple accordion, maybe not strict.
                    const megaMenu = parent.querySelector('.mega-menu');
                    if (parent.classList.contains('active')) {
                        megaMenu.classList.add('active');
                    } else {
                        megaMenu.classList.remove('active');
                    }
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

    // Smooth scroll for nav links (if they were internal)
    // Smooth scroll for nav links removed to prevent conflict with switchCatalog
    // document.querySelectorAll('a[href^="#"]').forEach(anchor => { ... });

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

});

// --- NUEVA LÓGICA PARA DETALLES DEL PRODUCTO (FASE 2) ---

// --- NUEVA LÓGICA PARA DETALLES DEL PRODUCTO (FASE 2) ---
function vdInitDetails() {
    const catalogScreen = document.getElementById('product-catalog');
    const detailsScreen = document.getElementById('product-details');
    const homeSections = document.querySelectorAll('main > section:not(#product-catalog):not(#product-details)');

    function vdSwitchScreen(screenId) {
        console.log("Details Logic: Switching to", screenId);
        // Ocultar todo
        if (catalogScreen) catalogScreen.classList.add('vb-hidden');
        detailsScreen.classList.add('vb-hidden');
        homeSections.forEach(s => s.classList.add('vb-hidden'));

        // Mostrar el solicitado
        if (screenId === 'catalog' && catalogScreen) {
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
            // No longer exists
            homeSections.forEach(s => s.classList.remove('vb-hidden'));
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
            noProductsMsg.classList.remove('vb-hidden');
            return;
        }

        catalogGrid.classList.remove('vb-hidden');
        noProductsMsg.classList.add('vb-hidden');

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
        'accesorios-catalog': document.getElementById('accesorios-catalog')
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
            const selector = `.cat-btn[data-categoria="${subCategory}"], .cat-btn-ramos[data-categoria="${subCategory}"], .cat-btn-accesorios[data-categoria="${subCategory}"]`;
            const subBtn = document.querySelector(selector);
            if (subBtn) {
                subBtn.click();
            }
        }

        // 4. Save state
        localStorage.setItem('selectedCatalog', targetId);

        // 5. Scroll
        if (scroll) {
            forceScrollToTop();
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
            else if (text.includes('fotos') && !text.includes('ramos')) { categoryToMatch = 'dulces-fotos'; targetCatalogId = 'product-catalog'; } // Ajuste para evitar confusión con ramos
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

            if (categoryToMatch && targetCatalogId) {
                console.log("MegaMenu: Match found", categoryToMatch, "in", targetCatalogId);
                switchCatalog(targetCatalogId, categoryToMatch);
            } else {
                console.log("MegaMenu: No direct match found for", text);
            }
        });
    });


    // Initial sub-render for all catalogs (so they are ready when shown)
    if (typeof renderProducts === 'function') renderProducts('desayunos');
    if (typeof renderRamos === 'function') renderRamos('ramos-maquillaje');
    if (typeof renderAccesorios === 'function') renderAccesorios('espejos-cartera');
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
            desc: "Rosas eternas artesanales y bombones de lujo.",
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
            noRamosMsg.classList.remove('vb-hidden');
            return;
        }

        ramosGrid.classList.remove('vb-hidden');
        noRamosMsg.classList.add('vb-hidden');

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

            // Scroll to top
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
            noAccesoriosMsg.classList.remove('vb-hidden');
            return;
        }

        accesoriosGrid.classList.remove('vb-hidden');
        noAccesoriosMsg.classList.add('vb-hidden');

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

            // Scroll to top
            if (typeof forceScrollToTop === 'function') {
                forceScrollToTop();
            } else {
                window.scrollTo(0, 0);
            }
        });
    });

    renderAccesorios('espejos-cartera');
}

// Global initialization
function globalInit() {
    initCatalog();
    initRamosCatalog();
    initAccesoriosCatalog();

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
    if (whyChooseSection) whyChooseSection.classList.remove('vb-hidden');

    // Ensure Catalogs are hidden initially if Hero is present
    const catalogs = ['product-catalog', 'ramos-catalog', 'accesorios-catalog'];
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

