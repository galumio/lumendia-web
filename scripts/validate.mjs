// Validación estática de contenido y salidas compiladas.
// Uso: node scripts/validate.mjs [carpetas...] [--dry-run]; por defecto public, dist y .preview.
// --dry-run admite en dist-library libros todavía no aprobados (ensayo local, nunca publicable).
import {readFileSync,readdirSync,existsSync,statSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {loadBooks,publishable} from './release-library.mjs';
const read=p=>readFileSync(p,'utf8').replace(/^\uFEFF/,'');
const books=loadBooks();
const failures=[];let checks=0;
const assert=(value,message)=>{checks++;if(!value)failures.push(message)};
const walk=dir=>existsSync(dir)?readdirSync(dir).flatMap(f=>{const p=join(dir,f);return statSync(p).isDirectory()?walk(p):[p]}):[];
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
// PDF premium (Alzheimer: libro y cuaderno; Cómo estudiar: libro y plantillas sueltas).
const premium=['5ed6a7780d59997655fbacaf746093cfe3aa7923c5a548808d9f6db24c2a6162','f8d6bf11c4428aa254faeb3bd3026492a77ab1ba5289096b1e8e701177b2d71f','f5786c9052eb5aadc1b4bc362d12e70d5f9491da811f0cbc90d45199944263c5','87a1250fb70a77e9ddfab8c3af942dd0a97b1b4b710e46d48f4b0b0e24927247'];
const freeResources=books.flatMap(b=>b.resources??[]);

for(const b of books){
 const order=b.readingOrder??b.toc.map(c=>c.slug);
 assert(b.pages.every(p=>order.includes(p.slug))&&order.every(s=>b.pages.some(p=>p.slug===s)),`${b.slug}: el orden de lectura no coincide con las páginas`);
 for(const c of b.toc)assert(b.pages.some(p=>p.slug===c.slug),`${b.slug}: índice sin página ${c.slug}`);
 for(const p of b.pages){assert(!/#COMPRAR|FORMULARIO:|ANUNCIO:|ADSENSE|<script|<form[\s>]|<iframe|\son[a-z]+=/i.test(p.html),`${b.slug}: contenido importado no seguro: ${p.slug}`);if(b.healthContent!==false)assert(p.html.includes('aviso-salud'),`${b.slug}: falta advertencia sanitaria: ${p.slug}`)}
 if(b.slug==='cuidar-a-mama-o-papa'){
  assert(b.healthContent===true,'Alzheimer debe estar marcado como contenido sanitario');
  assert(b.toc.filter(c=>/^\d+$/.test(c.number)&&Number(c.number)>0).length===25,'Deben existir 25 capítulos');assert(b.situations.length===50,'Deben existir 50 situaciones');assert(new Set(b.situations.map(s=>s.id)).size===50,'Situaciones duplicadas');
  for(const s of b.situations){const page=b.pages.find(p=>p.slug===s.topic);assert(page?.html.includes(`id="${s.id}"`),'Situación sin ancla '+s.id);for(const label of ['Qué está pasando','Qué hacer','Qué decir','Qué evitar','Cuándo consultar'])assert(s.text.includes(label),`${s.id}: falta ${label}`)}
  assert((b.pages.find(p=>p.slug==='cuatro-escenas')?.html.match(/<h2/g)||[]).length===4,'Deben existir cuatro escenas');
 }
 if(b.slug==='como-estudiar-para-un-final'){
  assert(b.healthContent===false&&b.pages.length===10,'Cómo estudiar: 10 capítulos, contenido no sanitario');
  assert(b.premium?.url==='https://galumio.com.ar/productos/como-estudiar-para-un-final/'&&b.premium.cta==='Descargar PDF + 8 plantillas'&&b.premium.title==='Edición PDF con 8 plantillas imprimibles'&&!/ebook completo|edición completa/i.test(JSON.stringify(b.premium))&&b.premium.highlight===true,'Cómo estudiar: botón premium hacia la ficha de Galumio');
  assert(['55 páginas','10 capítulos','8 plantillas imprimibles'].every(t=>b.premium?.items.some(i=>i.includes(t))),'Cómo estudiar: la tarjeta debe mostrar 55 páginas, 10 capítulos y 8 plantillas');
 }
 if(b.slug==='ia-para-docentes'){
  assert(b.healthContent===false&&b.pages.length===10,'IA para docentes: 10 capítulos, contenido no sanitario');
  // Del capítulo 8 solo se publica la muestra; los otros 44 prompts de la biblioteca son premium.
  const numbered=b.pages.flatMap(p=>[...p.html.replace(/<[^>]+>/g,' ').matchAll(/PROMPT\s+(\d+)/g)].map(m=>Number(m[1])));
  assert(JSON.stringify(numbered.sort((x,y)=>x-y))==='[1,11,21,31,39,47]','IA para docentes: prompts numerados fuera de la muestra autorizada: '+numbered);
  assert(b.pages.find(p=>p.slug==='biblioteca-de-prompts')?.html.match(/class="prompt"/g)?.length===6,'IA para docentes: el capítulo 8 debe tener exactamente 6 prompts');
  assert(b.premium?.url==='https://galumio.com.ar/productos/ia-para-maestros/','IA para docentes: enlace premium');
  for(const slug of ['la-formula-de-un-buen-prompt','tres-ejemplos-paso-a-paso','biblioteca-de-prompts','plan-de-7-dias'])assert(b.pages.find(p=>p.slug===slug)?.html.includes('href="https://galumio.com.ar/productos/ia-para-maestros/"'),`IA para docentes: falta el enlace de compra en ${slug}`);
 }
}

const args=process.argv.slice(2);const dryRun=args.includes('--dry-run');
const dirs=args.filter(a=>!a.startsWith('--'));
for(const dir of dirs.length?dirs:['public','dist','.preview']){
 const files=walk(dir);
 for(const path of files)assert(!/\.(epub|mobi|azw3?|zip)$/i.test(path),`Archivo de libro no permitido ${path}`);
 for(const path of files)if(path.toLowerCase().endsWith('.pdf')){const h=hash(path);assert(!premium.includes(h),`PDF premium en ${path}`);assert(freeResources.some(r=>r.sha256===h&&path.replaceAll('\\','/').endsWith(`/recursos/${r.slug}.pdf`)),`PDF no permitido ${path}`)}
 if(!existsSync(dir)||dir==='public')continue;
 const htmlFiles=files.filter(f=>f.endsWith('.html'));const titles=new Set();
 for(const file of htmlFiles){const html=read(file);const title=html.match(/<title>(.*?)<\/title>/s)?.[1];assert(!!title&&!titles.has(title),'Título faltante/duplicado '+file);titles.add(title);assert((html.match(/<h1(?:\s|>)/g)||[]).length===1,'H1 inválido '+file);assert(/rel="canonical"/.test(html)!==file.endsWith('404.html'),'Canonical faltante o indebido '+file);assert(/name="description"/.test(html),'Falta descripción '+file);assert(/property="og:image"/.test(html),'Falta imagen OG '+file);assert(!/href="#COMPRAR"|action="#"/.test(html),'Placeholder público '+file);
  for(const match of html.matchAll(/(?:href|src|content)="((?:https:\/\/lumendia\.com\.ar)?\/[^"\s]*)"/g)){const url=new URL(match[1].replace(/&amp;/g,'&'),'https://lumendia.com.ar');const dest=join(dir,decodeURIComponent(url.pathname),url.pathname.endsWith('/')?'index.html':'');assert(existsSync(dest),`Enlace roto ${file} → ${match[1]}`);if(url.hash&&existsSync(dest)&&dest.endsWith('.html')){const anchor=decodeURIComponent(url.hash.slice(1));assert(read(dest).includes(`id="${anchor}"`),`Ancla rota ${file} → ${match[1]}`)}}
 }
 if(dir==='dist'){assert(!existsSync('dist/libros'),'La presentación institucional no debe incluir libros');assert(!files.some(f=>f.endsWith('.pdf')),'La presentación institucional no debe incluir PDF');assert(!read('dist/sitemap.xml').includes('/libros/'),'Sitemap institucional con libros')}
 if(dir==='dist-library'){
  for(const file of htmlFiles)assert(!/noindex/.test(read(file)),'noindex en producción '+file);
  // Las compras pasan siempre por la ficha de Galumio, nunca directo a la tienda externa.
  for(const file of htmlFiles)assert(!/href="https?:\/\/(?:[a-z0-9-]+\.)?(?:payhip|etsy)\.com/i.test(read(file)),'Enlace directo a tienda externa '+file);
  assert(read('dist-library/CNAME').trim()==='lumendia.com.ar','CNAME incorrecto');assert(existsSync('dist-library/.nojekyll'),'Falta .nojekyll');assert(!read('dist-library/robots.txt').includes('Disallow: /'),'robots bloquea el sitio');
  const sitemap=[...read('dist-library/sitemap.xml').matchAll(/<loc>https:\/\/lumendia\.com\.ar(\/[^<]*)<\/loc>/g)].map(m=>m[1]);
  assert(sitemap.length+1===htmlFiles.length,`Sitemap (${sitemap.length}) y páginas (${htmlFiles.length}, con 404) no coinciden`);
  for(const path of sitemap)assert(existsSync(join(dir,path,'index.html')),'Sitemap apunta a una página inexistente '+path);
  for(const b of books){
   const included=existsSync(join(dir,'libros',b.slug,'index.html'));
   if(!dryRun)assert(included===publishable(b),`${b.slug}: ${publishable(b)?'falta en':'no aprobado y presente en'} la salida de producción`);
   if(!included)continue;
   for(const p of b.pages)assert(existsSync(join(dir,'libros',b.slug,p.slug,'index.html')),`${b.slug}: falta la página ${p.slug}`);
   for(const r of b.resources??[]){const f=join(dir,'recursos',r.slug+'.pdf');assert(existsSync(f)&&hash(f)===r.sha256,`${b.slug}: recurso ausente o alterado ${r.slug}`)}
   if(b.premium?.url)assert(read(join(dir,'libros',b.slug,'index.html')).includes(`href="${b.premium.url}"`),`${b.slug}: falta el enlace premium`);
   else if(!b.premium)assert(!read(join(dir,'libros',b.slug,'index.html')).includes('id="kit"'),`${b.slug}: tarjeta premium sin producto`);
  }
 }
 if(dir==='.preview')for(const r of freeResources)assert(existsSync(join(dir,'recursos',r.slug+'.pdf'))&&hash(join(dir,'recursos',r.slug+'.pdf'))===r.sha256,'Descarga alterada '+r.slug);
}
mkdirSync('.local',{recursive:true});writeFileSync('.local/validation.json',JSON.stringify({checks,failures},null,2));console.log(`${checks} comprobaciones; ${failures.length} errores.`);if(failures.length){console.error(failures.join('\n'));process.exit(1)}
