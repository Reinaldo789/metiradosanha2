document.addEventListener("DOMContentLoaded", () => {
  // Elementos do DOM
  const mobileToggleBtn = document.getElementById("mobile-toggle-btn");
  const mainNav = document.getElementById("main-nav");
  const navItems = document.querySelectorAll(".nav-item");
  const btnTop = document.getElementById("btn-top");
  const pageCard = document.getElementById("page-card");
  const homeBox = document.getElementById("home-box");

  /* ==========================================================================
     1. MENU MOBILE (TOGGLE)
     ========================================================================== */
  mobileToggleBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("active");

    // Altera ícone do botão hamburger
    const icon = mobileToggleBtn.querySelector("i");
    if (isOpen) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");
      document.body.style.overflow = "hidden"; // Previne scroll da página
    } else {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
      document.body.style.overflow = ""; // Restaura scroll
    }
  });

  /* ==========================================================================
     2. ABERTURA/FECHAMENTO DOS MEGA MENUS (ACCORDION NO MOBILE & CLICK)
     ========================================================================== */
  navItems.forEach((item) => {
    const btn = item.querySelector(".nav-btn");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const isActive = item.classList.contains("active");

      // Fecha outros submenus abertos
      navItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });

      // Alterna o estado do submenu atual
      item.classList.toggle("active", !isActive);
    });
  });

  // Fecha menus ao clicar fora deles (no Desktop)
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".main-nav") && window.innerWidth > 992) {
      navItems.forEach((item) => item.classList.remove("active"));
    }
  });

  /* ==========================================================================
     3. NAVEGAÇÃO DE CONTEÚDO DINÂMICO (SPA MOCK)
     ========================================================================== */
  const megaLinks = document.querySelectorAll(".mega-link-item, .explore-link");

  megaLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href && href.startsWith("#")) {
        e.preventDefault();

        // Extrai o título limpo do link clicado
        const linkText = this.textContent.trim();

        // Atualiza a visualização do card de conteúdo
        pageCard.innerHTML = `
          <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--primary);">${linkText}</h2>
          <p style="color: var(--text-muted);">Conteúdo carregado dinamicamente para o tópico: <strong>${href}</strong></p>
        `;
        pageCard.removeAttribute("hidden");

        // Scroll suave até o conteúdo
        pageCard.scrollIntoView({ behavior: "smooth", block: "start" });

        // Fecha o menu no mobile após seleção
        if (window.innerWidth <= 992) {
          mainNav.classList.remove("active");
          mobileToggleBtn.querySelector("i").classList.remove("fa-xmark");
          mobileToggleBtn.querySelector("i").classList.add("fa-bars");
          document.body.style.overflow = "";
          navItems.forEach((item) => item.classList.remove("active"));
        }
      }
    });
  });

  /* ==========================================================================
     4. BOTÃO VOLTAR AO TOPO
     ========================================================================== */
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btnTop.classList.add("visible");
    } else {
      btnTop.classList.remove("visible");
    }
  });

  btnTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});
