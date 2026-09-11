document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    const dropdownItems = document.querySelectorAll('li[data-dropdown]');

    // 1. ABRIR E FECHAR A GAVETA LATERAL
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });

        // Clicar fora fecha a gaveta
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== mobileToggle) {
                sidebar.classList.remove('open');
            }
        });
    }

    // 2. EXIBIR SUBMENU AO CLICAR
    dropdownItems.forEach(item => {
        const linkPai = item.querySelector('a.link');
        const submenu = item.querySelector('.dropdown-menu');

        if (linkPai && submenu) {
            linkPai.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const jaAberto = submenu.classList.contains('show');

                // Fecha outros submenus que estejam abertos
                document.querySelectorAll('.dropdown-menu').forEach(sub => sub.classList.remove('show'));

                // Alterna o atual
                if (!jaAberto) {
                    submenu.classList.add('show');
                }
            });
        }
    });
});
