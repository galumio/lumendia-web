from pathlib import Path
import sys,json,re,unicodedata
sys.path.insert(0,str(Path('.local/python').resolve()))
from bs4 import BeautifulSoup
book=json.loads(Path('src/content/books/cuidar-a-mama-o-papa.json').read_text(encoding='utf-8'))
text=Path('.local/Cuidar-a-mama-o-papa-con-Alzheimer.txt').read_text(encoding='utf-8')
def norm(s):return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFD',s.lower()))
reference=norm(text)
checks=[]
for p in book['pages']:
    soup=BeautifulSoup(p['html'],'html.parser')
    for el in soup.select('.rel,.temas,.aviso-salud,.toc'):el.decompose()
    paragraphs=[x.get_text(' ',strip=True) for x in soup.select('p,.f-tx') if len(x.get_text())>40]
    matches=[norm(x) in reference for x in paragraphs]
    checks.append({'slug':p['slug'],'paragraphs':len(paragraphs),'exactNormalizedMatches':sum(matches),'unmatched':[p for p,m in zip(paragraphs,matches) if not m]})
Path('.local/pdf-comparison.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'paragraphs':sum(x['paragraphs'] for x in checks),'matched':sum(x['exactNormalizedMatches'] for x in checks),'unmatchedByPage':[{ 'slug':x['slug'],'count':len(x['unmatched'])} for x in checks if x['unmatched']]},ensure_ascii=False))
