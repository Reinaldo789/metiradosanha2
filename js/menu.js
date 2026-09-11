document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const dropdownItems = document.querySelectorAll('li[data-dropdown]');
    const pageCard = document.getElementById('page-card');
    const subLinks = document.querySelectorAll('.dropdown-menu a');

    // 1. ABRIR/FECHAR MENU
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });
    }

    // 2. EXIBIR SUBMENU AO CLICAR NO ITEM PAI
    dropdownItems.forEach(item => {
        const linkPai = item.querySelector('.link');
        const submenu = item.querySelector('.dropdown-menu');

        if (linkPai && submenu) {
            linkPai.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const jaAberto = submenu.classList.contains('show');

                // Fecha outros submenus
                document.querySelectorAll('.dropdown-menu').forEach(sub => {
                    if (sub !== submenu) sub.classList.remove('show');
                });

                // Alterna o atual
                submenu.classList.toggle('show', !jaAberto);
            });
        }
    });

    // 3. CARREGAR PÁGINAS E FECHAR GAVETA
    subLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const pageUrl = link.getAttribute('data-page');
            if (!pageUrl) return;

            // Marca o link ativo
            subLinks.forEach(l => l.classList.remove('active-link'));
            link.classList.add('active-link');

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

            if (sidebar) {
                sidebar.classList.remove('open');
            }
        });
    });

    // 4. CLICAR FORA FECHA O SIDEBAR
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
});
