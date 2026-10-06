function toggleAccordion(button) {
  const item = button.parentElement;
  const content = item.querySelector('.accordion-content');
  const isOpen = item.classList.contains('active');

  // Fecha todos os outros submenus abertos (Efeito Acordeão)
  document.querySelectorAll('.accordion-item').forEach(otherItem => {
    if (otherItem !== item) {
      otherItem.classList.remove('active');
      const otherContent = otherItem.querySelector('.accordion-content');
      if (otherContent) {
        otherContent.style.maxHeight = null;
      }
    }
  });

  // Alterna o estado do item clicado
  if (isOpen) {
    item.classList.remove('active');
    content.style.maxHeight = null;
  } else {
    item.classList.add('active');
    // Calcula a altura real do conteúdo para abrir suavemente
    content.style.maxHeight = content.scrollHeight + "px";
  }
}
