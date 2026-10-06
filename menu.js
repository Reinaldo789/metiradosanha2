const navItems = document.querySelectorAll('.nav-item');
const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
const mainNav = document.getElementById('main-nav');
const toggleIcon = mobileToggleBtn.querySelector('i');

// ==========================================
// LÓGICA DO MENU MOBILE (SEM SANFONA)
// Cada item abre/fecha independentemente
// ==========================================
navItems.forEach(item => {
  const btn = item.querySelector('.nav-btn');
  
  btn.addEventListener('click', (e) => {
    if (window.innerWidth <= 960) {
      e.preventDefault();
      
      // Apenas alterna o item clicado (não fecha os outros)
      item.classList.toggle('active');
    }
  });
});

// Toggle Menu Hamburguer Mobile
mobileToggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = mainNav.classList.toggle('active');
  
  // Bloqueia a rolagem do fundo do site quando o menu está aberto no celular
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }

  if (isOpen) {
    toggleIcon.classList.remove('fa-bars');
    toggleIcon.classList.add('fa-xmark');
  } else {
    toggleIcon.classList.remove('fa-xmark');
    toggleIcon.classList.add('fa-bars');
    // Fecha todos os itens ao fechar o menu hambúrguer
    navItems.forEach(item => item.classList.remove('active'));
  }
});

// ==========================================
// BOTÃO VOLTAR AO TOPO
// ==========================================
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
  document.querySelectorAll('.mega-link-item.active').forEach(a => a.classList.remove('active'));

  // sem rota válida = Home
  if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(path)) {
    card.hidden = true; home.hidden = false;
    return;
  }

  const link = document.querySelector(`a[href="#${path}"]`);
  if (link && link.classList.contains('mega-link-item')) link.classList.add('active');
  const menu = link ? link.closest('.nav-item').querySelector('.nav-btn span').textContent.trim() : '';
  const titulo = !link ? '' :
    link.classList.contains('explore-link')
      ? link.closest('.mega-explore-side').querySelector('h5').textContent.trim()
      : link.textContent.trim();

  home.hidden = true; card.hidden = false;
  card.innerHTML = '<p class="page-loading">Carregando...</p>';
  window.scrollTo({ top: 0 });

  try {
    const resp = await fetch(`conteudo/${path}.html`);
    if (!resp.ok) throw new Error(`Página não encontrada (${resp.status})`);
    const corpo = await resp.text();
    if (decodeURIComponent(location.hash.slice(1)) !== path) return;
    card.innerHTML = `<div class="page-crumb"><a href="#">Início</a> › ${menu}</div><h1>${titulo}</h1>${corpo}`;
  } catch (err) {
    card.innerHTML = `<h1>Erro</h1><p>${err.message}. Se estiver abrindo o arquivo direto no computador, use um servidor (GitHub Pages ou <code>python -m http.server</code>).</p>`;
  }
}

// clicou num item: fecha o menu (celular) ou o painel (desktop)
document.querySelectorAll('.mega-menu a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 960) {
      if (mainNav.classList.contains('active')) mobileToggleBtn.click();
    } else {
      const item = a.closest('.nav-item');
      item.classList.add('closed');
      item.addEventListener('mouseleave', () => item.classList.remove('closed'), { once: true });
    }
  });
});

window.addEventListener('hashchange', abrirPagina);
abrirPagina();

// índice interno dos artigos: <a data-goto="id"> rola até o título
card.addEventListener('click', (e) => {
  const alvo = e.target.closest('[data-goto]');
  if (!alvo) return;
  e.preventDefault();
  const el = document.getElementById(alvo.dataset.goto);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
