document.querySelectorAll('li[data-dropdown] > a').forEach(itemPai => {
    itemPai.addEventListener('click', (e) => {
        // Roda o código de abrir o submenu APENAS no mobile
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const submenu = itemPai.nextElementSibling;
            
            // Fecha outros abertos
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== submenu) menu.classList.remove('show');
            });

            // Alterna o atual
            if (submenu) submenu.classList.toggle('show');
        }
    });
});
