import approvedResources from '../src/content/approved-resources.json' with {type:'json'};
import {registry} from '../src/lib/publication-policy.mjs';
import {validateResourceManifest} from './verify-public-artifact.mjs';
import {publishable,healthReviewed,bookEligibility,selectBookEditions} from '../src/lib/publication-policy.mjs';
export {publishable,healthReviewed};
import {analyticsErrors} from '../src/lib/analytics-policy.mjs';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

const readJson=path=>JSON.parse(readFileSync(path,'utf8').replace(/^﻿/,''));
const sha256=path=>createHash('sha256').update(readFileSync(path)).digest('hex');

// Misma regla que src/lib/catalog.ts: el contenido sanitario exige revisión profesional documentada.



export function loadBooks({proposed=false}={}){
 const dir='src/content/books';
 const books=existsSync(dir)?readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>readJson(`${dir}/${f}`)):[];
 const previous=existsSync('.local/ia-dia-published-sample.json')?[readJson('.local/ia-dia-published-sample.json')]:[];
 if(existsSync('.local/published-books')) previous.push(...readdirSync('.local/published-books').filter(f=>f.endsWith('.json')).map(f=>readJson('.local/published-books/'+f)));
 return selectBookEditions(books,previous,proposed);
}

// Condiciones para publicar. Los libros no aprobados se excluyen del build sin bloquear a los demás.
export function launchReport(){
 const config=readJson('site.config.json');
 const books=loadBooks();
 const included=books.filter(publishable);
 const excluded=books.filter(b=>!publishable(b)).map(b=>`${b.slug}: ${bookEligibility(b).errors.join('; ')}`);
 const errors=validateResourceManifest(approvedResources,registry);
 if(!included.length)errors.push('No hay ningún libro publicable.');
 if(!config.legal.approved||!config.legal.responsibleName||!config.legal.jurisdiction||!config.contactEmail)errors.push('Faltan datos del responsable, contacto y jurisdicción (legal.*, contactEmail).');
 for(const b of included){
  for(const r of b.resources??[]){
   const approved=approvedResources.resources.find(a=>a.book===b.slug&&a.path===`/recursos/${r.slug}.${r.format??'pdf'}`&&a.status==='approved'&&a.sha256===r.sha256);
   if(!approved)errors.push(`${b.slug}: descarga sin aprobación confiable`);
   if(!existsSync(r.file))errors.push(`${b.slug}: falta el recurso ${r.file}`);
   else if(sha256(r.file)!==r.sha256)errors.push(`${b.slug}: el recurso ${r.file} no coincide con el original aprobado`);
  }
  if(b.premium?.url&&!/^https:\/\//.test(b.premium.url))errors.push(`${b.slug}: el enlace premium debe usar HTTPS.`);
 }
 errors.push(...analyticsErrors(config));
 return {errors,included,excluded};
}
export const launchBlockers=()=>launchReport().errors;

if(import.meta.url===pathToFileURL(process.argv[1]).href){
 const {errors,included,excluded}=launchReport();
 console.log('Se publicarían: '+(included.map(b=>b.slug+(b.sample?' (muestra histórica)':'')).join(', ')||'ninguno'));
 for(const b of loadBooks({proposed:true}))if(!publishable(b)&&included.some(i=>i.slug===b.slug))console.log('Edición nueva pendiente, conservada la muestra anterior: '+b.slug+' — '+bookEligibility(b).errors.join('; '));
 if(excluded.length)console.log('Excluidos del build:\n- '+excluded.join('\n- '));
 if(errors.length){console.error('PUBLICACIÓN BLOQUEADA:\n'+errors.join('\n'));process.exit(1)}
 console.log('Condiciones editoriales y legales declaradas completas. Ejecutar también pruebas y revisión humana del artefacto.');
}
