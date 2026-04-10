function iniciarParticulas() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let rafId = 0;

    function countForViewport() {
        return Math.min(140, Math.max(40, Math.floor(window.innerWidth / 10)));
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function makeParticle() {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.15 + 0.4;
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.42,
            r: Math.random() * 1.8 + 0.4,
            a: Math.random() * 0.35 + 0.15
        };
    }

    function step() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx += (Math.random() - 0.5) * 0.055;
            p.vy += (Math.random() - 0.5) * 0.045;

            if (p.x < -4) p.x = width + 4;
            if (p.x > width + 4) p.x = -4;
            if (p.y < -4) p.y = height + 4;
            if (p.y > height + 4) p.y = -4;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 230, 255, ${p.a})`;
            ctx.fill();
        }
        rafId = requestAnimationFrame(step);
    }

    function initMoving() {
        resize();
        particles = Array.from({ length: countForViewport() }, () => makeParticle());
        cancelAnimationFrame(rafId);
        step();
    }

    function drawStatic() {
        resize();
        ctx.clearRect(0, 0, width, height);
        const n = Math.min(80, countForViewport());
        for (let i = 0; i < n; i++) {
            const p = makeParticle();
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 0.9, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 230, 255, ${p.a * 0.85})`;
            ctx.fill();
        }
    }

    window.addEventListener('resize', () => {
        if (prefersReduced) {
            drawStatic();
        } else {
            initMoving();
        }
    });

    if (prefersReduced) {
        drawStatic();
        return;
    }

    initMoving();
}

// Transicao automatica do splash para a pagina principal
function iniciarTransicao() {
    const welcome = document.getElementById('welcome-screen');
    const btn = document.querySelector('.entry-link, .glass-link');
    const container = document.querySelector('.glass-container');
    const envelopeWrap = document.querySelector('.entry-envelope-wrap');
    const entryHero = document.querySelector('.entry-hero');
    const main = document.getElementById('main-content');

    if (!welcome || !btn) return;

    const handle = (event) => {
        event.preventDefault();
        if (envelopeWrap) {
            envelopeWrap.classList.add('fading');
        }
        if (entryHero) {
            entryHero.classList.add('fading');
        }
        const fadeDelay = 900;
        const exitDelay = 500;
        setTimeout(() => {
            welcome.classList.add('leaving');
            setTimeout(() => {
                if (main) {
                    main.classList.add('show');
                    welcome.style.display = 'none';
                    main.scrollIntoView({ behavior: 'smooth' });
                } else {
                    const destino = btn.getAttribute('href') || 'pagina.html';
                    window.location.href = destino;
                }
            }, exitDelay);
        }, fadeDelay);
    };

    btn.addEventListener('click', handle);
    if (container) {
        container.addEventListener('click', handle);
    }
}

// Contador Regressivo (apenas na pagina principal)
function iniciarContador() {
    const elements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };

    if (!elements.days || !elements.hours || !elements.minutes || !elements.seconds) return;

    const dataEvento = new Date('Apr 25, 2026 20:30:00').getTime();

    const tick = () => {
        const agora = Date.now();
        const distancia = dataEvento - agora;

        if (distancia <= 0) {
            elements.days.textContent = '00';
            elements.hours.textContent = '00';
            elements.minutes.textContent = '00';
            elements.seconds.textContent = '00';
            return true;
        }

        const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

        elements.days.textContent = String(dias).padStart(2, '0');
        elements.hours.textContent = String(horas).padStart(2, '0');
        elements.minutes.textContent = String(minutos).padStart(2, '0');
        elements.seconds.textContent = String(segundos).padStart(2, '0');

        return false;
    };

    tick();
    const timer = setInterval(() => {
        if (tick()) clearInterval(timer);
    }, 1000);
}

window.addEventListener('load', () => {
    iniciarParticulas();
    iniciarTransicao();
    iniciarContador();
    const manualLink = document.querySelector('a[aria-label="Manual do convidado"]');
    const manualNote = document.getElementById('manual-note');
    if (manualLink && manualNote) {
        manualLink.addEventListener('click', (event) => {
            event.preventDefault();
            const willShow = manualNote.hidden;
            manualNote.hidden = false;
            manualNote.classList.toggle('show', willShow);
            if (!willShow) {
                setTimeout(() => { manualNote.hidden = true; }, 300);
            }
        });
    }
});
