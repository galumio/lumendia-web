import {publishable,healthReviewed,selectBookEditions} from './publication-policy.mjs';
export {publishable,healthReviewed};
import config from '../../site.config.json';
import {featuredBookSlug,readingScope} from './editorial';
export {config};
export const preview = import.meta.env.DEV || process.env.LUMENDIA_PREVIEW === '1';
const previousModules=import.meta.glob(['../../.local/ia-dia-published-sample.json','../../.local/published-books/*.json'],{eager:true,import:'default'});
const modules = import.meta.glob('../content/books/*.json', {eager:true,import:'default'});
export interface Page {slug:string;title:string;description:string;html:string;words:number;textHash:string}
export interface Resource {format?:"pdf"|"epub";slug:string;title:string;description:string;file:string;sha256:string}
export interface Book {language?:"es"|"en";sample?:boolean;slug:string;title:string;shortTitle?:string;subtitle:string;category:string;audience:string;description:string;cover:string;editorialStatus:string;
 /** Dato histórico de alcance; no habilita publicación. La elegibilidad está en publication-policy.mjs. */
 healthContent?:boolean;healthReview?:{reviewer:string;reviewedAt:string;evidence:string}|null;
 notice?:string;sourcesPage?:string;readingOrder?:string[];printPages?:number;publisher?:string;resources?:Resource[];
 premium?:{title:string;description:string;items:string[];note?:string;url:string|null;cta?:string;
  /** Muestra el botón de compra también junto a "Empezar a leer". */
  highlight?:boolean};
 toc:{slug:string;title:string;number:string}[];topics:{slug:string;title:string;description:string}[];pages:Page[];situations:{id:string;title:string;topic:string;text:string}[]}
export const books = (selectBookEditions(Object.values(modules),Object.values(previousModules),preview||process.env.LUMENDIA_DRY_RUN==='1') as Book[]).sort((a,b)=>a.title.localeCompare(b.title,'es'));


// LUMENDIA_DRY_RUN: ensayo local de la salida de producción antes de las aprobaciones; publish-library.mjs nunca lo activa.
export const dryRun = process.env.LUMENDIA_DRY_RUN === '1';
export const available = books.filter(b=> preview || dryRun || publishable(b));
export const featured = available.find(b=>b.slug===featuredBookSlug&&publishable(b)) ?? available.find(b=>publishable(b)&&readingScope(b)==='complete'&&(b.language??'es')==='es');
export const categories = ['Salud y cuidados','Estudio y universidad','Educación y docentes','Seguridad e higiene','Medicina laboral','Primeros auxilios','Infografías','Tecnología cotidiana'].filter(c=>available.some(b=>b.category===c));
export const bookUrl = (b:Book) => `/libros/${b.slug}/`;
export const readingOrder = (b:Book) => b.readingOrder ?? b.toc.map(c=>c.slug);
export const resources = available.flatMap(book=>(book.resources??[]).map(resource=>({book,resource})));
export const minutes = (words:number)=>Math.max(1,Math.ceil(words/200));
