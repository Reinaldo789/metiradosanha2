/**
 * Gerenciamento de Menu e Carregamento Dinâmico
 * Desenvolvido para o Manual Técnico
 */

document.addEventListener('DOMContentLoaded', () => {
    // Seleção de elementos da DOM
    const links = document.querySelectorAll('.dropdown-menu a');
    const pageCard = document.getElementById('page-card');
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');

    /**
     * Carrega o conteúdo HTML do arquivo solicitado via Fetch API
     * @param {string} url - Caminho para o arquivo HTML
     */
    const loadPage = async (url) => {
        if (!pageCard) return;

        // Feedback visual de carregamento
        pageCard.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: var(--color-text-muted);">Carregando informações técnicas...</p>
            </div>
        `;

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erro ao carregar a página (${response.status})`);
            }

            const html = await response.text();
            pageCard.innerHTML = html;

        } catch (error) {
            pageCard.innerHTML = `
                <div style="padding: 1rem;">
                    <h2 style="color: var(--color-accent); margin-bottom: 0.5rem;">Falha no Carregamento</h2>
                    <p style="color: var(--color-text-muted);">${error.message}. Verifique se o caminho do arquivo está correto.</p>
                </div>
            `;
        }
    };

    /**
     * Event Listener para os links do menu
     */
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            // Remove a classe ativa de todos e adiciona no clicado
            links.forEach(l => l.classList.remove('active-link'));
            link.classList.add('active-link');

            // Obtém o caminho do arquivo definido no data-page
            const pageUrl = link.getAttribute('data-page');

            if (pageUrl) {
                loadPage(pageUrl);
            }

            // Fecha o menu no modo mobile ao clicar em um item
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    });

    /**
     * Controle de Abertura/Fechamento do Menu Mobile
     */
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Fecha o menu se o usuário clicar fora dele
        document.addEventListener('click', (event) => {
            const isClickInsideMenu = sidebar.contains(event.target);
            const isClickOnToggle = mobileToggle.contains(event.target);

            if (!isClickInsideMenu && !isClickOnToggle && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    }
});
