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
      
      // Sanfona: ao abrir um item, fecha os outros
      const abrir = !item.classList.contains('active');
      navItems.forEach(i => i.classList.remove('active'));
      if (abrir) {
        item.classList.add('active');
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
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
const cabecalho = document.querySelector('.site-wrapper > header');
window.addEventListener('scroll', () => {
  cabecalho.classList.toggle('scrolled', window.scrollY > 20);
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
  document.querySelectorAll('.mega-link-item.active, .explore-link.active')
    .forEach(a => a.classList.remove('active'));

  // Sem rota válida = Home
  if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(path)) {
    card.hidden = true;
    home.hidden = false;
    return;
  }

  const link = document.querySelector(`a[href="#${path}"]`);
  if (link && link.classList.contains('mega-link-item')) link.classList.add('active');

  const menu = link
    ? link.closest('.nav-item').querySelector('.nav-btn span').textContent.trim()
    : '';

  const titulo = !link ? '' :
    link.classList.contains('explore-link')
      ? link.closest('.mega-explore-side').querySelector('h5').textContent.trim()
      : link.textContent.trim();

  home.hidden = true;
  card.hidden = false;
  card.innerHTML = '<p class="page-loading">Carregando...</p>';
  window.scrollTo({ top: 0 });

  try {
    // 🔥 AQUI: sempre busca o MESMO arquivo único
    const resp = await fetch('conteudo/sistema-eletrico.html');
    if (!resp.ok) throw new Error(`Arquivo não encontrado (${resp.status})`);

    const corpo = await resp.text();
    if (decodeURIComponent(location.hash.slice(1)) !== path) return;

    // Converte o texto em DOM e filtra a seção correta
    const temp = document.createElement('div');
    temp.innerHTML = corpo;

    const alvo = path.split('/')[1]; // ex: "alternador"
    const secao = temp.querySelector(`[data-circuito="${alvo}"]`);

    if (!secao) {
      card.innerHTML = `<div class="page-crumb"><a href="#">Início</a> › ${menu}</div>
        <h1>${titulo}</h1>
        <p>Este circuito ainda não foi adicionado ao arquivo único.</p>`;
      return;
    }

    card.innerHTML = `<div class="page-crumb"><a href="#">Início</a> › ${menu}</div>${secao.outerHTML}`;
    melhorarArtigo();

  } catch (err) {
    card.innerHTML = `<h1>Erro</h1><p>${err.message}. Verifique se o arquivo <code>conteudo/sistema-eletrico.html</code> existe.</p>`;
  }
}
  
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
    melhorarArtigo();
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

// ==========================================
// BUSCA DA PÁGINA INICIAL (usa os links do menu)
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
// ARTIGOS: abas, acordeão, imagens e caixa de diálogo
// ==========================================
const lb = document.createElement('dialog');
lb.className = 'lightbox';
lb.innerHTML = '<button type="button" class="lb-close" aria-label="Fechar"><i class="fa-solid fa-xmark"></i></button><img alt=""><p></p>';
document.body.append(lb);
const lbImg = lb.querySelector('img');
const lbTxt = lb.querySelector('p');

function abrirImagem(src, legenda) {
  lbImg.hidden = false;
  lbImg.classList.remove('zoom');
  lbImg.src = src;
  lbImg.alt = legenda;
  lbTxt.textContent = legenda;
  lb.showModal();
}
lbImg.addEventListener('error', () => {
  lbImg.hidden = true;
  lbTxt.textContent = 'Imagem ainda não adicionada: ' + lbTxt.textContent;
});
lb.addEventListener('click', e => {
  if (e.target === lb || e.target.closest('.lb-close')) lb.close();
});

function rolarPara(el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

function mostrarPasso(f, id, rolar = true) {
  f.querySelectorAll('.passo').forEach(p => p.classList.toggle('on', p.id === id));
  if (rolar) f.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function ativarAba(bar, panels, i) {
  [...bar.children].forEach((b, j) => b.classList.toggle('on', j === i));
  panels.forEach((p, j) => p.classList.toggle('on', j === i));
}

function melhorarArtigo() {
  // o artigo já traz o próprio título
  if (card.querySelector('.art-head')) card.querySelector(':scope > h1')?.remove();

  // imagem que não existe vira uma caixa com a legenda
  card.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      const d = document.createElement('div');
      d.className = 'img-falta';
      d.innerHTML = '<i class="fa-regular fa-image"></i><span></span>';
      d.querySelector('span').textContent = img.alt || 'Imagem';
      img.replaceWith(d);
    }, { once: true });
  });

  // blocos de 2-3 colunas viram mini abas
  card.querySelectorAll('.trio').forEach(trio => {
    const cols = [...trio.children];
    const bar = document.createElement('div');
    bar.className = 'mini-tabs';
    cols.forEach(c => {
      const h = c.querySelector('h4');
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

  // fluxogramas de diagnóstico (Sim / Não)
  card.querySelectorAll('.fluxo').forEach(f => {
    f._hist = [];
    f.querySelectorAll('.passo').forEach(p => {
      const nav = document.createElement('div');
      nav.className = 'fluxo-nav';
      nav.innerHTML = '<button type="button" data-voltar>← Voltar</button><button type="button" data-reiniciar>↺ Recomeçar</button>';
      p.append(nav);
    });
    mostrarPasso(f, f.querySelector('.passo').id, false);
  });

  // códigos de falha em acordeão
  card.querySelectorAll('.codigos').forEach(c => c.classList.add('enh'));

  // cada título h2 vira uma aba
  const h2s = [...card.querySelectorAll(':scope > h2')];
  if (h2s.length >= 3) {
    const bar = document.createElement('div');
    bar.className = 'art-tabs';
    bar.setAttribute('role', 'tablist');
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
    panels.forEach((p, i) => {
      const nav = document.createElement('div');
      nav.className = 'aba-nav';
      nav.innerHTML =
        (i > 0 ? `<button type="button" data-aba="${i - 1}">← ${h2s[i - 1].textContent}</button>` : '<span></span>') +
        '<button type="button" data-indice>↑ Índice</button>' +
        (i < panels.length - 1 ? `<button type="button" data-aba="${i + 1}">${h2s[i + 1].textContent} →</button>` : '<span></span>');
      p.append(nav);
    });
    const lab = document.createElement('p');
    lab.className = 'art-index-title';
    lab.textContent = 'Neste artigo — toque numa seção';
    panels[0].before(lab, bar);
    card.querySelector('.toc')?.remove();
    ativarAba(bar, panels, 0);
  }
}

card.addEventListener('click', e => {
  const fl = e.target.closest('.fluxo');
  if (fl) {
    const ir = e.target.closest('[data-ir]');
    if (ir) { fl._hist.push(ir.closest('.passo').id); mostrarPasso(fl, ir.dataset.ir); return; }
    if (e.target.closest('[data-voltar]')) { const id = fl._hist.pop(); if (id) mostrarPasso(fl, id); return; }
    if (e.target.closest('[data-reiniciar]')) { fl._hist = []; mostrarPasso(fl, fl.querySelector('.passo').id); return; }
  }
  const tab = e.target.closest('.mini-tabs button, .art-tabs button');
  if (tab) {
    const bar = tab.parentElement;
    const principal = bar.classList.contains('art-tabs');
    const panels = [...bar.parentElement.querySelectorAll(principal ? ':scope > .art-panel' : ':scope > .mini-panel')];
    const idx = [...bar.children].indexOf(tab);
    ativarAba(bar, panels, idx);
    if (principal) rolarPara(window.innerWidth <= 960 ? panels[idx] : bar);
    return;
  }
  const nav = e.target.closest('[data-aba]');
  if (nav) {
    const bar = card.querySelector('.art-tabs');
    const panels = [...card.querySelectorAll(':scope > .art-panel')];
    ativarAba(bar, panels, +nav.dataset.aba);
    rolarPara(panels[+nav.dataset.aba]);
    return;
  }
  if (e.target.closest('[data-indice]')) { rolarPara(card.querySelector('.art-index-title')); return; }
  const cod = e.target.closest('.codigos.enh .codigo');
  if (cod && !e.target.closest('a')) { cod.classList.toggle('open'); return; }
  const link = e.target.closest('a.img-link');
  if (link) { e.preventDefault(); abrirImagem(link.href, link.textContent.trim()); return; }
  const im = e.target.closest('img');
  if (im) abrirImagem(im.currentSrc || im.src, im.alt);
});

cabecalho.classList.toggle('scrolled', window.scrollY > 20);

lbImg.addEventListener('click', () => lbImg.classList.toggle('zoom'));
