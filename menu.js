document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    const dropdownItems = document.querySelectorAll('li[data-dropdown]');
    const pageCard = document.getElementById('page-card');
    const links = document.querySelectorAll('.dropdown-menu a');
    const homeBtns = document.querySelectorAll('.home-trigger');
    const topBtn = document.getElementById('top-btn');
    const topoMenuBtn = document.querySelector('.topo-menu-btn');

    // Guarda o conteúdo inicial da página para o botão "Home" poder restaurar
    const defaultContent = pageCard ? pageCard.innerHTML : '';

    const ehMobile = () => window.innerWidth <= 768;

    // Controla a visibilidade do botão flutuante "Topo"
    const SCROLL_THRESHOLD = 300;
    const toggleTopBtn = () => {
        if (!topBtn) return;
        const menuAberto = sidebar && sidebar.classList.contains('open') && ehMobile();
        topBtn.classList.toggle('visible', window.scrollY > SCROLL_THRESHOLD && !menuAberto);
    };

    const fecharMenuMobile = () => {
        if (sidebar && ehMobile()) {
            sidebar.classList.remove('open');
            toggleTopBtn();
        }
    };

    // ==========================================================
    // ROTAS: cada link do submenu vira um endereço, ex.:
    //   #sistema-de-injecao/valvula-mprop
    // Funciona ao clicar, ao abrir o link direto e com o botão voltar.
    // ==========================================================
    const norm = (t) => (t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const ultimo = (link) => {
        const partes = (link.getAttribute('data-page') || '').replace(/\.html?$/i, '').split('/').filter(Boolean);
        return norm(partes[partes.length - 1] || link.textContent);
    };

    const menuDe = (link) => {
        const pai = link.closest('li[data-dropdown]');
        const rotulo = pai && pai.querySelector('.link');
        if (!rotulo) return '';
        const texto = Array.from(rotulo.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent).join('');
        return norm(texto);
    };

    const rotaDe = (link) => `${menuDe(link)}/${ultimo(link)}`.replace(/^\//, '');

    const acharLink = (hash) => {
        const h = norm(hash.split('/').pop());
        const lista = Array.from(links).filter(l => l.getAttribute('data-page'));
        return lista.find(l => rotaDe(l) === hash.split('/').map(norm).join('/'))
            || lista.find(l => ultimo(l) === h)
            || lista.find(l => norm(l.textContent) === h);
    };

    const mostrarHome = () => {
        if (!pageCard) return;
        pageCard.innerHTML = defaultContent;
        pageCard.classList.remove('modo-artigo');
        links.forEach(l => l.classList.remove('active-link'));
        document.title = 'Guia Técnico';
    };

    async function abrirLink(link) {
        const pageUrl = link.getAttribute('data-page');
        if (!pageUrl || !pageCard) return;

        links.forEach(l => l.classList.toggle('active-link', l === link));
        pageCard.classList.add('modo-artigo');
        pageCard.innerHTML = '<p class="carregando">Carregando...</p>';

        try {
            const response = await fetch(pageUrl);
            if (!response.ok) throw new Error(`Página não encontrada (${response.status})`);
            const html = await response.text();
            // se o usuário já mudou de página enquanto carregava, ignora
            if (!link.classList.contains('active-link')) return;
            pageCard.innerHTML = `<div class="artigo">${html}</div>`;
            document.title = `${link.textContent.trim()} · Guia Técnico`;
        } catch (err) {
            pageCard.innerHTML = `<h3 style="color: var(--color-accent);">Erro</h3><p>${err.message}. Se estiver abrindo o arquivo direto no computador, use um servidor (GitHub Pages ou <code>python -m http.server</code>).</p>`;
        }
        pageCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const abrirDoHash = () => {
        const hash = decodeURIComponent(location.hash.slice(1));
        if (!hash) { mostrarHome(); return; }
        const link = acharLink(hash);
        if (link) abrirLink(link);
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
                if (ehMobile()) {
                    e.preventDefault();

                    dropdownItems.forEach(outroItem => {
                        if (outroItem !== item) {
                            outroItem.classList.remove('is-open');
                            outroItem.querySelector('.dropdown-menu')?.classList.remove('show');
                        }
                    });

                    submenu.classList.toggle('show');
                    item.classList.toggle('is-open', submenu.classList.contains('show'));
                }
            });
        }
    });

    // 3. CLIQUE NUM ITEM DO SUBMENU: muda o endereço (#menu/item) e abre a página
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (!link.getAttribute('data-page')) return;

            const rota = rotaDe(link);
            if (decodeURIComponent(location.hash.slice(1)) === rota) abrirLink(link);
            else location.hash = rota;   // dispara 'hashchange', que abre a página

            fecharMenuMobile();
        });
    });

    window.addEventListener('hashchange', abrirDoHash);

    // 3b. ÍNDICE INTERNO DOS ARTIGOS: <a data-goto="id"> rola até o título
    if (pageCard) {
        pageCard.addEventListener('click', (e) => {
            const alvo = e.target.closest('[data-goto]');
            if (!alvo) return;
            e.preventDefault();
            document.getElementById(alvo.dataset.goto)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // 5. BOTÃO "HOME" — volta para o conteúdo inicial, fecha o menu e rola para o topo
    homeBtns.forEach(homeBtn => {
        homeBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (location.hash) history.pushState(null, '', location.pathname + location.search);
            mostrarHome();

            dropdownItems.forEach(item => {
                item.classList.remove('is-open');
                item.querySelector('.dropdown-menu')?.classList.remove('show');
            });

            if (sidebar) sidebar.classList.remove('open');
            toggleTopBtn();

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // 5b. BOTÃO "TOPO" dentro do menu mobile
    if (topoMenuBtn) {
        topoMenuBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 6. BOTÃO "TOPO" — aparece só quando a página é rolada
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
        if (sidebar && ehMobile()) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('open');
                toggleTopBtn();
            }
        }
    });

    // abriu um link direto (ex.: ...index.html#sistema-de-injecao/valvula-mprop)
    if (location.hash) abrirDoHash();
});
