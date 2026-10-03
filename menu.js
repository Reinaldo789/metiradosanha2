document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggleIcon = mobileToggleBtn.querySelector('i');

  // Alternar Abertura/Fechamento das Abas Sanfona no Menu Lateral
  navItems.forEach(item => {
    const btn = item.querySelector('.nav-btn');
    
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha outros grupos abertos
      navItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Alterna o atual
      item.classList.toggle('active', !isActive);
    });
  });

  // Toggle Menu Gaveta Mobile
  function toggleMobileSidebar() {
    const isOpen = sidebar.classList.toggle('open');
    overlay.classList.toggle('active', isOpen);

    if (isOpen) {
      toggleIcon.classList.remove('fa-bars');
      toggleIcon.classList.add('fa-xmark');
      document.body.style.overflow = 'hidden';
    } else {
      toggleIcon.classList.remove('fa-xmark');
      toggleIcon.classList.add('fa-bars');
      document.body.style.overflow = '';
    }
  }

  mobileToggleBtn.addEventListener('click', toggleMobileSidebar);
  overlay.addEventListener('click', toggleMobileSidebar);

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

  // ==========================================
  // CARREGAR PÁGINAS DE conteudo/<menu>/<item>.html
  // ==========================================
  const home = document.getElementById('home-box');
  const card = document.getElementById('page-card');

  async function abrirPagina() {
    const path = decodeURIComponent(location.hash.slice(1)).replace(/^\/+/, '');
    
    // Desmarca todos os links ativos
    document.querySelectorAll('.sidebar-link.active').forEach(a => a.classList.remove('active'));

    // Sem rota válida = Volta para a Home
    if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(path)) {
      card.hidden = true; 
      home.hidden = false;
      return;
    }

    const link = document.querySelector(`a[href="#${path}"]`);
    if (link) {
      link.classList.add('active');
      // Abre a aba pai caso esteja fechada
      const parentNav = link.closest('.nav-item');
      if (parentNav) parentNav.classList.add('active');
    }

    const menu = link ? link.closest('.nav-item').querySelector('.nav-btn span span').textContent.trim() : '';
    const titulo = link ? link.textContent.trim() : '';

    home.hidden = true; 
    card.hidden = false;
    card.innerHTML = '<p class="page-loading">Carregando...</p>';
    window.scrollTo({ top: 0 });

    try {
      const resp = await fetch(`conteudo/${path}.html`);
      if (!resp.ok) throw new Error(`Página não encontrada (${resp.status})`);
      const corpo = await resp.text();

      if (decodeURIComponent(location.hash.slice(1)) !== path) return;

      card.innerHTML = `<div class="page-crumb"><a href="#">Início</a> › ${menu}</div><h1>${titulo}</h1>${corpo}`;
    } catch (err) {
      card.innerHTML = `<h1>Erro</h1><p>${err.message}. Se estiver testando localmente, abra o projeto via servidor web (ex: Live Server do VS Code ou GitHub Pages).</p>`;
    }
  }

  // Fecha o menu lateral automaticamente no celular ao clicar em um link
  document.querySelectorAll('.sidebar-link').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 960 && sidebar.classList.contains('open')) {
        toggleMobileSidebar();
      }
    });
  });

  window.addEventListener('hashchange', abrirPagina);
  abrirPagina();

  // Rolagem suave interna dos artigos
  card.addEventListener('click', (e) => {
    const alvo = e.target.closest('[data-goto]');
    if (!alvo) return;
    e.preventDefault();
    const el = document.getElementById(alvo.dataset.goto);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
