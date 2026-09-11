document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const dropdowns = document.querySelectorAll('li[data-dropdown]');

    // Abre/Fecha gaveta no mobile
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Clique nos submenus
    dropdowns.forEach(item => {
        const linkPai = item.querySelector('a.link');
        const submenu = item.querySelector('.dropdown-menu');

        if (linkPai && submenu) {
            linkPai.addEventListener('click', (e) => {
                // Impede navegação se houver submenu
                e.preventDefault();

                const jaAberto = submenu.classList.contains('show');

                // Fecha outros abertos
                document.querySelectorAll('.dropdown-menu').forEach(s => s.classList.remove('show'));

                // Alterna o atual
                if (!jaAberto) {
                    submenu.classList.add('show');
                }
            });
        }
    });
});
