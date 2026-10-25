// Cole no seu JS da busca (ou adapte). Usa o busca.json gerado por gerar_busca.py.
let _indiceBusca;
async function carregarIndice() {
  if (!_indiceBusca) _indiceBusca = await (await fetch('busca.json')).json();
  return _indiceBusca;
}
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Devolve até 10 páginas: título > código exato > código parcial > texto da página
async function buscar(termo) {
  const q = norm(termo.trim());
  if (q.length < 2) return [];
  const indice = await carregarIndice();
  return indice
    .map(p => {
      let n = 0;
      if (norm(p.titulo).includes(q)) n += 100;
      if (p.codigos.some(c => c.toLowerCase() === q)) n += 80;
      else if (p.codigos.some(c => c.toLowerCase().includes(q))) n += 50;
      if (p.texto.includes(q)) n += 10;
      return { ...p, n };
    })
    .filter(p => p.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 10);   // cada item tem .titulo e .url (ex.: "#diagnostico/tensao-sensores")
}
