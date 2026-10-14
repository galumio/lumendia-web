import {readFileSync,readdirSync,existsSync,statSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
const read=p=>readFileSync(p,'utf8').replace(/^\uFEFF/,'');
const config=JSON.parse(read('site.config.json'));
const books=readdirSync('src/content/books').filter(f=>f.endsWith('.json')).map(f=>JSON.parse(read('src/content/books/'+f)));
const failures=[];let checks=0;
const assert=(value,message)=>{checks++;if(!value)failures.push(message)};
const walk=dir=>existsSync(dir)?readdirSync(dir).flatMap(f=>{const p=join(dir,f);return statSync(p).isDirectory()?walk(p):[p]}):[];
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const premium=['5ed6a7780d59997655fbacaf746093cfe3aa7923c5a548808d9f6db24c2a6162','f8d6bf11c4428aa254faeb3bd3026492a77ab1ba5289096b1e8e701177b2d71f'];
for(const b of books){assert(b.toc.filter(c=>/^\d+$/.test(c.number)&&Number(c.number)>0).length===25,'Deben existir 25 capítulos');assert(b.situations.length===50,'Deben existir 50 situaciones');assert(new Set(b.situations.map(s=>s.id)).size===50,'Situaciones duplicadas');for(const s of b.situations){const page=b.pages.find(p=>p.slug===s.topic);assert(page?.html.includes(`id="${s.id}"`),'Situación sin ancla '+s.id);for(const label of ['Qué está pasando','Qué hacer','Qué decir','Qué evitar','Cuándo consultar'])assert(s.text.includes(label),`${s.id}: falta ${label}`)}assert((b.pages.find(p=>p.slug==='cuatro-escenas')?.html.match(/<h2/g)||[]).length===4,'Deben existir cuatro escenas');for(const p of b.pages){assert(!/COMPRAR|FORMULARIO|<script|<form|onsubmit=/.test(p.html),'Contenido importado no seguro: '+p.slug);assert(p.html.includes('aviso-salud'),'Falta advertencia: '+p.slug)}}
// Uso: node scripts/validate.mjs [carpetas...]; por defecto public, dist y .preview.
const dirs=process.argv.slice(2).length?process.argv.slice(2):['public','dist','.preview'];
for(const dir of dirs){
 const files=walk(dir);for(const path of files){if(path.toLowerCase().endsWith('.pdf')){assert(!premium.includes(hash(path)),`PDF premium en ${path}`);assert(path.toLowerCase().endsWith('hoja-de-emergencia-del-cuidador.pdf'),`PDF no permitido ${path}`)}}
 if(!existsSync(dir)||dir==='public')continue;
 const htmlFiles=files.filter(f=>f.endsWith('.html'));const titles=new Set();
 for(const file of htmlFiles){const html=read(file);const title=html.match(/<title>(.*?)<\/title>/s)?.[1];assert(!!title&&!titles.has(title),'Título faltante/duplicado '+file);titles.add(title);assert((html.match(/<h1(?:\s|>)/g)||[]).length===1,'H1 inválido '+file);assert(/rel="canonical"/.test(html),'Falta canonical '+file);assert(/name="description"/.test(html),'Falta descripción '+file);assert(/property="og:image"/.test(html),'Falta imagen OG '+file);assert(!/href="#COMPRAR"|action="#"/.test(html),'Placeholder público '+file);
 for(const match of html.matchAll(/(?:href|src)="(\/[^"\s]*)"/g)){const url=new URL(match[1].replace(/&amp;/g,'&'),'https://lumendia.com.ar');const dest=join(dir,decodeURIComponent(url.pathname),url.pathname.endsWith('/')?'index.html':'');assert(existsSync(dest),`Enlace roto ${file} → ${match[1]}`);if(url.hash&&existsSync(dest)&&dest.endsWith('.html')){const anchor=decodeURIComponent(url.hash.slice(1));assert(read(dest).includes(`id="${anchor}"`),`Ancla rota ${file} → ${match[1]}`)}}
 }
 if(dir==='dist'&&!config.editorial.approved){assert(!existsSync('dist/libros'),'Se publicaría contenido pendiente');assert(!files.some(f=>f.endsWith('.pdf')),'Se publicaría recurso sanitario pendiente');assert(!read('dist/sitemap.xml').includes('/libros/'),'Sitemap expone contenido pendiente')}
 if(dir==='dist-library'){assert(htmlFiles.length===49,'Número de páginas de producción inesperado: '+htmlFiles.length);for(const file of htmlFiles)assert(!/noindex/.test(read(file)),'noindex en producción '+file);assert(read('dist-library/CNAME').trim()==='lumendia.com.ar','CNAME incorrecto');assert(existsSync('dist-library/.nojekyll'),'Falta .nojekyll');assert(read('dist-library/sitemap.xml').includes('/libros/'),'Sitemap sin libros');assert(!read('dist-library/robots.txt').includes('Disallow: /'),'robots bloquea el sitio');assert(hash('dist-library/recursos/hoja-de-emergencia-del-cuidador.pdf')==='abc5f12181054f412b911a93d75407dbb1a80124fbf726b7c7e0a009b7e26ba5','Descarga alterada');assert(read('dist-library/libros/cuidar-a-mama-o-papa/index.html').includes('href="https://galumio.com.ar/productos/cuidar-alzheimer-demencia/"'),'Falta enlace premium a Galumio')}
 if(dir==='.preview'){assert(htmlFiles.length===49,'Número de páginas de revisión inesperado: '+htmlFiles.length);assert(hash('.preview/recursos/hoja-de-emergencia-del-cuidador.pdf')==='abc5f12181054f412b911a93d75407dbb1a80124fbf726b7c7e0a009b7e26ba5','Descarga alterada')}
}
mkdirSync('.local',{recursive:true});writeFileSync('.local/validation.json',JSON.stringify({checks,failures},null,2));console.log(`${checks} comprobaciones; ${failures.length} errores.`);if(failures.length){console.error(failures.join('\n'));process.exit(1)}
