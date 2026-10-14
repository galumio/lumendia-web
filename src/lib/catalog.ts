import config from '../../site.config.json';
export {config};
export const preview = import.meta.env.DEV || process.env.LUMENDIA_PREVIEW === '1';
const modules = import.meta.glob('../content/books/*.json', {eager:true,import:'default'});
export interface Page {slug:string;title:string;description:string;html:string;words:number;textHash:string}
export interface Book {slug:string;title:string;subtitle:string;category:string;audience:string;description:string;cover:string;editorialStatus:string;printPages?:number;publisher?:string;resource?:string;premium?:{title:string;description:string;items:string[];note:string;url:string|null};toc:{slug:string;title:string;number:string}[];topics:{slug:string;title:string;description:string}[];pages:Page[];situations:{id:string;title:string;topic:string;text:string}[]}
export const books = Object.values(modules) as Book[];
// LUMENDIA_DRY_RUN: ensayo local de la salida de producción antes de las aprobaciones; publish-library.mjs nunca lo activa.
export const dryRun = process.env.LUMENDIA_DRY_RUN === '1';
export const available = books.filter(b=> preview || dryRun || (b.editorialStatus==='approved' && config.editorial.approved));
export const categories = ['Salud y cuidados','Estudio y universidad','Seguridad e higiene','Medicina laboral','Primeros auxilios','Infografías'];
export const bookUrl = (b:Book) => `/libros/${b.slug}/`;
export const minutes = (words:number)=>Math.max(1,Math.ceil(words/200));
