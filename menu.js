document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navItems = document.querySelectorAll('.nav-item');

  // 1. Abrir/Fechar Menu Hambúrguer em telas pequenas
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });
  }

  // 2. Alternar Dropdowns em Dispositivos Touch/Mobile ao Clicar
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    
    link.addEventListener('click', (e) => {
      // Se estiver na versão mobile (largura de tela menor que 900px)
      if (window.innerWidth <= 900) {
        e.preventDefault();
        
        // Fecha outros submenus abertos no mobile
        navItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('mobile-open');
          }
        });

        // Alterna o submenu do item clicado
        item.classList.toggle('mobile-open');
      }
    });
  });
});
