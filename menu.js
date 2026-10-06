document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  const toggleIcon = mobileToggleBtn ? mobileToggleBtn.querySelector('i') : null;

  // 1. Menu Mobile Toggle
  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('active');
      
      document.body.style.overflow = isOpen ? 'hidden' : '';

      if (isOpen) {
        toggleIcon.classList.remove('fa-bars');
        toggleIcon.classList.add('fa-xmark');
      } else {
        toggleIcon.classList.remove('fa-xmark');
        toggleIcon.classList.add('fa-bars');
        navItems.forEach(item => item.classList.remove('mobile-open'));
      }
    });
  }

  // 2. Caixas do Menu Mobile (Accordion / Cards)
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          
          navItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('mobile-open');
            }
          });

          item.classList.toggle('mobile-open');
        }
      });
    }
  });

  // 3. Botão Voltar ao Topo
  const btnTop = document.getElementById('btn-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
      btnTop?.classList.add('visible');
    } else {
      btnTop?.classList.remove('visible');
    }
  });

  if (btnTop) {
    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 4. Carregamento de Conteúdo Dinâmico
  const home = document.getElementById('home-box');
  const card = document.getElementById('page-card');

  async function abrirPagina() {
    const path = decodeURIComponent(location.hash.slice(1)).replace(/^\/+/, '');
    document.querySelectorAll('.dropdown-item.active').forEach(a => a.classList.remove('active'));

    if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(path)) {
      if (card) card.hidden = true;
      if (home) home.hidden = false;
      return;
    }

    const link = document.querySelector(`a[href="#${path}"]`);
    if (link) link.classList.add('active');

    const menu = link ? link.closest('.nav-item').querySelector('.nav-link span').textContent.trim() : '';
    const titulo = link ? link.textContent.trim() : '';

    if (home) home.hidden = true;
    if (card) {
      card.hidden = false;
      card.innerHTML = '<p style="color: var(--text-muted); font-weight: 500;">Carregando conteúdo...</p>';
    }

    window.scrollTo({ top: 0 });

    try {
      const resp = await fetch(`conteudo/${path}.html`);
      if (!resp.ok) throw new Error(`Página não encontrada (${resp.status})`);
      const corpo = await resp.text();
      
      if (decodeURIComponent(location.hash.slice(1)) !== path) return;
      
      if (card) {
        card.innerHTML = `
          <div class="page-crumb">
            <a href="#">Início</a> <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i> <span>${menu}</span>
          </div>
          <h1>${titulo}</h1>
          ${corpo}
        `;
      }
    } catch (err) {
      if (card) {
        card.innerHTML = `<h1>Página Não Encontrada</h1><p>${err.message}. Verifique se o ficheiro existe na pasta <code>conteudo/${path}.html</code>.</p>`;
      }
    }
  }

  // Fechar o menu ao clicar num link
  document.querySelectorAll('.dropdown-menu a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 900 && navMenu.classList.contains('active')) {
        mobileToggleBtn.click();
      }
    });
  });

  window.addEventListener('hashchange', abrirPagina);
  abrirPagina();

  // Scroll suave para links com data-goto
  if (card) {
    card.addEventListener('click', (e) => {
      const alvo = e.target.closest('[data-goto]');
      if (!alvo) return;
      e.preventDefault();
      const el = document.getElementById(alvo.dataset.goto);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
});
