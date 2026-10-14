import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

export const EMERGENCY_SHEET_HASH='abc5f12181054f412b911a93d75407dbb1a80124fbf726b7c7e0a009b7e26ba5';
export const emergencySheetSource=()=>['resources/Hoja-de-emergencia-del-cuidador.pdf','.local/originals/Hoja-de-emergencia-del-cuidador.pdf'].find(existsSync);

// Condiciones editoriales y legales para publicar la biblioteca. Devuelve la lista de bloqueos.
export function launchBlockers(){
 const config=JSON.parse(readFileSync('site.config.json','utf8').replace(/^﻿/,''));
 const errors=[];
 if(!config.editorial.approved||!config.editorial.reviewer||!config.editorial.reviewedAt||!config.editorial.evidence)errors.push('Falta aprobación sanitaria profesional documentada (editorial.approved, reviewer, reviewedAt, evidence).');
 if(!config.legal.approved||!config.legal.responsibleName||!config.legal.jurisdiction||!config.contactEmail)errors.push('Faltan datos del responsable, contacto y jurisdicción (legal.*, contactEmail).');
 const books=existsSync('src/content/books')?readdirSync('src/content/books').filter(f=>f.endsWith('.json')):[];
 if(!books.length)errors.push('No hay libros en src/content/books.');
 for(const f of books){const b=JSON.parse(readFileSync('src/content/books/'+f,'utf8'));if(b.editorialStatus!=='approved')errors.push('Libro pendiente: '+b.slug)}
 const sheet=emergencySheetSource();
 if(!sheet)errors.push('Falta la hoja de emergencia en .local/originals/.');
 else if(createHash('sha256').update(readFileSync(sheet)).digest('hex')!==EMERGENCY_SHEET_HASH)errors.push('La hoja de emergencia no coincide con el original aprobado: '+sheet);
 if(config.ads.enabled||config.analytics.enabled)errors.push('Activación de rastreadores requiere revisión de privacidad y configuración documentada. Mantener desactivados en el primer despliegue.');
 if(config.commerce.kitUrl&&!/^https:\/\//.test(config.commerce.kitUrl))errors.push('El enlace comercial debe usar HTTPS.');
 return errors;
}

if(import.meta.url===pathToFileURL(process.argv[1]).href){
 const errors=launchBlockers();
 if(errors.length){console.error('PUBLICACIÓN BLOQUEADA:\n'+errors.join('\n'));process.exit(1)}
 console.log('Condiciones editoriales y legales declaradas completas. Ejecutar también pruebas y revisión humana del artefacto.');
}
