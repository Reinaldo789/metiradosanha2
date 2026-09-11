document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const dropdownItems = document.querySelectorAll('li[data-dropdown]');

    // Toggle do Menu Lateral
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuToggle) {
                sidebar.classList.remove('open');
            }
        });
    }

    // Toggle dos Submenus
    dropdownItems.forEach(item => {
        const linkPai = item.querySelector('a.link');
        const submenu = item.querySelector('.dropdown-menu');

        if (linkPai && submenu) {
            linkPai.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const jaAberto = submenu.classList.contains('show');
                document.querySelectorAll('.dropdown-menu').forEach(sub => sub.classList.remove('show'));

                if (!jaAberto) {
                    submenu.classList.add('show');
                }
            });
        }
    });
});
