import history from '../content/publication-history.json' with {type:'json'};
import {bookEligibility,editionHash} from './publication-policy.mjs';
export const argentinaToday=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const validDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d;
export function publishedBook(book,today=argentinaToday()){const r=history.books[book.slug];return Boolean(r&&r.editionHash===editionHash(book)&&bookEligibility(book).eligible&&(!r.publishedAt||(validDate(r.publishedAt)&&r.publishedAt<=today)));}
export const publicationDate=slug=>history.books[slug]?.publishedAt??null;
export const featuredIds=history.featured;
/** @param {any[]} items @param {{today:string,manual?:string[],limit?:number}} options */
export function selectLatest(items,{today,manual=[],limit=3}){
 if(!validDate(today)||!Number.isInteger(limit)||limit<1)throw Error("Configuración de novedades inválida");
 const eligible=items.filter(i=>i.eligible&&i.published&&i.scope==='complete'&&!i.draft&&(!i.date||(validDate(i.date)&&i.date<=today)));
 const byId=new Map(eligible.map(i=>[i.id,i]));
 if(new Set(manual).size!==manual.length||manual.some(id=>!byId.has(id)))throw Error('Destacado duplicado o no publicado/elegible');
 const auto=eligible.filter(i=>i.date&&/^\d{4}-\d{2}-\d{2}$/.test(i.date)&&!manual.includes(i.id)).sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
 return [...manual.map(id=>byId.get(id)),...auto].slice(0,limit);
}
