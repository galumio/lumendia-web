import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

const readJson=path=>JSON.parse(readFileSync(path,'utf8').replace(/^﻿/,''));
const sha256=path=>createHash('sha256').update(readFileSync(path)).digest('hex');

// Misma regla que src/lib/catalog.ts: el contenido sanitario exige revisión profesional documentada.
export const healthReviewed=b=>Boolean(b.healthReview?.reviewer&&b.healthReview.reviewedAt&&b.healthReview.evidence);
export const publishable=b=>b.editorialStatus==='approved'&&(b.healthContent===false||healthReviewed(b));

export function loadBooks(){
 const dir='src/content/books';
 return existsSync(dir)?readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>readJson(`${dir}/${f}`)):[];
}

// Condiciones para publicar. Los libros no aprobados se excluyen del build sin bloquear a los demás.
export function launchReport(){
 const config=readJson('site.config.json');
 const books=loadBooks();
 const included=books.filter(publishable);
 const excluded=books.filter(b=>!publishable(b)).map(b=>`${b.slug}: ${b.healthContent!==false&&!healthReviewed(b)?'falta revisión sanitaria profesional (healthReview)':'editorialStatus no aprobado'}`);
 const errors=[];
 if(!included.length)errors.push('No hay ningún libro publicable.');
 if(!config.legal.approved||!config.legal.responsibleName||!config.legal.jurisdiction||!config.contactEmail)errors.push('Faltan datos del responsable, contacto y jurisdicción (legal.*, contactEmail).');
 for(const b of included){
  for(const r of b.resources??[]){
   if(!existsSync(r.file))errors.push(`${b.slug}: falta el recurso ${r.file}`);
   else if(sha256(r.file)!==r.sha256)errors.push(`${b.slug}: el recurso ${r.file} no coincide con el original aprobado`);
  }
  if(b.premium?.url&&!/^https:\/\//.test(b.premium.url))errors.push(`${b.slug}: el enlace premium debe usar HTTPS.`);
 }
 if(config.ads.enabled||config.analytics.enabled)errors.push('Activación de rastreadores requiere revisión de privacidad y configuración documentada. Mantener desactivados en el primer despliegue.');
 return {errors,included,excluded};
}
export const launchBlockers=()=>launchReport().errors;

if(import.meta.url===pathToFileURL(process.argv[1]).href){
 const {errors,included,excluded}=launchReport();
 console.log('Se publicarían: '+(included.map(b=>b.slug).join(', ')||'ninguno'));
 if(excluded.length)console.log('Excluidos del build:\n- '+excluded.join('\n- '));
 if(errors.length){console.error('PUBLICACIÓN BLOQUEADA:\n'+errors.join('\n'));process.exit(1)}
 console.log('Condiciones editoriales y legales declaradas completas. Ejecutar también pruebas y revisión humana del artefacto.');
}
