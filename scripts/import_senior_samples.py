"""Extract only the selected excerpts from the local commercial originals.

No PDF is copied to public/. Re-running verifies source hashes before writing.
The manifests contain locations and hashes, never the manuscript text.
"""
from pathlib import Path
import hashlib, html, json, re, sys

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / '.local/python'))
import pymupdf
from PIL import Image, ImageOps

def digest(data):
    return hashlib.sha256(data).hexdigest()

def normalize(text):
    return ' '.join(text.split())

for path in sorted((ROOT / 'scripts/books').glob('*-sample.json')):
    manifest = json.loads(path.read_text(encoding='utf-8'))
    source = ROOT / manifest['source']
    assert digest(source.read_bytes()) == manifest['sourceSha256'], 'Original changed'
    cover = ROOT / manifest['coverSource']
    assert digest(cover.read_bytes()) == manifest['coverSha256'], 'Cover changed'
    pdf = pymupdf.open(source)
    texts = []
    for page in pdf:
        lines = page.get_text().strip().splitlines()
        if lines and lines[-1].strip().isdigit():
            lines.pop()  # Printed page number, not manuscript text.
        texts.append(normalize(' '.join(lines)))
    pages = []
    evidence = []
    for selection in manifest['selections']:
        parts = []
        retained = []
        for segment in selection['segments']:
            pool = ' '.join(texts[n-1] for n in segment['pdfPages'])
            start = pool.index(segment['start'])
            end = pool.index(segment['end'], start) if segment.get('end') else len(pool)
            excerpt = pool[start:end].strip()
            assert excerpt and '\ufffd' not in excerpt
            tag = segment.get('tag', 'p')
            assert tag in ('p', 'h2', 'aside')
            # Lists keep the exact words; only their visual numbering becomes HTML.
            if segment.get('list'):
                marker = r'\s*•\s*' if segment['list'] == 'ul' else r'(?:^|\s)\d+\.\s+'
                items = [x.strip() for x in re.split(marker, excerpt) if x.strip()]
                parts.append('<'+segment['list']+'>'+''.join('<li>'+html.escape(x)+'</li>' for x in items)+'</'+segment['list']+'>')
            else:
                parts.append(f'<{tag}>'+html.escape(excerpt)+f'</{tag}>')
            retained.append(excerpt)
            evidence.append({'page': selection['slug'], 'pdfPages': segment['pdfPages'], 'sha256': digest(excerpt.encode()), 'text': excerpt})
        content = '<h1>'+html.escape(selection['title'])+'</h1>'+''.join(parts)
        pages.append({'slug':selection['slug'], 'title':selection['title'], 'description':selection['description'], 'html':content, 'words':len(' '.join(retained).split()), 'textHash':digest(' '.join(retained).encode())})
    book = manifest['book']
    book.update(pages=pages, toc=[{'slug':p['slug'],'title':p['title'],'number':f'{i+1:02}'} for i,p in enumerate(pages)], topics=[], situations=[], resources=[])
    assert sum(p['words'] for p in pages) < len(' '.join(texts).split()) * .15, 'Sample exceeds 15%'
    output = ROOT / 'src/content/books' / (book['slug']+'.json')
    if '--check' in sys.argv:
        assert json.loads(output.read_text(encoding='utf-8')) == book, 'Sample differs from the selected original excerpts'
        print(book['slug'], 'verified against original PDF')
        continue
    output.write_text(json.dumps(book,ensure_ascii=False,indent=2),encoding='utf-8')
    with Image.open(cover) as original:
        optimized = ImageOps.exif_transpose(original).convert('RGB')
        optimized.thumbnail((960,1360))
        optimized.save(ROOT / 'public' / book['cover'].lstrip('/'), 'JPEG', quality=85, optimize=True, progressive=True)
    (ROOT / '.local' / (book['slug']+'-provenance.json')).write_text(json.dumps({'sourceSha256':manifest['sourceSha256'],'totalPdfPages':len(pdf),'sampleWords':sum(p['words'] for p in pages),'sourceWords':len(' '.join(texts).split()),'excerpts':evidence},ensure_ascii=False,indent=2),encoding='utf-8')
    print(book['slug'], sum(p['words'] for p in pages), 'sample words; original PDF pages:', len(pdf))
