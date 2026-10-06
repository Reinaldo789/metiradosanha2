/**
 * menu.js - Gestão de navegação por separadores (Tabs)
 */

function switchTab(event, tabId) {
  // 1. Remover a classe 'active' de todos os botões de separadores
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => btn.classList.remove('active'));

  // 2. Ocultar todos os painéis de conteúdo
  const tabPanes = document.querySelectorAll('.tab-pane');
  tabPanes.forEach(pane => pane.classList.remove('active'));

  // 3. Ativar o botão que foi clicado
  event.currentTarget.classList.add('active');

  // 4. Exibir o painel correspondente ao ID passado
  const targetPane = document.getElementById(tabId);
  if (targetPane) {
    targetPane.classList.add('active');
  }
}
