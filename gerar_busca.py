#!/usr/bin/env python3
"""Gera busca.json com o texto e os códigos de falha (P0xxx etc.) de cada página.
Uso: na raiz do site (onde está a pasta conteudo/), rode:  python gerar_busca.py
Rode de novo sempre que mudar o conteúdo de alguma página."""
import json, re, sys, unicodedata
from html import unescape
from pathlib import Path

RAIZ = Path(__file__).resolve().parent if Path(__file__).parent.joinpath("conteudo").exists() else Path.cwd()
CONTEUDO = RAIZ / "conteudo"
COD = re.compile(r"\b[PUCB][0-9A-F]{4}\b", re.I)

def norm(s):
    s = unicodedata.normalize("NFD", s)
    return "".join(c for c in s if not unicodedata.combining(c)).lower()

def texto_puro(html):
    html = re.sub(r"<!--.*?-->", " ", html, flags=re.S)
    html = re.sub(r"<(script|style)\b.*?</\1>", " ", html, flags=re.S | re.I)
    t = unescape(re.sub(r"<[^>]+>", " ", html))
    return re.sub(r"\s+", " ", t).strip()

# títulos oficiais do paginas.json (se existir)
titulos = {}
pj = RAIZ / "paginas.json"
if pj.exists():
    for sis in json.loads(pj.read_text(encoding="utf-8")):
        for g in sis.get("grupos", []):
            for it in g.get("itens", []):
                titulos[(sis["slug"], it["slug"])] = it["titulo"]

indice = []
if not CONTEUDO.exists():
    sys.exit(f"Pasta não encontrada: {CONTEUDO}")
for arq in sorted(CONTEUDO.glob("*/*.html")):
    menu, slug = arq.parent.name, arq.stem
    if menu == "imagens":
        continue
    html = arq.read_text(encoding="utf-8", errors="ignore")
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)
    titulo = titulos.get((menu, slug)) or (texto_puro(h1.group(1)) if h1 else slug.replace("-", " ").title())
    txt = texto_puro(html)
    codigos = sorted({c.upper() for c in COD.findall(txt)})
    indice.append({"url": f"#{menu}/{slug}", "menu": menu, "slug": slug,
                   "titulo": titulo, "codigos": codigos, "texto": norm(txt)})

Path(RAIZ / "busca.json").write_text(json.dumps(indice, ensure_ascii=False), encoding="utf-8")
com_cod = sum(1 for p in indice if p["codigos"])
print(f"{len(indice)} páginas indexadas, {com_cod} com códigos de falha -> busca.json")
