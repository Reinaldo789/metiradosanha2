function switchTab(event, tabId) {
  // 1. Desativa todas as abas
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  // 2. Esconde todos os painéis
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

  // 3. Ativa a aba e o painel correspondente ao clique
  event.currentTarget.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}
