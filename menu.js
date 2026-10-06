document.addEventListener('DOMContentLoaded', () => {
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mainNav = document.getElementById('main-nav');
  const navItems = document.querySelectorAll('.nav-item');
  const homeBox = document.getElementById('home-box');
  const pageCard = document.getElementById('page-card');
  const btnTop = document.getElementById('btn-top');

  // 1. ALTERNAR MENU MOBILE (HAMBÚRGUER)
  if (mobileToggleBtn && mainNav) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mainNav.classList.toggle('active');
      const icon = mobileToggleBtn.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });
  }

  // 2. ABRIR E FECHAR SUBMENUS ACORDÃO NO MOBILE
  navItems.forEach(item => {
    const btn = item.querySelector('.nav-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          // Fecha os outros menus abertos no mobile
          navItems.forEach(other => {
            if (other !== item) other.classList.remove('mobile-open');
          });
          item.classList.toggle('mobile-open');
        }
      });
    }
  });

  // 3. CARREGAR PÁGINAS DINAMICAMENTE VIA HASH (#)
  async function carregarPagina() {
    const rawHash = location.hash.slice(1);
    const path = decodeURIComponent(rawHash).replace(/^\/+/, '');

    // Fecha o menu mobile se estiver aberto ao clicar em um link
    if (mainNav) mainNav.classList.remove('active');
    if (mobileToggleBtn) {
      const icon = mobileToggleBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    }
    navItems.forEach(item => item.classList.remove('mobile-open'));

    // Se a hash estiver vazia, exibe a Home
    if (!path) {
      if (pageCard) pageCard.hidden = true;
      if (homeBox) homeBox.hidden = false;
      return;
    }

    // Exibe o contêiner de artigo e oculta a Home
    if (homeBox) homeBox.hidden = true;
    if (pageCard) {
      pageCard.hidden = false;
      pageCard.innerHTML = '<p style="color: var(--text-muted); font-weight: 500;">A carregar artigo...</p>';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const response = await fetch(`conteudo/${path}.html`);
      if (!response.ok) throw new Error(`Ficheiro não encontrado: conteudo/${path}.html`);

      const htmlContent = await response.text();
      if (pageCard) pageCard.innerHTML = htmlContent;

    } catch (err) {
      if (pageCard) {
        pageCard.innerHTML = `
          <div style="padding: 1.5rem; background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; color: #92400e;">
            <h3 style="margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-triangle-exclamation"></i> Conteúdo em Elaboração
            </h3>
            <p>${err.message}</p>
          </div>`;
      }
    }
  }

  window.addEventListener('hashchange', carregarPagina);
  carregarPagina();

  // 4. BOTÃO VOLTAR AO TOPO
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      btnTop?.classList.add('visible');
    } else {
      btnTop?.classList.remove('visible');
    }
  });

  btnTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
