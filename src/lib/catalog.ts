import config from '../../site.config.json';
export {config};
export const preview = import.meta.env.DEV || process.env.LUMENDIA_PREVIEW === '1';
const modules = import.meta.glob('../content/books/*.json', {eager:true,import:'default'});
export interface Page {slug:string;title:string;description:string;html:string;words:number;textHash:string}
export interface Resource {slug:string;title:string;description:string;file:string;sha256:string}
export interface Book {slug:string;title:string;shortTitle?:string;subtitle:string;category:string;audience:string;description:string;cover:string;editorialStatus:string;
 /** Contenido sanitario: solo se publica con healthReview completo. Si falta, se asume true. */
 healthContent?:boolean;healthReview?:{reviewer:string;reviewedAt:string;evidence:string}|null;
 notice?:string;sourcesPage?:string;readingOrder?:string[];printPages?:number;publisher?:string;resources?:Resource[];
 premium?:{title:string;description:string;items:string[];note?:string;url:string|null;cta?:string;
  /** Muestra el botón de compra también junto a "Empezar a leer". */
  highlight?:boolean};
 toc:{slug:string;title:string;number:string}[];topics:{slug:string;title:string;description:string}[];pages:Page[];situations:{id:string;title:string;topic:string;text:string}[]}
export const books = (Object.values(modules) as Book[]).sort((a,b)=>a.title.localeCompare(b.title,'es'));
export const healthReviewed = (b:Book) => Boolean(b.healthReview?.reviewer && b.healthReview.reviewedAt && b.healthReview.evidence);
export const publishable = (b:Book) => b.editorialStatus==='approved' && (b.healthContent===false || healthReviewed(b));
// LUMENDIA_DRY_RUN: ensayo local de la salida de producción antes de las aprobaciones; publish-library.mjs nunca lo activa.
export const dryRun = process.env.LUMENDIA_DRY_RUN === '1';
export const available = books.filter(b=> preview || dryRun || publishable(b));
export const featured = available.find(publishable) ?? available[0];
export const categories = ['Salud y cuidados','Estudio y universidad','Educación y docentes','Seguridad e higiene','Medicina laboral','Primeros auxilios','Infografías'];
export const bookUrl = (b:Book) => `/libros/${b.slug}/`;
export const readingOrder = (b:Book) => b.readingOrder ?? b.toc.map(c=>c.slug);
export const resources = available.flatMap(book=>(book.resources??[]).map(resource=>({book,resource})));
export const minutes = (words:number)=>Math.max(1,Math.ceil(words/200));
