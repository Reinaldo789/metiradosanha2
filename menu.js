// ==========================================
// GUIA TÉCNICO — menu.js
// ==========================================

const navItems = document.querySelectorAll('.nav-item');
const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
const mainNav = document.getElementById('main-nav');
const toggleIcon = mobileToggleBtn ? mobileToggleBtn.querySelector('i') : null;

// ---------- MENU MOBILE ----------
navItems.forEach(item => {
  const btn = item.querySelector('.nav-btn');
  btn.addEventListener('click', (e) => {
    if (window.innerWidth <= 960) {
      e.preventDefault();
      item.classList.toggle('active');
    }
  });
});

if (mobileToggleBtn) {
  mobileToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = mainNav.classList.toggle('active');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) {
      toggleIcon.classList.remove('fa-bars');
      toggleIcon.classList.add('fa-xmark');
    } else {
      toggleIcon.classList.remove('fa-xmark');
      toggleIcon.classList.add('fa-bars');
      navItems.forEach(item => item.classList.remove('active'));
    }
  });
}

// ---------- BOTÃO VOLTAR AO TOPO ----------
const btnTop = document.getElementById('btn-top');
if (btnTop) {
  window.addEventListener('scroll', () => {
    btnTop.classList.toggle('visible', window.scrollY > 150);
  });
  btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==========================================
// CARREGAR PÁGINAS
// ==========================================
const home = document.getElementById('home-box');
const card = document.getElementById('page-card');

async function abrirPagina() {
  const path = decodeURIComponent(location.hash.slice(1)).replace(/^\/+/, '');
  document.querySelectorAll('.mega-link-item.active').forEach(a => a.classList.remove('active'));

  if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(path)) {
    card.hidden = true;
    home.hidden = false;
    return;
  }

  const link = document.querySelector(`a[href="#${path}"]`);
  if (link && link.classList.contains('mega-link-item')) link.classList.add('active');
  const menu = link ? link.closest('.nav-item').querySelector('.nav-btn span').textContent.trim() : '';
  const titulo = !link ? '' :
    link.classList.contains('explore-link')
      ? link.closest('.mega-explore-side').querySelector('h5').textContent.trim()
      : link.textContent.trim();

  home.hidden = true;
  card.hidden = false;
  card.innerHTML = '<p class="page-loading">Carregando...</p>';
  window.scrollTo({ top: 0 });

  try {
    const resp = await fetch(`conteudo/${path}.html`);
    if (!resp.ok) throw new Error(`Página não encontrada (${resp.status})`);
    const corpo = await resp.text();

    card.innerHTML = `<div class="page-crumb"><a href="#">Início</a> › ${menu}</div><h1>${titulo}</h1>${corpo}`;

    // 1) Aplica abas e melhorias
    melhorarArtigo();

    // 2) ATIVA O FLUXOGRAMA (roda imediatamente, sem delay)
    ativarFluxograma();

  } catch (err) {
    card.innerHTML = `<h1>Erro</h1><p>${err.message}</p>`;
  }
}

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

// ==========================================
// BUSCA NA HOME
// ==========================================
const busca = document.getElementById('home-search');
const resultados = document.getElementById('home-results');
if (busca) {
  const itens = [...document.querySelectorAll('.mega-link-item')].map(a => ({
    nome: a.textContent.trim(),
    href: a.getAttribute('href'),
    menu: a.closest('.nav-item').querySelector('.nav-btn span').textContent.trim()
  }));
  const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  busca.addEventListener('input', () => {
    const q = norm(busca.value.trim());
    if (!q) { resultados.hidden = true; return; }
    const achou = itens.filter(i => norm(i.nome).includes(q)).slice(0, 8);
    resultados.innerHTML = achou.length
      ? achou.map(i => `<a href="${i.href}">${i.nome}<small>${i.menu}</small></a>`).join('')
      : '<p>Nada encontrado.</p>';
    resultados.hidden = false;
  });
  resultados.addEventListener('click', () => { resultados.hidden = true; busca.value = ''; });
  document.addEventListener('click', e => { if (!e.target.closest('.home-search')) resultados.hidden = true; });
}

// ==========================================
// FLUXOGRAMA INTERATIVO
// ==========================================
function ativarFluxograma() {
  const fluxos = document.querySelectorAll('.fluxo');
  if (!fluxos.length) {
    console.log('Nenhum fluxograma encontrado na página.');
    return;
  }
  console.log('Fluxogramas encontrados:', fluxos.length);

  fluxos.forEach((fluxo, index) => {
    const passos = fluxo.querySelectorAll('.passo');
    console.log(`Fluxo ${index + 1}: ${passos.length} passos`);
    if (!passos.length) return;

    // Esconde todos os passos, exceto o primeiro
    passos.forEach((p, i) => {
      if (i === 0) {
        p.removeAttribute('hidden');
        p.style.display = ''; // Garante que o primeiro aparece
      } else {
        p.setAttribute('hidden', '');
        p.style.display = 'none'; // Força o esconder
      }
    });

    // Remove listener antigo (evita duplicar cliques)
    if (fluxo._handler) {
      fluxo.removeEventListener('click', fluxo._handler);
    }

    // Cria o handler de clique
    fluxo._handler = function (e) {
      const btn = e.target.closest('.resp button[data-ir]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      const targetId = btn.getAttribute('data-ir');
      const target = document.getElementById(targetId);
      if (!target) {
        console.warn('Passo de destino não encontrado:', targetId);
        return;
      }

      // Esconde todos
      passos.forEach(p => {
        p.setAttribute('hidden', '');
        p.style.display = 'none';
      });

      // Mostra o destino
      target.removeAttribute('hidden');
      target.style.display = 'block';

      // Rola até o passo
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    };

    fluxo.addEventListener('click', fluxo._handler);
  });
}

// ==========================================
// MELHORAR ARTIGO (abas e acordeões)
// ==========================================
function melhorarArtigo() {
  if (card.querySelector('.art-head')) card.querySelector(':scope > h1')?.remove();

  card.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      const d = document.createElement('div');
      d.className = 'img-falta';
      d.innerHTML = '<i class="fa-regular fa-image"></i><span></span>';
      d.querySelector('span').textContent = img.alt || 'Imagem';
      img.replaceWith(d);
    }, { once: true });
  });

  card.querySelectorAll('.trio').forEach(trio => {
    const cols = [...trio.children];
    const bar = document.createElement('div');
    bar.className = 'mini-tabs';
    cols.forEach(c => {
      const h = c.querySelector('h4');
      if (!h) return;
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = h.textContent;
      bar.append(b);
      c.classList.add('mini-panel');
      h.hidden = true;
    });
    trio.prepend(bar);
    trio.classList.add('enh');
    ativarAba(bar, cols, 0);
  });

  card.querySelectorAll('.codigos').forEach(c => c.classList.add('enh'));

  // ⚠️ Só cria abas se NÃO houver fluxograma na página
  const temFluxo = card.querySelector('.fluxo');
  const h2s = [...card.querySelectorAll(':scope > h2')];

  if (h2s.length >= 3 && !temFluxo) {
    const bar = document.createElement('div');
    bar.className = 'art-tabs';
    const panels = h2s.map((h, i) => {
      const sec = document.createElement('section');
      sec.className = 'art-panel';
      h.before(sec);
      let n = h;
      do { const nx = n.nextElementSibling; sec.append(n); n = nx; } while (n && !n.matches('h2'));
      const b = document.createElement('button');
      b.type = 'button';
      const num = document.createElement('em');
      num.textContent = i + 1;
      b.append(num, h.textContent);
      bar.append(b);
      return sec;
    });
    panels[0].before(bar);
    ativarAba(bar, panels, 0);
  }
}

function ativarAba(bar, panels, i) {
  [...bar.children].forEach((b, j) => b.classList.toggle('on', j === i));
  panels.forEach((p, j) => p.classList.toggle('on', j === i));
}

// ==========================================
// INICIALIZA NA PRIMEIRA CARGA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  abrirPagina();
});
