document.addEventListener('DOMContentLoaded', function () {
    /* =========================================================
     * MENU MOBILE (drawer central) – com fallback pra iOS antigo
     * ========================================================= */
    (function () {
        const btn = document.getElementById('navToggle');
        const drawer = document.getElementById('navDrawer');
        if (!btn || !drawer) return;

        const prefersReducedMotion =
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Verifica suporte à Web Animations API
        const canUseWAAPI = typeof drawer.animate === 'function' && !prefersReducedMotion;

        const openFrames = [
            { opacity: 0, transform: 'translate(-50%, -8px) scale(.98)' },
            { opacity: 1, transform: 'translate(-50%, 0) scale(1)' }
        ];
        const closeFrames = [
            { opacity: 1, transform: 'translate(-50%, 0) scale(1)' },
            { opacity: 0, transform: 'translate(-50%, -8px) scale(.98)' }
        ];

        const timingOpen = {
            duration: prefersReducedMotion ? 0 : 220,
            easing: 'cubic-bezier(.22,.61,.36,1)',
            fill: 'forwards'
        };
        const timingClose = {
            duration: prefersReducedMotion ? 0 : 180,
            easing: 'cubic-bezier(.55,.06,.68,.19)',
            fill: 'forwards'
        };

        let isOpen = false;
        let currentAnim = null;

        function showDrawerInstant() {
            drawer.style.display = 'block';
            drawer.style.opacity = '1';
            drawer.style.transform = 'translate(-50%, 0) scale(1)';
        }

        function hideDrawerInstant() {
            drawer.style.opacity = '0';
            drawer.style.transform = 'translate(-50%, -8px) scale(.98)';
            drawer.style.display = 'none';
        }

        function openMenu() {
            if (!canUseWAAPI) {
                showDrawerInstant();
                isOpen = true;
                return;
            }

            drawer.style.display = 'block'; // mostra antes de animar
            if (currentAnim) currentAnim.cancel();
            currentAnim = drawer.animate(openFrames, timingOpen);
            isOpen = true;
        }

        function closeMenu() {
            if (!canUseWAAPI) {
                hideDrawerInstant();
                isOpen = false;
                return;
            }

            if (currentAnim) currentAnim.cancel();
            const anim = drawer.animate(closeFrames, timingClose);
            currentAnim = anim;
            anim.onfinish = () => {
                drawer.style.display = 'none'; // esconde após animar
                currentAnim = null;
            };
            isOpen = false;
        }

        btn.addEventListener('click', () => (isOpen ? closeMenu() : openMenu()));

        // Fecha ao clicar em qualquer link do drawer
        drawer.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') closeMenu();
        });

        // Fecha com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) closeMenu();
        });

        // Fecha ao clicar fora
        document.addEventListener('click', (e) => {
            if (!isOpen) return;
            if (!drawer.contains(e.target) && !btn.contains(e.target)) closeMenu();
        });
    })();

    /* ============================================
     * FORMULÁRIO DE CONTATO (demo + validação)
     * ============================================ */
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simple validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
            });

            if (isValid) {
                // Fake success
                contactForm.reset();
                contactForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');

                // scrollIntoView pode não ter behavior smooth em alguns iOS,
                // mas não quebra – ainda assim envolvemos em try/catch por segurança.
                try {
                    formSuccess.scrollIntoView({ behavior: 'smooth' });
                } catch (err) {
                    formSuccess.scrollIntoView();
                }

                // Reset after 5 seconds
                setTimeout(() => {
                    contactForm.classList.remove('hidden');
                    formSuccess.classList.add('hidden');
                }, 5000);
            }
        });
    }

    /* =================================================
     * Scroll Reveal com IntersectionObserver
     * (com fallback para navegadores sem suporte / iOS)
     * ================================================= */
    (function () {
        // Respeita quem prefere menos movimento
        const reduceMotion =
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const slideUps = document.querySelectorAll('.slide-up');
        const fadeIns = document.querySelectorAll('.fade-in');

        // Estado inicial
        slideUps.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = reduceMotion
                ? 'none'
                : 'opacity 0.5s ease-out, transform 0.5s ease-out';
        });

        fadeIns.forEach(el => {
            el.style.opacity = '0';
            el.style.transition = reduceMotion
                ? 'none'
                : 'opacity 0.5s ease-in';
        });

        // Se o usuário prefere sem animação OU não há IntersectionObserver,
        // apenas revela tudo e sai (evita erro em iOS antigo).
        if (reduceMotion || typeof window.IntersectionObserver === 'undefined') {
            [...slideUps, ...fadeIns].forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const el = entry.target;

                if (el.classList.contains('slide-up')) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                } else if (el.classList.contains('fade-in')) {
                    el.style.opacity = '1';
                }

                obs.unobserve(el); // revela apenas uma vez
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px'
        });

        [...slideUps, ...fadeIns].forEach(el => io.observe(el));
    })();

    /* ===============================
     * TOGGLE DE TEMA (light / dark)
     * =============================== */
    (function () {
        const root = document.documentElement;
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const prefersDark =
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Descobre tema salvo ou cai no padrão do sistema
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        function setTheme(theme) {
            if (theme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
            localStorage.setItem('theme', theme);
        }

        themeToggle.addEventListener('click', () => {
            const isDark = root.classList.contains('dark');
            setTheme(isDark ? 'light' : 'dark');
        });
    })();

    /* ======================
     * FEATHER ICONS (safe)
     * ====================== */
    if (window.feather && typeof window.feather.replace === 'function') {
        feather.replace();
    }
});
