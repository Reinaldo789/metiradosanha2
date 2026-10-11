/* ==================================================
   GUIA TÉCNICO — SPRINT ELETRÔNICO
   Scripts compartilhados
   ================================================== */

// ---------- MENU MOBILE ----------
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.topbar nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
    });
}

// ---------- ACCORDION ----------
function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
        });
    });
}

// ---------- SIDEBAR ATIVA CONFORME SCROLL ----------
function initSidebarScroll() {
    const sections = document.querySelectorAll('.section[id]');
    const sidebarLinks = document.querySelectorAll('.sidebar a[href^="#"]');
    if (!sections.length || !sidebarLinks.length) return;

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 120;
        let currentId = null;

        sections.forEach(section => {
            if (scrollPos >= section.offsetTop &&
                scrollPos < section.offsetTop + section.offsetHeight) {
                currentId = section.id;
            }
        });

        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentId) {
                link.classList.add('active');
            }
        });
    });
}

// ---------- SMOOTH SCROLL PARA ÂNCORAS ----------
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Atualiza URL sem pular
                history.pushState(null, null, targetId);
            }
        });
    });
}

// ---------- CONTADOR ANIMADO (Home) ----------
function animateCounter(elementId, targetValue, duration = 1200) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let start = 0;
    const step = targetValue / (duration / 16);

    const timer = setInterval(() => {
        start += step;
        if (start >= targetValue) {
            element.textContent = targetValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

function initHomeCounters() {
    if (!document.getElementById('stat-systems')) return;
    animateCounter('stat-systems', 4);
    animateCounter('stat-groups', 10);
    animateCounter('stat-topics', 39);
}

// ---------- INIT GERAL ----------
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initAccordion();
    initSidebarScroll();
    initSmoothScroll();
    initHomeCounters();
});
