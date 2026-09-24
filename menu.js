document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mainNav = document.getElementById('main-nav');
  const toggleIcon = mobileToggleBtn.querySelector('i');

  // Lógica para alternar a abertura dos Cards no Mobile (Efeito Sanfona/Accordion)
  navItems.forEach(item => {
    const btn = item.querySelector('.nav-btn');
    
    btn.addEventListener('click', (e) => {
      if (window.innerWidth <= 960) {
        e.preventDefault();
        const isActive = item.classList.contains('active');
        
        // Fecha todas as outras caixas abertas
        navItems.forEach(otherItem => otherItem.classList.remove('active'));

        // Se não estava ativo, ativa o clicado e faz um leve ajuste de scroll
        if (!isActive) {
          item.classList.add('active');
          setTimeout(() => {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      }
    });
  });

  // Toggle Menu Hamburguer Mobile (Garante que tudo abre recolhido)
  mobileToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mainNav.classList.toggle('active');
    
    // Bloqueia a rolagem do fundo do site quando o menu está aberto no celular
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Sempre fecha todas as caixas ao abrir/fechar o menu hambúrguer
    navItems.forEach(item => item.classList.remove('active'));

    if (isOpen) {
      toggleIcon.classList.remove('fa-bars');
      toggleIcon.classList.add('fa-xmark');
    } else {
      toggleIcon.classList.remove('fa-xmark');
      toggleIcon.classList.add('fa-bars');
    }
  });

  // Botão Voltar ao Topo
  const btnTop = document.getElementById('btn-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
      btnTop.classList.add('visible');
    } else {
      btnTop.classList.remove('visible');
    }
  });

  btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
