document.addEventListener('DOMContentLoaded', () => {
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  const navItems = document.querySelectorAll('.nav-item');
  const home = document.getElementById('home-box');
  const card = document.getElementById('page-card');

  // 1. ABRIR E FECHAR MENU MOBILE
  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('active');
      const icon = mobileToggleBtn.querySelector('i');
      
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });
  }

  // 2. COMPORTAMENTO EM DISPOSITIVOS MÓVEIS (CLICK PARA ABRIR DROPDOWN)
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          e.stopPropagation();

          // Fecha os outros submenus abertos
          navItems.forEach(other => {
            if (other !== item) other.classList.remove('mobile-open');
          });

          item.classList.toggle('mobile-open');
        }
      });
    }
  });

  // 3. CARREGAMENTO DINÂMICO DE PÁGINAS (HASH #)
  async function carregarPagina() {
    const rawHash = location.hash.slice(1);
    const path = decodeURIComponent(rawHash).replace(/^\/+/, '');

    // Desativa submenus abertos no mobile
    if (navMenu) navMenu.classList.remove('active');
    navItems.forEach(item => item.classList.remove('mobile-open'));

    if (!path) {
      if (card) card.hidden = true;
      if (home) home.hidden = false;
      return;
    }

    if (home) home.hidden = true;
    if (card) {
      card.hidden = false;
      card.innerHTML = '<p style="color: var(--text-muted); padding: 1rem;">A carregar dados...</p>';
    }

    try {
      const response = await fetch(`conteudo/${path}.html`);
      if (!response.ok) throw new Error(`Ficheiro não encontrado em: conteudo/${path}.html`);
      
      const htmlContent = await response.text();
      if (card) card.innerHTML = htmlContent;
      
    } catch (err) {
      if (card) {
        card.innerHTML = `
          <div class="highlight-card warning" style="margin-top: 1rem;">
            <i class="fa-solid fa-triangle-exclamation card-icon"></i>
            <div class="card-body">
              <h4>Erro ao carregar o conteúdo</h4>
              <p>${err.message}</p>
            </div>
          </div>`;
      }
    }
  }

  window.addEventListener('hashchange', carregarPagina);
  carregarPagina();
});

// 4. FUNÇÃO GLOBAL DAS ABAS (TABS INTERNAS)
window.switchTab = function(event, tabId) {
  const btn = event.currentTarget;
  const container = btn.closest('.page-card') || document;

  container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  btn.classList.add('active');
  const target = container.querySelector(`#${tabId}`);
  if (target) target.classList.add('active');
};
