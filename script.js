document.addEventListener('DOMContentLoaded', function () {
    /* === MENU MOBILE: animação abrir/fechar usando Web Animations API (sem mudar o CSS) === */
    (function () {
        const btn = document.getElementById('navToggle');
        const drawer = document.getElementById('navDrawer');
        if (!btn || !drawer) return;

        // Respeita quem prefere menos movimento
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const openFrames = [
            { opacity: 0, transform: 'translate(-50%, -8px) scale(.98)' },
            { opacity: 1, transform: 'translate(-50%, 0) scale(1)' }
        ];
        const closeFrames = [
            { opacity: 1, transform: 'translate(-50%, 0) scale(1)' },
            { opacity: 0, transform: 'translate(-50%, -8px) scale(.98)' }
        ];

        const timingOpen = { duration: reduceMotion ? 0 : 220, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' };
        const timingClose = { duration: reduceMotion ? 0 : 180, easing: 'cubic-bezier(.55,.06,.68,.19)', fill: 'forwards' };

        let isOpen = false;
        let currentAnim = null;

        function openMenu() {
            drawer.style.display = 'block'; // mostra antes de animar
            if (currentAnim) currentAnim.cancel();
            currentAnim = drawer.animate(openFrames, timingOpen);
            isOpen = true;
        }

        function closeMenu() {
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

    // Contact form submission (demo)
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
                formSuccess.scrollIntoView({ behavior: 'smooth' });

                // Reset after 5 seconds
                setTimeout(() => {
                    contactForm.classList.remove('hidden');
                    formSuccess.classList.add('hidden');
                }, 5000);
            }
        });
    }

    // === Scroll Reveal com IntersectionObserver (substitui o bloco antigo) ===
    (function () {
        // Respeita quem prefere menos movimento
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Elementos alvo: mantém compatibilidade com .slide-up e .fade-in
        const slideUps = document.querySelectorAll('.slide-up');
        const fadeIns = document.querySelectorAll('.fade-in');

        // Estado inicial (igual ao que você já fazia)
        slideUps.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = reduceMotion ? 'none' : 'opacity 0.5s ease-out, transform 0.5s ease-out';
        });

        fadeIns.forEach(el => {
            el.style.opacity = '0';
            el.style.transition = reduceMotion ? 'none' : 'opacity 0.5s ease-in';
        });

        // Se o usuário prefere sem animação, revela tudo e sai
        if (reduceMotion) {
            [...slideUps, ...fadeIns].forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        // Observer que revela uma única vez
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const el = entry.target;

                // Aplica o "reveal" conforme a classe
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

        // Observa todos
        [...slideUps, ...fadeIns].forEach(el => io.observe(el));
    })();

    // Set initial state for animated elements
    document.querySelectorAll('.slide-up').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    });

    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.5s ease-in';
    });

    // Replace feather icons
    feather.replace();
});
