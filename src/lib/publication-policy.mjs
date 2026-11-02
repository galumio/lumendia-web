import {createHash} from 'node:crypto';
import registry from '../content/editorial-policy.json' with {type:'json'};
export const policyVersion='1';
export const sha256=value=>createHash('sha256').update(value).digest('hex');
export const canonical=value=>JSON.stringify(value,(_k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
export const editionHash=value=>sha256(canonical(value));
const text=v=>typeof v==='string'&&v.trim().length>0;
const hash=v=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
const date=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
const https=v=>{try{return new URL(v).protocol==='https:'}catch{return false}};
export const classificationHash=r=>editionHash({category:r.category,rationale:r.rationale,examinedSections:r.examinedSections,sources:r.sources});
export function reviewErrors(review,record,today,professional=false){
 const errors=[];
 if(!review||review.status!=='approved')return ['Revisión documentada pendiente'];
 for(const key of ['responsible','scope','evidence'])if(!text(review[key]))errors.push('Falta '+key);
 if(!date(review.reviewedAt)||review.reviewedAt>today)errors.push('Fecha de revisión inválida');
 if(review.category!==record.category||review.classificationHash!==classificationHash(record))errors.push('Clasificación modificada');
 if(review.policyVersion!==policyVersion||review.editionHash!==record.editionHash)errors.push('Revisión de otra política o edición');
 if(!Array.isArray(review.sources)||!review.sources.length||review.sources.some(s=>!text(s.title)||!https(s.url)))errors.push('Fuentes de revisión incompletas');
 if(professional&&(!text(review.profession)||!text(review.credential)))errors.push('Falta identidad profesional acreditada');
 return errors;
}
export function evaluateRecord(record,{today=new Date().toISOString().slice(0,10),actualHash}={}){
 const errors=[];
 if(!record)return {eligible:false,errors:['Clasificación ausente']};
 if(record.policyVersion!==policyVersion||!hash(record.editionHash))errors.push('Política o hash inválido');
 if(actualHash!==undefined&&actualHash!==record.editionHash)errors.push('Edición modificada: revisión inválida');
 if(record.category==='legacy'){
  if(record.status!=='preserved'||!text(record.provenance))errors.push('Compatibilidad histórica sin respaldo');
 }else{
  if(record.status!=='approved')errors.push('Clasificación aún no aprobada');
  if(!['A','B'].includes(record.category))errors.push('Clasificación mixta, ambigua o desconocida');
  if(!text(record.rationale)||!Array.isArray(record.examinedSections)||!record.examinedSections.length)errors.push('Clasificación sin alcance o justificación');
  errors.push(...reviewErrors(record.editorialReview,record,today));
  if(record.category==='B')errors.push(...reviewErrors(record.professionalReview,record,today,true));
 }
 return {eligible:errors.length===0,errors};
}
export function bookEligibility(book,records=registry.records){
 const actualHash=editionHash(book);
 const current=records['book:'+book.slug],previous=records['book:'+book.slug+':published'];
 const record=current?.editionHash===actualHash?current:previous?.editionHash===actualHash?previous:current;
 const result=evaluateRecord(record,{actualHash});
 if(book.editorialStatus!=='approved')result.errors.push('Aprobación editorial del libro pendiente');
 result.eligible=result.errors.length===0;return result;
}
export const publishable=book=>bookEligibility(book).eligible;
export const healthReviewed=book=>{
 const r=registry.records['book:'+book.slug];return r?.category==='B'&&evaluateRecord(r,{actualHash:editionHash(book)}).eligible;
};
export function editorialEligibility(entry,body,records=registry.records){return evaluateRecord(records['editorial:'+entry.slug],{actualHash:editionHash({entry,body})});}
export {registry};

export const professionalReviewFor=book=>healthReviewed(book)?registry.records['book:'+book.slug].professionalReview:null;

export function selectBookEditions(proposed,previous=[],preview=false){return proposed.map(book=>preview||publishable(book)?book:previous.find(old=>old.slug===book.slug&&publishable(old))??book);}
export function effectiveBookRecords(policy,preview=false){const result={};for(const [key,r] of Object.entries(policy.records)){if(!key.startsWith('book:')||key.endsWith(':published'))continue;const old=policy.records[key+':published'];result[r.book??key.slice(5)]=preview||evaluateRecord(r).eligible?r:old&&evaluateRecord(old).eligible?old:r;}return result;}
