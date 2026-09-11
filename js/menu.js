document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    const dropdownItems = document.querySelectorAll('li[data-dropdown]');
    const pageCard = document.getElementById('page-card');
    const links = document.querySelectorAll('.dropdown-menu a');

    // 1. ABRIR E FECHAR O MENU MOBILE NO BOTAO ☰
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });
    }

    // 2. COMPORTAMENTO DOS SUBMENUS NO MOBILE (CLIQUE/TOQUE)
    dropdownItems.forEach(item => {
        const linkPai = item.querySelector('.link');
        const submenu = item.querySelector('.dropdown-menu');

        if (linkPai && submenu) {
            linkPai.addEventListener('click', (e) => {
                // Apenas se estiver em tela mobile
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    
                    // Fecha outros submenus que possam estar abertos
                    document.querySelectorAll('.dropdown-menu').forEach(sub => {
                        if (sub !== submenu) sub.classList.remove('show');
                    });

                    // Alterna visibilidade do submenu atual
                    submenu.classList.toggle('show');
                }
            });
        }
    });

    // 3. CARREGAMENTO DAS PÁGINAS E FECHAMENTO DO MENU AO SELECIONAR
    links.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();

            const pageUrl = link.getAttribute('data-page');
            if (!pageUrl) return;

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

            // Fecha a barra lateral no mobile após selecionar um item
            if (sidebar && window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // 4. FECHAR MENU AO CLICAR FORA DELE
    document.addEventListener('click', (e) => {
        if (sidebar && window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
});
