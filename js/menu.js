document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('menu-overlay');
    const parentLinks = document.querySelectorAll('.has-submenu > .menu-link');
    const subLinks = document.querySelectorAll('.submenu a');
    const pageCard = document.getElementById('page-card');

    function toggleMenu() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    }

    // 1. ABRIR E FECHAR A GAVETA LATERAL
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', toggleMenu);
    }

    // 2. EXIBIR SUBMENU DENTRO DA CAIXA COM TEXTO DESTACADO
    parentLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const parentLi = link.parentElement;
            const submenu = parentLi.querySelector('.submenu');

            if (submenu) {
                const jaAberto = submenu.classList.contains('open-submenu');

                // Reseta todos os submenus e cores
                document.querySelectorAll('.submenu').forEach(sub => sub.classList.remove('open-submenu'));
                document.querySelectorAll('.has-submenu').forEach(item => item.classList.remove('active'));

                // Abre o submenu atual
                if (!jaAberto) {
                    submenu.classList.add('open-submenu');
                    parentLi.classList.add('active');
                }
            }
        });
    });

    // 3. CARREGAR PÁGINAS E FECHAR O MENU
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

            // Fecha a gaveta
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    });
});
