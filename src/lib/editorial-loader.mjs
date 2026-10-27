// Adaptador de compilación: nunca se importa desde scripts del navegador.
import {existsSync,readdirSync,readFileSync,lstatSync,realpathSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {validateEditorialEntry,selectEditorialEntries,editorialUrl} from './editorial-content.mjs';

const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
// Subconjunto deliberado: H2/H3, párrafos, listas sin numeración y pedidos en citas.
// Sin HTML, imágenes, enlaces, código ni MDX. Las fuentes y relaciones usan metadatos validados.
export function renderEditorialMarkdown(markdown){
 if(!markdown.trim())throw Error('Texto editorial vacío');
 if(/<|^#\s|^#{4,}\s|```|!\[|\]\(|^\s*\d+[.)]\s/m.test(markdown))throw Error('Markdown editorial no admitido');
 const toc=[];let section=0;let copyNext=false;
 const html=markdown.trim().split(/\r?\n\s*\r?\n/).map(block=>{
  const heading=block.match(/^(#{2,3}) ([^\r\n]+)$/);
  if(heading){const id=`seccion-${++section}`;copyNext=heading[1]==='###'&&heading[2]==='Pedido para copiar';if(heading[1].length===2)toc.push({id,title:heading[2]});return `<h${heading[1].length} id="${id}">${escape(heading[2])}</h${heading[1].length}>`;}
  const lines=block.split(/\r?\n/);
  const copy=copyNext;copyNext=false;
  if(lines.every(l=>l.startsWith('- ')))return '<ul>'+lines.map(l=>`<li>${escape(l.slice(2))}</li>`).join('')+'</ul>';
  if(lines.every(l=>l.startsWith('> '))){const quote=`<blockquote><p>${escape(lines.map(l=>l.slice(2)).join(' '))}</p></blockquote>`;return copy?`<div data-copy-prompt>${quote}<button type="button" class="button secondary copy-prompt" hidden aria-describedby="seccion-${section}">Copiar pedido</button><p class="copy-feedback" role="status" aria-live="polite"></p></div>`:quote;}
  return `<p>${escape(lines.join(' '))}</p>`;
 }).join('\n');
 const words=markdown.replace(/^#{2,3} |^> |^- /gm,'').trim().split(/\s+/u).length;
 return {html,toc,words};
}
function plainFile(path){const stat=lstatSync(path);if(stat.isSymbolicLink()||!stat.isFile()||realpathSync(path)!==resolve(path))throw Error('Archivo editorial fuera de su ubicación: '+path);if(stat.size>1_000_000)throw Error('Archivo editorial demasiado grande');return readFileSync(path,'utf8').replace(/^\uFEFF/,'');}
function records(directory,privateDraft){
 if(!existsSync(directory))return [];
 if(realpathSync(directory)!==resolve(directory))throw Error('Directorio editorial enlazado');
 return readdirSync(directory).filter(f=>f.endsWith('.json')).sort().map(file=>{
  const entry=JSON.parse(plainFile(join(directory,file)));
  const errors=validateEditorialEntry(entry);
  if(errors.length)throw Error(file+': '+errors.join('; '));
  if(file!==`${entry.slug}.json`)throw Error('Nombre de registro editorial incorrecto');
  if(entry.status!==(privateDraft?'draft':'approved'))throw Error('Estado incompatible con ubicación editorial');
  return {...entry,privateDraft,directory};
 });
}
/** @param {{root:string,preview?:boolean,today:string,relatedTargets?:Array<{type:string,slug:string,title:string,url:string}>}} options */
export function loadEditorial({root,preview=false,today,relatedTargets=[]}){
 const publicRecords=records(join(root,'src/content/editorial'),false);
 // No se lee ni enumera .local en producción, incluso en dry-run.
 const selected=selectEditorialEntries(publicRecords,today);
 const drafts=preview?records(join(root,'.local/editorial'),true):[];
 const selectedUrls=new Set(selected.map(editorialUrl));
 const approved=preview?publicRecords.map(e=>({...e,publicationPending:!selectedUrls.has(editorialUrl(e))})):selected;
 const entries=[...approved,...drafts];
 const urls=entries.map(editorialUrl);
 if(new Set(urls).size!==urls.length)throw Error('URL editorial duplicada');
 const targets=[...relatedTargets,...entries.map(e=>({type:e.format,slug:e.slug,title:e.title,url:editorialUrl(e)}))];
 return entries.map(({directory,...entry})=>{
  const relatedLinks=entry.related.map(r=>{
   const target=targets.find(t=>t.type===r.type&&t.slug===r.slug);
   const validUrl=target&&(r.type==='resource'?target.url===`/recursos/${r.slug}.pdf`:/^\/(?!\/)[a-z0-9/-]+\/$/.test(target.url));
   if(!validUrl)throw Error('Relación no disponible: '+r.slug);
   return {title:target.title,url:target.url};
  });
  return {...entry,url:editorialUrl(entry),relatedLinks,...renderEditorialMarkdown(plainFile(join(directory,entry.bodyPath)))};
 });
}
