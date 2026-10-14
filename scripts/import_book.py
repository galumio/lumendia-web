"""Importa un ebook con la plantilla HTML estándar (índice .toc + capítulos en <main>).

Uso: python -I scripts/import_book.py scripts/books/<slug>.json

El manifiesto contiene solo metadatos y rutas a los originales en .local/. El resultado
(src/content/books/<slug>.json) está ignorado por Git: el texto nunca entra al repositorio.
Se conserva el texto exacto de cada capítulo; solo se quitan navegación, anuncios,
formularios y llamadas a compra, y se comprueba con un hash del texto retenido.
"""
from pathlib import Path
import sys, json, hashlib, re, zipfile

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
    # Portada incluida en el ZIP (opcional); si no, se renderiza la primera página del PDF.
    cover_bytes = archive.read(manifest['zipFolder'] + '/' + manifest['coverFromZip']) if manifest.get('coverFromZip') else None

index = BeautifulSoup(files['index.html'], 'html.parser')
toc = []
for a in index.select('.toc a'):
    span = a.select_one('span')
    small = span.small.extract() if span.small else None
    toc.append({'slug': a['href'].replace('.html', ''), 'title': span.get_text(' ', strip=True),
                'number': a.b.get_text(strip=True), 'description': small.get_text(' ', strip=True) if small else ''})
assert len(toc) == manifest['expectedChapters'], f'Índice con {len(toc)} capítulos'
if manifest.get('chapterOrder'):
    assert [t['slug'] for t in toc] == manifest['chapterOrder'], 'El índice del ZIP no coincide con el orden del manifiesto'

# Opciones por libro: qué bloques de la plantilla se quitan y a dónde apuntan los enlaces #COMPRAR.
remove = manifest.get('removeSelectors', '.cta,.anuncio,.migas,.navcap,form')
buy_url = manifest.get('buyUrl')

pages = []
for entry in toc:
    soup = BeautifulSoup(files[entry['slug'] + '.html'], 'html.parser')
    main = soup.main
    for node in main.select(remove):
        node.decompose()
    for node in main.find_all(string=lambda t: isinstance(t, Comment)):
        node.extract()
    original_text = main.get_text(' ', strip=True)
    for a in main.select('a[href]'):
        href = a['href']
        if href.startswith('#COMPRAR'):
            assert buy_url, 'Quedó un enlace de compra sin destino'
            a['href'] = buy_url
            a['rel'] = 'noopener'
            continue
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

# Muestras parciales: solo pueden aparecer los prompts numerados autorizados, una vez cada uno.
if 'allowedNumberedPrompts' in manifest:
    found = [int(n) for p in pages for n in re.findall(r'PROMPT\s+(\d+)', BeautifulSoup(p['html'], 'html.parser').get_text(' '))]
    assert sorted(found) == sorted(manifest['allowedNumberedPrompts']), f'Prompts numerados no autorizados: {sorted(found)}'

pdf = fitz.open(root / manifest['pdf']) if manifest.get('pdf') else None
if cover_bytes:
    (root / manifest['coverImage']).write_bytes(cover_bytes)
else:
    pdf[0].get_pixmap(matrix=fitz.Matrix(1.6, 1.6)).save(str(root / manifest['coverImage']), jpg_quality=82)
print_pages = manifest.get('printPages') or len(pdf)

book = dict(manifest['book'])
book.update({
    'description': index.select_one('.hero p').get_text(' ', strip=True),
    'printPages': print_pages,
    'toc': [{'slug': t['slug'], 'title': t['title'], 'number': t['number']} for t in toc],
    'topics': [], 'situations': [], 'pages': pages,
})
out = root / 'src/content/books' / f'{slug}.json'
out.write_text(json.dumps(book, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'book': slug, 'chapters': len(pages), 'printPages': print_pages,
                  'words': sum(p['words'] for p in pages), 'cover': manifest['coverImage']}, ensure_ascii=False))
