"""Importa un ebook con la plantilla HTML estándar (índice .toc + capítulos en <main>).

Uso: python -I scripts/import_book.py scripts/books/<slug>.json

El manifiesto contiene solo metadatos y rutas a los originales en .local/. El resultado
(src/content/books/<slug>.json) está ignorado por Git: el texto nunca entra al repositorio.
Se conserva el texto exacto de cada capítulo; solo se quitan navegación, anuncios,
formularios y llamadas a compra, y se comprueba con un hash del texto retenido.
"""
from pathlib import Path
import sys, json, hashlib, zipfile

root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root / '.local/python'))
import pymupdf as fitz
from bs4 import BeautifulSoup, Comment

manifest = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
slug = manifest['slug']
book_url = f'/libros/{slug}/'

with zipfile.ZipFile(root / manifest['zip']) as archive:
    files = {Path(n).name: archive.read(n).decode('utf-8') for n in archive.namelist()
             if n.startswith(manifest['zipFolder'] + '/') and n.endswith('.html')}

index = BeautifulSoup(files['index.html'], 'html.parser')
toc = []
for a in index.select('.toc a'):
    span = a.select_one('span')
    small = span.small.extract() if span.small else None
    toc.append({'slug': a['href'].replace('.html', ''), 'title': span.get_text(' ', strip=True),
                'number': a.b.get_text(strip=True), 'description': small.get_text(' ', strip=True) if small else ''})
assert len(toc) == manifest['expectedChapters'], f'Índice con {len(toc)} capítulos'

pages = []
for entry in toc:
    soup = BeautifulSoup(files[entry['slug'] + '.html'], 'html.parser')
    main = soup.main
    for node in main.select('.cta,.anuncio,.migas,.navcap,form'):
        node.decompose()
    for node in main.find_all(string=lambda t: isinstance(t, Comment)):
        node.extract()
    original_text = main.get_text(' ', strip=True)
    for a in main.select('a[href]'):
        href = a['href']
        assert not href.startswith('#COMPRAR'), 'Quedó un enlace de compra sin destino'
        if '.html' in href and not href.startswith(('https:', 'http:')):
            file, sep, anchor = href.partition('#')
            a['href'] = book_url + ('' if file == 'index.html' else file.replace('.html', '') + '/') + (('#' + anchor) if sep else '')
    for node in main.select('[style]'):
        del node['style']
    html = ''.join(str(n) for n in main.contents).strip()
    assert BeautifulSoup(html, 'html.parser').get_text(' ', strip=True) == original_text
    assert '<script' not in html and '<form' not in html and 'onsubmit' not in html
    pages.append({'slug': entry['slug'], 'title': main.h1.get_text(' ', strip=True),
                  'description': soup.select_one('meta[name=description]')['content'], 'html': html,
                  'words': len(original_text.split()), 'textHash': hashlib.sha256(original_text.encode()).hexdigest()})

pdf = fitz.open(root / manifest['pdf'])
pdf[0].get_pixmap(matrix=fitz.Matrix(1.6, 1.6)).save(str(root / manifest['coverImage']), jpg_quality=82)

book = dict(manifest['book'])
book.update({
    'description': index.select_one('.hero p').get_text(' ', strip=True),
    'printPages': len(pdf),
    'toc': [{'slug': t['slug'], 'title': t['title'], 'number': t['number']} for t in toc],
    'topics': [], 'situations': [], 'pages': pages,
})
out = root / 'src/content/books' / f'{slug}.json'
out.write_text(json.dumps(book, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'book': slug, 'chapters': len(pages), 'printPages': len(pdf),
                  'words': sum(p['words'] for p in pages), 'cover': manifest['coverImage']}, ensure_ascii=False))
