document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    const dropdownItems = document.querySelectorAll('li[data-dropdown]');
    const pageCard = document.getElementById('page-card');
    const links = document.querySelectorAll('.dropdown-menu a');
    const homeBtn = document.getElementById('home-btn');
    const topBtn = document.getElementById('top-btn');

    // Guarda o conteúdo inicial da página para o botão "Home" poder restaurar
    const defaultContent = pageCard ? pageCard.innerHTML : '';

    // Controla a visibilidade do botão flutuante "Topo"
    const SCROLL_THRESHOLD = 300;
    const toggleTopBtn = () => {
        if (!topBtn) return;
        const menuAberto = sidebar && sidebar.classList.contains('open') && window.innerWidth <= 768;
        topBtn.classList.toggle('visible', window.scrollY > SCROLL_THRESHOLD && !menuAberto);
    };

    // 1. ABRIR E FECHAR O MENU MOBILE NO BOTAO ☰
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
            toggleTopBtn();
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
                    dropdownItems.forEach(outroItem => {
                        if (outroItem !== item) {
                            outroItem.classList.remove('is-open');
                            outroItem.querySelector('.dropdown-menu')?.classList.remove('show');
                        }
                    });

                    // Alterna visibilidade do submenu atual (e gira a seta)
                    submenu.classList.toggle('show');
                    item.classList.toggle('is-open', submenu.classList.contains('show'));
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
                toggleTopBtn();
            }
        });
    });

    // 5. BOTÃO "HOME" — volta para o conteúdo inicial, fecha o menu e rola para o topo
    if (homeBtn) {
        homeBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (pageCard) pageCard.innerHTML = defaultContent;

            // Fecha todos os submenus abertos
            dropdownItems.forEach(item => {
                item.classList.remove('is-open');
                item.querySelector('.dropdown-menu')?.classList.remove('show');
            });

            if (sidebar) sidebar.classList.remove('open');
            toggleTopBtn();

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 6. BOTÃO "TOPO" — aparece só quando a página é rolada (e some se o menu estiver aberto)
    if (topBtn) {
        toggleTopBtn();
        window.addEventListener('scroll', toggleTopBtn);
        window.addEventListener('resize', toggleTopBtn);

        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. FECHAR MENU AO CLICAR FORA DELE
    document.addEventListener('click', (e) => {
        if (sidebar && window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('open');
                toggleTopBtn();
            }
        }
    });
});
