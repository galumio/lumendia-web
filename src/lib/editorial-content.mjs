// Contrato editorial puro. El adaptador editorial-loader.mjs gestiona archivos y selección.
export const contentSections = Object.freeze({guide:'guias',tutorial:'tutoriales',tip:'tips',story:'relatos'});
const slugPattern=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const text=v=>typeof v==='string'&&v.trim().length>0;
const date=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
const https=v=>{try{return new URL(v).protocol==='https:'}catch{return false}};
export function validateEditorialEntry(entry) {
 const errors=[];
 if(!entry||typeof entry!=='object')return ['Se requiere un registro'];
 for(const key of ['title','description'])if(!text(entry[key]))errors.push(`Falta ${key}`);
 if(!slugPattern.test(entry.slug??''))errors.push('Slug inválido');
 if(!Object.hasOwn(contentSections,entry.format))errors.push('Formato no admitido');
 if(!['es','en'].includes(entry.language))errors.push('Idioma no admitido');
 if(!['draft','approved'].includes(entry.status))errors.push('Estado no admitido');
 if(!['complete','additional-paid','sample'].includes(entry.scope))errors.push('Alcance no admitido');
 for(const key of ['topics','audiences'])if(!Array.isArray(entry[key])||!entry[key].length||entry[key].some(x=>!text(x)))errors.push(`Falta ${key}`);
 if(entry.bodyPath!==`${entry.slug}.md`)errors.push('El cuerpo debe ser un Markdown del mismo directorio y slug');
 for(const key of ['publishedAt','reviewedAt'])if(entry[key]!==null&&!date(entry[key]))errors.push(`Fecha inválida: ${key}`);
 if(entry.publishedAt&&entry.reviewedAt&&entry.reviewedAt<entry.publishedAt)errors.push('Revisión anterior a publicación');
 if(!Array.isArray(entry.sources)||entry.sources.some(s=>!text(s.title)||!https(s.url)))errors.push('Fuentes inválidas');
 if(!Array.isArray(entry.related)||entry.related.some(r=>!['book','guide','tutorial','tip','story','resource'].includes(r.type)||!slugPattern.test(r.slug??'')))errors.push('Relaciones inválidas');
 if(typeof entry.healthContent!=='boolean')errors.push('Declarar contenido sanitario');
 if(entry.author?.type!==undefined&&!['Person','Organization'].includes(entry.author.type))errors.push('Tipo de autor no admitido');
 if(entry.author?.slug!==undefined&&(!slugPattern.test(entry.author.slug)||entry.author.type!=='Person'))errors.push('Identificador de autor inválido');
 if(entry.publisher!==undefined&&(!text(entry.publisher?.name)||entry.publisher.type!=='Organization'))errors.push('Sello editorial inválido');
 if(entry.status==='approved'){
  if(!text(entry.author?.name))errors.push('Autor real requerido');
  if(!['original','authorized'].includes(entry.rights?.kind)||!text(entry.rights?.evidence))errors.push('Derechos sin acreditar');
  if(entry.format!=='story'&&!entry.sources?.length)errors.push('Contenido práctico sin fuentes');
  if(entry.healthContent&&(!text(entry.healthReview?.reviewer)||!date(entry.healthReview?.reviewedAt)||!text(entry.healthReview?.evidence)))errors.push('Falta revisión sanitaria');
 }
 return errors;
}
export function editorialUrl(entry){
 if(!Object.hasOwn(contentSections,entry.format)||!slugPattern.test(entry.slug??''))throw Error('Ruta editorial inválida');
 return `/${contentSections[entry.format]}/${entry.slug}/`;
}
// Selección de aprobados con fecha de corte explícita; no habilita borradores.
export function selectEditorialEntries(entries,today){
 if(!date(today))throw Error('Fecha de corte inválida');
 const seen=new Set();
 for(const entry of entries){
  const errors=validateEditorialEntry(entry);if(errors.length)throw Error(errors.join('; '));
  const url=editorialUrl(entry);if(seen.has(url))throw Error('URL duplicada');seen.add(url);
 }
 return entries.filter(e=>e.status==='approved'&&e.publishedAt!==null&&e.publishedAt<=today&&(!e.reviewedAt||e.reviewedAt<=today));
}
export function editorialIndexes(entries){
 return [...new Set(entries.map(e=>`/${contentSections[e.format]}/`))];
}
export function topicGroups(entries){
 return [...new Set(entries.flatMap(e=>e.topics))].map(topic=>({topic,entries:entries.filter(e=>e.topics.includes(topic))}));
}
