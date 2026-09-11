document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    const dropdownItems = document.querySelectorAll('li[data-dropdown]');
    const links = document.querySelectorAll('a[data-page]');
    const pageCard = document.getElementById('page-card');

    // 1. ABRIR/FECHAR GAVETA NO MOBILE
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });
    }

    // 2. ABRIR SUBMENU APENAS NO CLIQUE (MOBILE)
    dropdownItems.forEach(item => {
        const linkPai = item.querySelector('a.link');
        const submenu = item.querySelector('.dropdown-menu');

        if (linkPai && submenu) {
            linkPai.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    
                    const jaAberto = submenu.classList.contains('show');
                    
                    document.querySelectorAll('.dropdown-menu').forEach(sub => {
                        sub.classList.remove('show');
                    });

                    if (!jaAberto) {
                        submenu.classList.add('show');
                    }
                }
            });
        }
    });

    // 3. CARREGAMENTO DAS PÁGINAS VIA FETCH
    links.forEach(link => {
        link.addEventListener('click', async (e) => {
            const pageUrl = link.getAttribute('data-page');
            if (!pageUrl) return;

            e.preventDefault();

            if (pageCard) {
                pageCard.innerHTML = '<p style="color: var(--color-text-muted);">Carregando...</p>';

                try {
                    const response = await fetch(pageUrl);
                    if (!response.ok) throw new Error(`Erro (${response.status})`);
                    const html = await response.text();
                    pageCard.innerHTML = html;
                } catch (err) {
                    pageCard.innerHTML = `<h3 style="color: var(--color-accent);">Erro</h3><p>${err.message}</p>`;
                }
            }

            if (sidebar && window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });
});
