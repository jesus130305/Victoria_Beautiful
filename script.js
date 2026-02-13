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

    // Mobile Submenu Toggle
    const dropdownItems = document.querySelectorAll('.dropdown-item > a');
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                const parent = item.parentElement;
                if (parent.querySelector('.mega-menu')) {
                    e.preventDefault();
                    parent.classList.toggle('active');
                }
            }
        });
    });

    // Search bar focus
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

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').slice(1);
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

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

    // --- PRODUCT DETAILS LOGIC ---
    function vdInitDetails() {
        const detailsScreen = document.getElementById('product-details');
        const homeSections = document.querySelectorAll('main > section:not(#product-details):not(#contact-screen)');

        function vdSwitchScreen(screenId) {
            detailsScreen.classList.add('vb-hidden');
            homeSections.forEach(s => s.classList.add('vb-hidden'));

            if (screenId === 'details') {
                detailsScreen.classList.remove('vb-hidden');
            } else {
                homeSections.forEach(s => s.classList.remove('vb-hidden'));
            }
            window.scrollTo(0, 0);
        }

        document.addEventListener('click', (e) => {
            const target = e.target.closest('.vd-back-to-catalog, .vd-size-btn, .vd-acc-header');
            if (target) {
                if (target.classList.contains('vd-back-to-catalog')) {
                    e.preventDefault();
                    vdSwitchScreen('home');
                }
                if (target.classList.contains('vd-size-btn')) {
                    document.querySelectorAll('.vd-size-btn').forEach(btn => btn.classList.remove('active'));
                    target.classList.add('active');
                }
                if (target.classList.contains('vd-acc-header')) {
                    const item = target.parentElement;
                    item.classList.toggle('open');
                    const icon = target.querySelector('ion-icon');
                    icon.name = item.classList.contains('open') ? 'chevron-up-outline' : 'chevron-down-outline';
                }
            }
        });
    }

    // --- CONTACT LOGIC ---
    function vcInitContact() {
        const contactScreen = document.getElementById('contact-screen');
        const detailsScreen = document.getElementById('product-details');
        const homeSections = document.querySelectorAll('main > section:not(#product-details):not(#contact-screen)');

        function vcSwitchScreen(screenId) {
            [detailsScreen, contactScreen].forEach(s => s && s.classList.add('vb-hidden'));
            homeSections.forEach(s => s.classList.add('vb-hidden'));

            if (screenId === 'contact') {
                contactScreen.classList.remove('vb-hidden');
            } else {
                homeSections.forEach(s => s.classList.remove('vb-hidden'));
            }
            window.scrollTo(0, 0);
        }

        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button');
            if (!target) return;
            const text = target.innerText.toLowerCase();
            if (text.includes('contacto') || target.getAttribute('href') === '#contacto') {
                e.preventDefault();
                vcSwitchScreen('contact');
            }
        });

        const contactForm = document.getElementById('vc-contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const feedback = document.getElementById('vc-form-feedback');
                const btn = this.querySelector('.vc-submit-btn');
                btn.innerText = 'Enviando...';
                btn.disabled = true;
                setTimeout(() => {
                    btn.innerText = 'Enviar de Nuevo';
                    btn.disabled = false;
                    feedback.classList.remove('vb-hidden');
                    contactForm.reset();
                    setTimeout(() => feedback.classList.add('vb-hidden'), 5000);
                }, 1500);
            });
        }
    }

    if (document.getElementById('product-details')) vdInitDetails();
    if (document.getElementById('contact-screen')) vcInitContact();
});
