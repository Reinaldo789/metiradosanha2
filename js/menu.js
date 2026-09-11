document.addEventListener('DOMContentLoaded', () => {
    const dropdownItems = document.querySelectorAll('li[data-dropdown]');

    dropdownItems.forEach(item => {
        const linkPai = item.querySelector('.link');
        const submenu = item.querySelector('.dropdown-menu');

        if (linkPai && submenu) {
            linkPai.addEventListener('click', (e) => {
                // Executa a sanfona apenas se estiver no celular
                if (window.innerWidth <= 768) {
                    e.preventDefault();

                    // Se o item clicado já estiver aberto, fecha ele. Se não, fecha os outros e abre o clicado.
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
});
