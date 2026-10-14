from pathlib import Path
import sys, json, hashlib, re, shutil
sys.path.insert(0, str(Path('.local/python').resolve()))
import fitz
from bs4 import BeautifulSoup, Comment

root=Path('.local/extracted/cuidar-a-mama-o-papa-con-alzheimer')
out=Path('src/content/books'); out.mkdir(parents=True, exist_ok=True)
assets=Path('public/images'); assets.mkdir(parents=True, exist_ok=True)
report={'pdfs':[], 'sources':[], 'editorialNotes':[]}
for p in Path('.local/originals').glob('*.pdf'):
    doc=fitz.open(p)
    report['pdfs'].append({'file':p.name,'pages':len(doc),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
    Path('.local/'+p.stem+'.txt').write_text('\n'.join(page.get_text() for page in doc),encoding='utf-8')
    doc[0].get_pixmap(matrix=fitz.Matrix(1,1)).save('.local/'+p.stem+'.png')
    if p.name.startswith('Cuidar-a-'):
        pix=doc[0].get_pixmap(matrix=fitz.Matrix(1.6,1.6))
        pix.save(str(assets/'cuidar-portada.jpg'))
index=BeautifulSoup((root/'index.html').read_text(encoding='utf-8'),'html.parser')
toc=[{'slug':a['href'].replace('.html',''),'title':a.select_one('span').get_text(),'number':a.select_one('b').get_text()} for a in index.select('.toc a')]
topics=[{'slug':a['href'].replace('.html',''),'title':a.contents[0].strip(),'description':a.span.get_text()} for a in index.select('.temas')[0].select('a')]
pages=[]; situations=[]
for p in sorted(root.glob('*.html')):
    if p.stem=='index': continue
    soup=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    main=soup.main
    # Only replace the surrounding navigation, commercial blocks and ad placeholders.
    for node in main.select('.cta,.anuncio,.migas,.navcap'): node.decompose()
    for node in main.find_all(string=lambda t:isinstance(t,Comment)): node.extract()
    original_text=main.get_text(' ',strip=True)
    title=main.h1.get_text(' ',strip=True)
    for a in main.select('a[href]'):
        href=a['href']
        if '.html' in href and not href.startswith(('https:','http:')):
            file,sep,anchor=href.partition('#')
            a['href']='/libros/cuidar-a-mama-o-papa/'+('' if file=='index.html' else file.replace('.html','')+'/')+(('#'+anchor) if sep else '')
        if href=='#COMPRAR': a['href']='/libros/cuidar-a-mama-o-papa/#kit'
    for node in main.select('[style]'): del node['style']
    for card in main.select('.ficha[id]'):
        situations.append({'id':card['id'],'title':card.h2.get_text(' ',strip=True),'topic':p.stem,'text':card.get_text(' ',strip=True)})
    html=''.join(str(n) for n in main.contents)
    assert BeautifulSoup(html,'html.parser').get_text(' ',strip=True)==original_text
    pages.append({'slug':p.stem,'title':title,'description':soup.select_one('meta[name=description]')['content'],'html':html,'words':len(original_text.split()),'textHash':hashlib.sha256(original_text.encode()).hexdigest()})
    report['sources'].append({'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'retainedTextHash':pages[-1]['textHash']})
assert len(pages)==37 and len(situations)==50
assert sorted(int(s['id'].split('-')[1]) for s in situations)==list(range(1,51))
book={'slug':'cuidar-a-mama-o-papa','title':'Cuidar a mamá o papá con Alzheimer o demencia','subtitle':'Qué hacer, qué decir y cómo acompañar sin perderte tú en el camino.','category':'Salud y cuidados','audience':'Familias y cuidadores','description':'Una guía práctica para acompañar a mamá o papá, comprender los cambios y organizar el cuidado cotidiano sin olvidarte de vos.','cover':'/images/cuidar-portada.jpg','editorialStatus':'pending','toc':toc,'topics':topics,'pages':pages,'situations':sorted(situations,key=lambda s:int(s['id'].split('-')[1]))}
book.update({'printPages':68,'publisher':'Galumio Studio','resource':'caregiver-emergency','premium':{'title':'Kit completo del cuidador','description':'Tu guía para leer sin conexión, imprimir y consultar en familia.','items':['Ebook de 68 páginas con el cuaderno del cuidador incluido.','El cuaderno de 12 hojas también en archivo aparte, para imprimir.'],'url':None}})
(out/'cuidar-a-mama-o-papa.json').write_text(json.dumps(book,ensure_ascii=False,indent=2),encoding='utf-8')
report['editorialNotes']=['Contenido sanitario pendiente de revisión profesional acreditada. No se autoriza su publicación.','El ZIP excluye las 12 hojas del cuaderno; se conservan como producto PDF premium según el material suministrado.','Se retiraron formularios, anuncios vacíos, navegación y promociones originales; no se modificó el texto educativo.','La verificación automática de integridad compara el texto de cada cuerpo HTML retenido; no constituye revisión clínica.']
Path('.local/inspection.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'pdfs':report['pdfs'],'htmlPages':len(pages),'situations':len(situations),'toc':len(toc)},ensure_ascii=False))


