// Dados em formato JSON fornecidos
const menuData = [
  {
    "titulo": "Sistema Elétrico",
    "slug": "sistema-eletrico",
    "icone": "fa-bolt",
    "grupos": [
      {
        "titulo": "Luzes",
        "icone": "fa-lightbulb",
        "itens": [
          { "titulo": "Fusíveis e Lâmpadas", "slug": "fusiveis-e-lampadas" },
          { "titulo": "Luz de Farol e Posição", "slug": "luz-de-farol-e-posicao" },
          { "titulo": "Luz de Seta e Alerta", "slug": "luz-de-seta-e-alerta" }
        ]
      },
      {
        "titulo": "Painel de Instrumentos",
        "icone": "fa-gauge",
        "itens": [
          { "titulo": "Luz e Pressão de Óleo", "slug": "luz-e-pressao-de-oleo" },
          { "titulo": "Luzes de Injeção", "slug": "luzes-de-injecao" },
          { "titulo": "Água no Combustível", "slug": "agua-no-combustivel" },
          { "titulo": "Água de Arrefecimento", "slug": "agua-de-arrefecimento" }
        ]
      },
      {
        "titulo": "Acessórios",
        "icone": "fa-car-battery",
        "itens": [
          { "titulo": "Bateria", "slug": "bateria" },
          { "titulo": "Alternador", "slug": "alternador" },
          { "titulo": "Motor de Partida", "slug": "motor-de-partida" },
          { "titulo": "Limpador de Para-brisa", "slug": "limpador-de-para-brisa" }
        ]
      }
    ]
  },
  {
    "titulo": "Linha de Combustível",
    "slug": "linha-de-combustivel",
    "icone": "fa-gas-pump",
    "grupos": [
      {
        "titulo": "Linha de Baixa",
        "icone": "fa-filter",
        "itens": [
          { "titulo": "Tanque, Filtro, Mang.", "slug": "tanque-filtro-mang" },
          { "titulo": "Bomba Elétrica", "slug": "bomba-eletrica" },
          { "titulo": "Bomba Engrenagem", "slug": "bomba-engrenagem" },
          { "titulo": "Válvula KUV", "slug": "valvula-kuv" }
        ]
      },
      {
        "titulo": "Linha de Alta",
        "icone": "fa-gauge-high",
        "itens": [
          { "titulo": "Bomba Engrenagem", "slug": "bomba-engrenagem" },
          { "titulo": "Válvula KUV", "slug": "valvula-kuv" },
          { "titulo": "Bomba Alta Pressão", "slug": "bomba-alta-pressao" },
          { "titulo": "Tubo Rail", "slug": "tubo-rail" }
        ]
      }
    ]
  },
  {
    "titulo": "Sistema de Injeção",
    "slug": "sistema-de-injecao",
    "icone": "fa-microchip",
    "grupos": [
      {
        "titulo": "Sensores",
        "icone": "fa-microchip",
        "itens": [
          { "titulo": "Sensor Rotação", "slug": "sensor-rotacao" },
          { "titulo": "Sensor Fase", "slug": "sensor-fase" },
          { "titulo": "Sensor Pres. Adm", "slug": "sensor-pres-adm" },
          { "titulo": "Sensor Temp. ECM", "slug": "sensor-temp-ecm" },
          { "titulo": "Sensor Pres. Rail", "slug": "sensor-pres-rail" }
        ]
      },
      {
        "titulo": "Atuadores",
        "icone": "fa-sliders",
        "itens": [
          { "titulo": "Válvula MProp", "slug": "valvula-mprop" },
          { "titulo": "Pedal Acelerador", "slug": "pedal-acelerador" },
          { "titulo": "Modulador Turbina", "slug": "modulador-turbina" },
          { "titulo": "Bicos Injetores", "slug": "bicos-injetores" },
          { "titulo": "Lâmpada Painel", "slug": "lampada-painel" }
        ]
      }
    ]
  },
  {
    "titulo": "Motor e Chassi",
    "slug": "motor-e-chassi",
    "icone": "fa-wrench",
    "grupos": [
      {
        "titulo": "Sistema de Arrefecimento",
        "icone": "fa-snowflake",
        "itens": [
          { "titulo": "Correia e Ventoinha", "slug": "correia-e-ventoinha" },
          { "titulo": "Bomba de Água", "slug": "bomba-de-agua" },
          { "titulo": "Trocador de Calor", "slug": "trocador-de-calor" },
          { "titulo": "Válvula Termostática", "slug": "valvula-termostatica" }
        ]
      },
      {
        "titulo": "Sistema de Direção",
        "icone": "fa-dharmachakra",
        "itens": [
          { "titulo": "Bomba de Direção", "slug": "bomba-de-direcao" },
          { "titulo": "Caixa de Direção", "slug": "caixa-de-direcao" },
          { "titulo": "Óleo de Direção", "slug": "oleo-de-direcao" }
        ]
      },
      {
        "titulo": "Sistemas de Freios",
        "icone": "fa-circle-stop",
        "itens": [
          { "titulo": "Bomba de Vácuo", "slug": "bomba-de-vacuo" },
          { "titulo": "Cilindro de Freio", "slug": "cilindro-de-freio" },
          { "titulo": "Óleo de Freio", "slug": "oleo-de-freio" },
          { "titulo": "Pinças de Freio", "slug": "pincas-de-freio" },
          { "titulo": "Regulagem Freio de Mão", "slug": "regulagem-freio-de-mao" }
        ]
      }
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const navList = document.getElementById('nav-list');
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const toggleIcon = mobileToggleBtn.querySelector('i');

  // ==========================================
  // RENDERIZAR O MENU DINAMICAMENTE A PARTIR DO JSON
  // ==========================================
  function renderMenu() {
    let html = '';

    menuData.forEach(cat => {
      html += `
        <li class="nav-item">
          <button class="nav-btn">
            <span class="nav-btn-title">
              <i class="fa-solid ${cat.icone || 'fa-folder'} nav-icon"></i>
              <span>${cat.titulo}</span>
            </span>
            <i class="fa-solid fa-chevron-down arrow-icon"></i>
          </button>
          <div class="submenu">
      `;

      cat.grupos.forEach(grupo => {
        html += `
          <div class="submenu-group">
            <div class="group-title">
              <i class="fa-solid ${grupo.icone || 'fa-layer-group'}"></i> ${grupo.titulo}
            </div>
        `;

        grupo.itens.forEach(item => {
          const href = `#${cat.slug}/${item.slug}`;
          html += `
            <a href="${href}" class="sidebar-link">
              <i class="fa-solid fa-chevron-right"></i> ${item.titulo}
            </a>
          `;
        });

        html += `</div>`;
      });

      html += `
          </div>
        </li>
      `;
    });

    navList.innerHTML = html;
  }

  // Executa a construção do HTML do menu
  renderMenu();

  // ==========================================
  // COMPORTAMENTO SANFONA (ACCORDION)
  // ==========================================
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    const btn = item.querySelector('.nav-btn');
    
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha outros menus abertos
      navItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      // Alterna a categoria clicada
      item.classList.toggle('active', !isActive);
    });
  });

  // ==========================================
  // COMPORTAMENTO MOBILE / GAVETA
  // ==========================================
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

  // ==========================================
  // BOTÃO FLUTUANTE VOLTAR AO TOPO
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
  // CARREGAR CONTEÚDO DINÂMICO
  // ==========================================
  const home = document.getElementById('home-box');
  const card = document.getElementById('page-card');

  async function abrirPagina() {
    const path = decodeURIComponent(location.hash.slice(1)).replace(/^\/+/, '');
    
    // Desmarca todos os links ativos
    document.querySelectorAll('.sidebar-link.active').forEach(a => a.classList.remove('active'));

    // Caso não haja rota válida na URL -> Mostra a Home
    if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(path)) {
      card.hidden = true; 
      home.hidden = false;
      return;
    }

    const link = document.querySelector(`a[href="#${path}"]`);
    if (link) {
      link.classList.add('active');
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
      card.innerHTML = `<h1>Erro</h1><p>${err.message}. Se estiver a testar localmente, abra o projeto via servidor web (ex: Live Server do VS Code ou GitHub Pages).</p>`;
    }
  }

  // Fecha o menu lateral no telemóvel ao clicar num link
  document.querySelectorAll('.sidebar-link').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 960 && sidebar.classList.contains('open')) {
        toggleMobileSidebar();
      }
    });
  });

  window.addEventListener('hashchange', abrirPagina);
  abrirPagina();
});
