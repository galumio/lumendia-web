import {loadEditorial} from './editorial-loader.mjs';
import {available,preview,bookUrl,resources} from './catalog';
export interface EditorialEntry {
 slug:string;title:string;description:string;format:string;language:'es'|'en';scope:'complete'|'additional-paid'|'sample';
 topics:string[];audiences:string[];author:{name:string;type?:'Person'|'Organization'}|null;publishedAt:string|null;reviewedAt:string|null;
 sources:{title:string;url:string}[];relatedLinks:{title:string;url:string}[];url:string;privateDraft:boolean;publicationPending?:boolean;
 html:string;words:number;toc:{id:string;title:string}[];
}
export const editorialEntries:EditorialEntry[]=loadEditorial({root:process.cwd(),preview,today:new Date().toISOString().slice(0,10),relatedTargets:[...available.map(b=>({type:'book',slug:b.slug,title:b.title,url:bookUrl(b)})),...resources.map(({resource:r})=>({type:'resource',slug:r.slug,title:`${r.title} (PDF gratuito)`,url:`/recursos/${r.slug}.pdf`}))]});
export const sectionTitles:Record<string,string>={guias:'Guías',tutoriales:'Tutoriales',tips:'Tips',relatos:'Relatos'};
