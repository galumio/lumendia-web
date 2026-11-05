import {readFileSync,readdirSync,lstatSync,existsSync} from 'node:fs';
import {resolve,relative,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import resources from '../src/content/approved-resources.json' with {type:'json'};
import {registry,evaluateRecord,sha256,effectiveBookRecords} from '../src/lib/publication-policy.mjs';
export const safeResourcePath=p=>typeof p==='string'&&/^\/recursos\/[a-z0-9]+(?:-[a-z0-9]+)*\.(pdf|epub)$/.test(p);
export function resourceSignature(bytes,format){
 if(format==='pdf')return bytes.subarray(0,5).toString()==='%PDF-';
 if(format!=='epub'||bytes.length<38||bytes.readUInt32LE(0)!==0x04034b50||bytes.readUInt16LE(8)!==0)return false;
 const n=bytes.readUInt16LE(26),extra=bytes.readUInt16LE(28),offset=30+n+extra;
 return bytes.subarray(30,30+n).toString()==='mimetype'&&bytes.subarray(offset,offset+20).toString()==='application/epub+zip';
}
// Resolve the exact approved resource edition, including preserved historical resources.
export const resourceRecord=(resource,policy)=>[policy.records['book:'+resource.book],policy.records['book:'+resource.book+':published']].find(r=>r?.edition===resource.edition);
export function validateResourceManifest(manifest,policy){
 const errors=[],seen=new Set();if(manifest.version!==1||!Array.isArray(manifest.resources))return ['Manifiesto de recursos inválido'];
 for(const r of manifest.resources){
  const record=resourceRecord(r,policy);
  if(record?.category==='F')errors.push('F no autoriza descargas');
  if(record?.distribution==='online-only')errors.push('Libro de lectura online sin descargas autorizables');
  if(!safeResourcePath(r.path)||!['pdf','epub'].includes(r.format)||!r.path.endsWith('.'+r.format))errors.push('Ruta/formato inválidos');
  if(seen.has(r.path))errors.push('Recurso duplicado');seen.add(r.path);
  if(!Number.isSafeInteger(r.size)||r.size<=0||!/^[a-f0-9]{64}$/.test(r.sha256??''))errors.push('Tamaño/hash inválido');
  if(!record||r.edition!==record.edition||!['pending','approved'].includes(r.status))errors.push('Edición/estado inválido');
  if(r.status==='approved'&&!(typeof r.evidence==='string'&&r.evidence.trim()))errors.push('Recurso sin evidencia');
 }
 return errors;
}
export function verifyArtifact(directory,{manifest=resources,policy=registry,preview=false}={}){
 const bookRecords=effectiveBookRecords(policy,preview);
 const root=resolve(directory),errors=validateResourceManifest(manifest,policy),files=[];
 function walk(dir){for(const name of readdirSync(dir)){const p=join(dir,name),stat=lstatSync(p);if(stat.isSymbolicLink()){errors.push('Enlace de sistema no permitido: '+p);continue;}if(stat.isDirectory())walk(p);else if(stat.isFile())files.push(p);else errors.push('Tipo de archivo no permitido');}}
 if(lstatSync(root).isSymbolicLink())return ['Raíz enlazada'];walk(root);
 const eligible=key=>preview||evaluateRecord(key.startsWith('book:')?bookRecords[key.slice(5)]:policy.records[key],{recordKey:key}).eligible;
 const allowed=manifest.resources.filter(r=>(preview||r.status==='approved')&&(preview||evaluateRecord(resourceRecord(r,policy)).eligible));
 for(const f of files){const path='/'+relative(root,f).split('\\').join('/');
  if(!/\.(html|css|js|svg|png|jpe?g|webp|ico|xml|pdf|epub)$/i.test(path)&&!['/CNAME','/.nojekyll','/robots.txt','/ads.txt'].includes(path))errors.push('Archivo fuera de los formatos públicos: '+path);
  if(path.startsWith('/libros/')&&!path.endsWith('/index.html'))errors.push('Archivo no permitido dentro de libros: '+path);
  if(/(^|\/)(?:\.local|\.git|src|node_modules|backups?|respaldos?)(\/|$)|\.(?:docx?|zip|mobi|azw\d?|pem|key|pfx|bak|py|ts|mjs|json|tar|gz)$/i.test(path)||/(^|\/)\.env/i.test(path))errors.push('Archivo privado/no permitido: '+path);
  if(/\.(pdf|epub)$/i.test(path)){const r=allowed.find(r=>r.path===path),bytes=readFileSync(f);if(!r||bytes.length!==r.size||sha256(bytes)!==r.sha256||!resourceSignature(bytes,r.format))errors.push('Descarga no autorizada o alterada: '+path);}
  if(/^\/(guias|tips|relatos|tutoriales)\/[^/]+\/index\.html$/.test(path)){
   const route=path.slice(0,-10),pair=Object.entries(policy.records).find(([k,r])=>k.startsWith('editorial:')&&r.path===route);
   if(!pair||!eligible(pair[0]))errors.push('Entrada editorial no autorizada: '+route);
   if(pair?.[1].category==='F')for(const asset of pair[1].assets??[]){const target=join(root,asset.path);if(!/^\/images\/[a-z0-9-]+\.(webp|png|jpg)$/.test(asset.path)||!existsSync(target)||lstatSync(target).isSymbolicLink()||!lstatSync(target).isFile()||lstatSync(target).size!==asset.size||sha256(readFileSync(target))!==asset.sha256)errors.push('Ilustración F ausente o alterada: '+asset.path);}
   if(pair&&eligible(pair[0])){const actual=readFileSync(f,'utf8').match(/<article\b[^>]*class="reader-content"[^>]*>([\s\S]*?)<\/article>/)?.[1];if(actual===undefined||sha256(actual.trim())!==pair[1].bodyHash)errors.push('Texto editorial alterado: '+route);}
  }
  if(path.startsWith('/libros/')&&path.endsWith('/index.html')){
   const slug=path.split('/')[2],record=bookRecords[slug],route=path.slice(0,-10);
   if(!record||!eligible('book:'+slug))errors.push('Libro no elegible: '+slug);
   else if(!record.routes.includes(route))errors.push('Ruta no autorizada: '+route);
   const body=record?.bodies?.find(b=>b.path===route);
   if(body){const html=readFileSync(f,'utf8'),actual=html.match(/<article class="reader-content"[^>]*>([\s\S]*?)<\/article>/)?.[1];if(actual===undefined||sha256(actual.trim())!==body.sha256)errors.push('Texto web alterado: '+route);}
  }
 }
 for(const r of allowed)if(!existsSync(join(root,r.path)))errors.push('Falta recurso autorizado: '+r.path);
 for(const [slug,record] of Object.entries(bookRecords))if(eligible('book:'+slug))for(const path of record.routes??[])if(!existsSync(join(root,path,'index.html')))errors.push('Falta página autorizada: '+path);
 for(const [key,record] of Object.entries(policy.records))if(key.startsWith('editorial:')&&eligible(key)&&!existsSync(join(root,record.path,'index.html')))errors.push('Falta entrada editorial: '+record.path);
 return errors;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const errors=verifyArtifact(process.argv[2]??'dist-library',{preview:process.argv.includes('--preview')});if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('Artefacto: política, rutas, textos, recursos y hashes verificados contra manifiestos confiables.');}
