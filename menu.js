document.addEventListener('DOMContentLoaded', () => {
  // Toggle do menu mobile
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const sidebarNav = document.querySelector('.sidebar-nav');

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => {
      sidebarNav.classList.toggle('open');
    });
  }

  // Expandir e recolher os itens da barra lateral (efeito acordeão)
  const navBtns = document.querySelectorAll('.nav-btn');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentItem = btn.parentElement;
      
      // Se desejar fechar os outros ao abrir um novo, descomente a linha abaixo:
      // document.querySelectorAll('.nav-item').forEach(item => item !== parentItem && item.classList.remove('active'));

      parentItem.classList.toggle('active');
    });
  });
});
