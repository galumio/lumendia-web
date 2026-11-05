import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {registry,evaluateRecord,editorialEligibility,bookEligibility,classificationHash,editionHash} from '../src/lib/publication-policy.mjs';
import {renderEditorialMarkdown} from '../src/lib/editorial-loader.mjs';
import {verifyArtifact,validateResourceManifest} from '../scripts/verify-public-artifact.mjs';
const key='editorial:la-fotografia-del-martes';
const entry=JSON.parse(readFileSync('src/content/editorial/la-fotografia-del-martes.json','utf8'));
const body=readFileSync('src/content/editorial/'+entry.bodyPath,'utf8');
const approved=()=>{const r=structuredClone(registry.records[key]);r.status='approved';r.editorialReview={status:'approved',responsible:'Persona ficticia para pruebas',reviewedAt:'2020-01-01',scope:'Fixture de texto e ilustración',evidence:'Constancia sintética de prueba, no una aprobación real',policyVersion:'1',category:'F',editionHash:r.editionHash,classificationHash:classificationHash(r),sourceArtifactsHash:editionHash(r.sourceArtifacts)};return r;};
const eligible=r=>evaluateRecord(r,{recordKey:key});
test('F aprobada individualmente funciona; registro real aprobado y revisión pendiente bloqueada',()=>{
 assert.equal(editorialEligibility(entry,body,{[key]:approved()}).eligible,true);
 assert.equal(eligible(registry.records[key]).eligible,true);
 const pending=structuredClone(registry.records[key]);pending.editorialReview.status='pending';assert.equal(eligible(pending).eligible,false);
 assert.equal(entry.publishedAt,'2026-11-05');
});
test('F exige revisión individual, responsable, evidencia y fecha real',()=>{
 for(const field of ['status','responsible','scope','evidence','reviewedAt','sourceArtifactsHash','classificationHash','editionHash']){const r=approved();r.editorialReview[field]=null;assert.equal(eligible(r).eligible,false,field);}
 for(const field of ['sourceArtifacts','assets']){const c=approved();c[field]=null;assert.equal(eligible(c).eligible,false);}
 const r=approved();r.editorialReview.reviewedAt='2999-01-01';assert.equal(eligible(r).eligible,false);
});
test('F vincula texto, metadatos, fuentes e ilustración por hashes',()=>{
 const r=approved();assert.equal(editorialEligibility(entry,body+'alterado',{[key]:r}).eligible,false);
 assert.equal(editorialEligibility({...entry,title:'Otro'},body,{[key]:r}).eligible,false);
 for(const field of ['bodyHash','sourceBodyHash','rationale']){const c=approved();c[field]='f'.repeat(64);assert.equal(eligible(c).eligible,false,field);}
 for(const field of ['path','size','sha256']){const c=approved();c.assets[0][field]=field==='size'?1:'alterado';assert.equal(eligible(c).eligible,false,field);}
 const c=approved();c.sourceArtifacts[0].sha256='f'.repeat(64);assert.equal(eligible(c).eligible,false);
});
test('F no habilita otras clases, autores, rutas ni derechos aunque se firme el cambio',()=>{
 for(const patch of [{format:'guide'},{format:'tip'},{format:'tutorial'},{scope:'sample'},{distribution:'download'},{healthContent:true},{rights:'authorized'},{path:'/libros/la-fotografia-del-martes/'},{author:{type:'Person',name:'Otro',slug:'otro'}}]){const c=approved();Object.assign(c,patch);c.editorialReview.classificationHash=classificationHash(c);assert.equal(eligible(c).eligible,false,JSON.stringify(patch));}
 assert.equal(evaluateRecord(approved()).eligible,false);
 assert.equal(evaluateRecord(approved(),{recordKey:'book:'+entry.slug}).eligible,false);
 const book={slug:entry.slug,editorialStatus:'approved'};const c=approved();c.editionHash=editionHash(book);c.editorialReview.editionHash=c.editionHash;assert.equal(bookEligibility(book,{['book:'+entry.slug]:c}).eligible,false);
});
test('F no autoriza descargas ni con manifiesto aprobado',()=>{
 const r=approved(),asset=r.assets[0];const policy={records:{['book:'+entry.slug]:r}};
 const manifest={version:1,resources:[{book:entry.slug,edition:r.edition,path:'/recursos/ficcion.pdf',format:'pdf',size:asset.size,sha256:asset.sha256,status:'approved',evidence:'Fixture'}]};
 assert(validateResourceManifest(manifest,policy).some(e=>e.includes('F no autoriza')));
});
test('CI: ficción íntegra permitida; rechaza HTML, imagen y aprobación alterados',()=>{
 const dir='.local/fiction-policy-test-artifact',r=approved();mkdirSync(join(dir,r.path),{recursive:true});mkdirSync(join(dir,'images'),{recursive:true});
 const file=join(dir,r.path,'index.html'),image=join(dir,r.assets[0].path),bytes=readFileSync('public'+r.assets[0].path);const html=renderEditorialMarkdown(body,{preserveLineBreaks:true}).html;
 writeFileSync(file,`<article class="reader-content">${html}</article>`);writeFileSync(image,bytes);
 const policy={records:{[key]:r}},manifest={version:1,resources:[]};assert.deepEqual(verifyArtifact(dir,{policy,manifest}),[]);
 writeFileSync(file,'<article class="reader-content">Alterado</article>');assert(verifyArtifact(dir,{policy,manifest}).some(e=>e.includes('Texto editorial alterado')));writeFileSync(file,`<article class="reader-content">${html}</article>`);
 writeFileSync(image,'alterado');assert(verifyArtifact(dir,{policy,manifest}).some(e=>e.includes('Ilustración F')));writeFileSync(image,bytes);
 r.editorialReview.status='pending';assert(verifyArtifact(dir,{policy,manifest}).some(e=>e.includes('no autorizada')));
});
import {loadEditorial} from '../src/lib/editorial-loader.mjs';
import {resolve} from 'node:path';
test('Compilación: F exige imagen íntegra y aprobación de la edición fechada',()=>{
 const dir=resolve('.local/fiction-loader-test'),e={...entry,publishedAt:'2020-01-01'},r=approved();
 r.editionHash=editionHash({entry:e,body});r.editorialReview.editionHash=r.editionHash;
 mkdirSync(join(dir,'src/content/editorial'),{recursive:true});mkdirSync(join(dir,'public/images'),{recursive:true});
 writeFileSync(join(dir,'src/content/editorial',e.slug+'.json'),JSON.stringify(e));writeFileSync(join(dir,'src/content/editorial',e.bodyPath),body);
 const image=join(dir,'public',r.assets[0].path),bytes=readFileSync('public'+r.assets[0].path);writeFileSync(image,bytes);
 const options={root:dir,today:'2026-11-05',policyRecords:{[key]:r}};
 assert.equal(loadEditorial(options).length,1);
 writeFileSync(image,'cambio');assert.throws(()=>loadEditorial(options),/Ilustración F alterada/);writeFileSync(image,bytes);
 r.editorialReview.status='pending';assert.throws(()=>loadEditorial(options),/Política editorial/);
});
