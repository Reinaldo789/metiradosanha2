document.addEventListener('DOMContentLoaded', () => {
    const dropdownItems = document.querySelectorAll('li[data-dropdown]');

    dropdownItems.forEach(item => {
        const linkPai = item.querySelector('a.link');
        const submenu = item.querySelector('.dropdown-menu');

        if (linkPai && submenu) {
            linkPai.addEventListener('click', (e) => {
                e.preventDefault();

                const jaAberto = submenu.classList.contains('show');

                // Fecha outros submenus que estiverem abertos
                document.querySelectorAll('.dropdown-menu').forEach(sub => {
                    sub.classList.remove('show');
                });

                // Se não estava aberto, abre este
                if (!jaAberto) {
                    submenu.classList.add('show');
                }
            });
        }
    });
});
