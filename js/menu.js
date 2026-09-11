document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const parentLinks = document.querySelectorAll('.has-submenu > .menu-link');
    const subLinks = document.querySelectorAll('.submenu a');
    const pageCard = document.getElementById('page-card');

    // 1. ABRIR E FECHAR A GAVETA LATERAL NO BOTÃO MENU
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });
    }

    // 2. EXIBIR SUBMENU NO CLIQUE DO ITEM PAI
    parentLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const parentLi = link.parentElement;
            const submenu = parentLi.querySelector('.submenu');

            if (submenu) {
                const jaAberto = submenu.classList.contains('open-submenu');

                // Fecha outros submenus
                document.querySelectorAll('.submenu').forEach(sub => sub.classList.remove('open-submenu'));

                // Abre o submenu clicado
                if (!jaAberto) {
                    submenu.classList.add('open-submenu');
                }
            }
        });
    });

    // 3. CARREGAR PÁGINAS E FECHAR O SIDEBAR
    subLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const pageUrl = link.getAttribute('data-page');
            if (!pageUrl) return;

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

    // 4. CLICAR FORA DA GAVETA FECHA O MENU
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
});
