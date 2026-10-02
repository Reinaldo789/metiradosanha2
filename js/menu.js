/* Menu e navegação. A lista de páginas vem de paginas.json:
   para criar ou renomear um item, edite apenas esse arquivo. */
const $ = s => document.querySelector(s);
const app = $('#app'), nav = $('#nav'), bg = $('#burger');
let MENUS = [];
const todos = m => m.grupos.flatMap(g => g.itens);
const card = (m, i) => `<a class="card" href="#/${m.slug}/${i.slug}"><span class="kick">${m.titulo}</span><h3>${i.titulo}</h3><p class="mut">Funcionamento, sintomas e diagnóstico.</p></a>`;

function montarMenu() {
  $('#menu').innerHTML = MENUS.map(m => {
    const d = m.destaque || {};
    const cols = m.grupos.map(g => `<div class="col"><h4>${g.titulo}</h4>${g.itens.map(i => `<a href="#/${m.slug}/${i.slug}">${i.titulo}</a>`).join('')}</div>`).join('');
    return `<li><a class="top" href="#/${m.slug}">${m.titulo}</a><div class="sub"><div class="mega"><a class="all" href="#/${m.slug}">Ver todos →</a><div class="cols">${cols}</div><a class="promo" href="#/${m.slug}"><span class="ico">${m.icone || ''}</span><small>${d.rotulo || m.titulo}</small><strong>${d.titulo || ''}</strong><p>${d.texto || ''}</p><span class="btn">${d.botao || 'Ver'} →</span></a></div></div></li>`;
  }).join('');
  const mob = () => matchMedia('(max-width:800px)').matches;
  document.querySelectorAll('#menu .top').forEach(t => t.addEventListener('click', e => {
    if (!mob()) return;
    e.preventDefault();
    const li = t.parentElement, aberto = li.classList.contains('open');
    document.querySelectorAll('#menu li.open').forEach(x => x.classList.remove('open'));
    if (!aberto) li.classList.add('open');
  }));
}

bg.onclick = () => {
  const o = nav.classList.toggle('open');
  bg.textContent = o ? '✕' : '☰';
  document.body.style.overflow = o ? 'hidden' : '';
};

function rota() {
  nav.classList.remove('open'); bg.textContent = '☰'; document.body.style.overflow = ''; scrollTo(0, 0);
  const [a, b] = location.hash.replace('#/', '').split('/');
  const M = MENUS.find(x => x.slug === a);
  if (!M) {
    const f = MENUS[0], fi = todos(f)[0];
    app.innerHTML = `<div class="hero"><a class="big" href="#/${f.slug}/${fi.slug}"><span class="kick">Destaque</span><h1>Guia técnico de sistemas do veículo</h1><p class="mut">Elétrica, alimentação de combustível, injeção, motor e chassi — tudo organizado em um só lugar.</p></a><div class="side">${MENUS.slice(1).map(m => `<a class="mini" href="#/${m.slug}"><span class="kick">Seção</span><h2>${m.titulo}</h2><p class="mut">${todos(m).length} tópicos</p></a>`).join('')}</div></div>`
      + MENUS.map(m => `<section class="sec"><h2>${m.titulo}</h2><div class="grid">${todos(m).slice(0, 4).map(i => card(m, i)).join('')}</div><p><a class="kick" href="#/${m.slug}">Ver todos →</a></p></section>`).join('');
    return;
  }
  const I = todos(M).find(x => x.slug === b);
  if (!I) {
    app.innerHTML = `<div class="crumb"><a href="#/">Início</a> › ${M.titulo}</div><h1>${M.titulo}</h1>` + M.grupos.map(g => `<section class="sec"><h2>${g.titulo}</h2><div class="grid">${g.itens.map(i => card(M, i)).join('')}</div></section>`).join('');
    return;
  }
  const L = todos(M), k = L.indexOf(I), p = L[k - 1], n = L[k + 1];
  const nav2 = `<div class="grid">${p ? `<a class="card" href="#/${M.slug}/${p.slug}">← ${p.titulo}</a>` : ''}${n ? `<a class="card" href="#/${M.slug}/${n.slug}">${n.titulo} →</a>` : ''}</div>`;
  const topo = `<div class="crumb"><a href="#/">Início</a> › <a href="#/${M.slug}">${M.titulo}</a> › ${I.titulo}</div><span class="kick">${M.titulo}</span><h1>${I.titulo}</h1>`;
  app.innerHTML = topo + '<p class="mut">Carregando…</p>';
  // O texto de cada página fica em conteudo/<menu>/<item>.html
  fetch(`conteudo/${M.slug}/${I.slug}.html`)
    .then(r => { if (!r.ok) throw 0; return r.text(); })
    .then(h => { if (location.hash.endsWith(`${M.slug}/${I.slug}`)) app.innerHTML = topo + `<article class="artigo">${h}</article>` + nav2; })
    .catch(() => { app.innerHTML = topo + '<p class="mut">Conteúdo em preparação.</p>' + nav2; });
}

fetch('paginas.json')
  .then(r => r.json())
  .then(d => { MENUS = d; montarMenu(); addEventListener('hashchange', rota); rota(); })
  .catch(() => { app.innerHTML = '<h1>Não foi possível carregar o menu</h1><p class="mut">Abra o site por um servidor (GitHub Pages ou <code>python -m http.server</code>); abrir o arquivo direto no navegador bloqueia o paginas.json.</p>'; });
