// Transicao automatica do splash para a pagina principal
function iniciarTransicao() {
    const welcome = document.getElementById('welcome-screen');
    const btn = document.querySelector('.glass-link');
    const container = document.querySelector('.glass-container');
    const main = document.getElementById('main-content');

    if (!welcome || !btn) return;

    const handle = (event) => {
        event.preventDefault();
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
        }, 400);
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

    const dataEvento = new Date('Apr 25, 2026 20:00:00').getTime();

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
