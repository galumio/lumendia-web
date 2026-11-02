import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {evaluateRecord,editionHash,classificationHash,bookEligibility,registry} from '../src/lib/publication-policy.mjs';
import {safeResourcePath,validateResourceManifest,verifyArtifact} from '../scripts/verify-public-artifact.mjs';
const fixture=category=>{const r={policyVersion:'1',category,status:'approved',editionHash:'a'.repeat(64),rationale:'Fixture de pruebas',examinedSections:['Fixture'],sources:[{title:'Fixture',url:'https://example.org/'}]};const review={status:'approved',responsible:'Revisor ficticio de pruebas',reviewedAt:'2020-01-01',scope:'Fixture completa',evidence:'Constancia ficticia de pruebas',policyVersion:'1',category,status:'approved',editionHash:r.editionHash,classificationHash:classificationHash(r),sources:r.sources};return {...r,editorialReview:review};};
test('A documentada; B requiere profesional; mixto y ambiguo bloqueados',()=>{
 assert.equal(evaluateRecord(fixture('A')).eligible,true);
 const b=fixture('B');assert.equal(evaluateRecord(b).eligible,false);
 b.professionalReview={...b.editorialReview,profession:'Profesión de prueba',credential:'Matrícula ficticia de prueba'};assert.equal(evaluateRecord(b).eligible,true);
 for(const category of ['mixed','ambiguous',null,'unknown'])assert.equal(evaluateRecord(fixture(category)).eligible,false);
});
test('Faltantes, fechas y cambios de edición/clasificación invalidan revisión',()=>{
 for(const key of ['responsible','reviewedAt','scope','evidence','sources']){const r=fixture('A');r.editorialReview[key]=null;assert.equal(evaluateRecord(r).eligible,false,key);}
 for(const date of ['2020-02-30','2999-01-01',' ']){const r=fixture('A');r.editorialReview.reviewedAt=date;assert.equal(evaluateRecord(r).eligible,false);}
 const r=fixture('A');assert.equal(evaluateRecord(r,{actualHash:'b'.repeat(64)}).eligible,false);r.rationale='Otra justificación';assert.equal(evaluateRecord(r).eligible,false);
});
test('healthContent false no aprueba un libro ni cambia un registro histórico',()=>{
 assert.equal(bookEligibility({slug:'nuevo',healthContent:false,editorialStatus:'approved'}).eligible,false);
 const b={slug:'fixture',healthContent:false,editorialStatus:'approved',pages:[]};const records={'book:fixture':{policyVersion:'1',category:'legacy',status:'preserved',provenance:'Fixture histórica',editionHash:editionHash(b)}};
 assert.equal(bookEligibility(b,records).eligible,true);assert.equal(bookEligibility({...b,healthContent:true},records).eligible,false);assert.equal(bookEligibility({...b,pages:[{html:'alterado'}]},records).eligible,false);
});
test('IA y Alzheimer aprobados en categoría A; sin revisión profesional atribuida',()=>{
 const r=registry.records['book:ia-para-el-dia-a-dia'];assert.equal(r.category,'A');assert.equal(r.editorialReview.reviewedAt,'2026-11-02');assert.equal(r.professionalReview,null);assert.equal(evaluateRecord(r).eligible,true);assert.ok(readFileSync('docs/APROBACION-EDITORIAL-IA-DIA-20261102.txt','utf8').includes(r.editionHash));assert.ok(r.masters.every(m=>m.file.includes('_SANITARIO.')));
 const al=registry.records['book:cuidar-a-mama-o-papa'];assert.equal(al.category,'A');assert.equal(evaluateRecord(al).eligible,true);assert.equal(al.professionalReview,null);assert.equal(al.masterEdition,'Cuidar_a_mama_o_papa_ES_FOCALIZADO_CIERRE');assert.ok(readFileSync('docs/APROBACION-EDITORIAL-ALZHEIMER-20261102.txt','utf8').includes(al.editionHash));
});
test('Manifiesto de descargas: rutas, formatos, duplicados, hashes y ediciones',()=>{
 const m=JSON.parse(readFileSync('src/content/approved-resources.json','utf8'));assert.deepEqual(validateResourceManifest(m,registry),[]);
 for(const bad of ['/recursos/../x.pdf','//recursos/x.pdf','/recursos/x%2epdf','/recursos/x.exe','C:\\x.pdf','/recursos/x.pdf/'])assert.equal(safeResourcePath(bad),false);
 for(const change of [{size:0},{sha256:'bad'},{format:'exe'},{edition:'otra'},{path:'/recursos/../x.pdf'}]){const c=structuredClone(m);Object.assign(c.resources[0],change);assert.ok(validateResourceManifest(c,registry).length);}
 const c=structuredClone(m);c.resources.push(c.resources[0]);assert.ok(validateResourceManifest(c,registry).length);
});
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {sha256,effectiveBookRecords} from '../src/lib/publication-policy.mjs';
test('CI replica: rechaza bytes, tamaño, edición, estado y recursos adicionales; A autorizada funciona',()=>{
 const dir='.local/policy-test-artifact';for(const p of ['libros/fixture/capitulo','recursos'])mkdirSync(join(dir,p),{recursive:true});
 const html='<h1>Fixture</h1><p>Texto sintético.</p>',pdf=Buffer.from('%PDF-1.7\nFixture de prueba, no un libro');
 writeFileSync(join(dir,'libros/fixture/index.html'),'<h1>Ficha fixture</h1>');writeFileSync(join(dir,'libros/fixture/capitulo/index.html'),`<article class="reader-content">${html}</article>`);writeFileSync(join(dir,'recursos/fixture.pdf'),pdf);
 const r={...fixture('A'),book:'fixture',edition:'fixture-v1',routes:['/libros/fixture/','/libros/fixture/capitulo/'],bodies:[{path:'/libros/fixture/capitulo/',sha256:sha256(html)}]};
 const policy={records:{'book:fixture':r}},manifest={version:1,resources:[{path:'/recursos/fixture.pdf',book:'fixture',edition:'fixture-v1',format:'pdf',size:pdf.length,sha256:sha256(pdf),status:'approved',evidence:'Fixture de prueba'}]};
 assert.deepEqual(verifyArtifact(dir,{policy,manifest}),[]);
 for(const change of [{sha256:'b'.repeat(64)},{size:999},{edition:'otra'},{status:'pending'}]){const m=structuredClone(manifest);Object.assign(m.resources[0],change);assert.ok(verifyArtifact(dir,{policy,manifest:m}).length);}
 assert.ok(verifyArtifact(dir,{policy,manifest:{version:1,resources:[]}}).some(e=>e.includes('no autorizada')));
 const changed=structuredClone(policy);changed.records['book:fixture'].bodies[0].sha256='c'.repeat(64);assert.ok(verifyArtifact(dir,{policy:changed,manifest}).some(e=>e.includes('Texto web alterado')));
 changed.records['book:fixture'].category='ambiguous';assert.ok(verifyArtifact(dir,{policy:changed,manifest}).some(e=>e.includes('no elegible')));
 const missing=structuredClone(manifest);missing.resources.push({...missing.resources[0],path:'/recursos/ausente.pdf'});assert.ok(verifyArtifact(dir,{policy,manifest:missing}).some(e=>e.includes('Falta recurso')));
});
test('La edición nueva pendiente no sustituye la muestra histórica ni habilita sus descargas',()=>{
 const pending=structuredClone(registry);pending.records['book:ia-para-el-dia-a-dia'].status='pending';const r=effectiveBookRecords(pending);assert.equal(r['ia-para-el-dia-a-dia'].category,'legacy');assert.equal(r['ia-para-el-dia-a-dia'].edition,'published-sample-f03673a');
 assert.equal(effectiveBookRecords(registry,true)['ia-para-el-dia-a-dia'].category,'A');
});

test('IA online: originales privados, sin recursos ni autorizaciones de descarga',()=>{
 const book={slug:'ia-para-el-dia-a-dia'}; // CI no recibe el manuscrito privado; validate y Playwright verifican sus diez capítulos y ausencia de recursos.
 assert.equal(registry.records['book:'+book.slug].bodies.length,16);
 const manifest=JSON.parse(readFileSync('src/content/approved-resources.json','utf8'));assert.ok(!manifest.resources.some(r=>r.book===book.slug));
 const r=registry.records['book:'+book.slug];assert.equal(r.distribution,'online-only');assert.equal(r.editorialReviewDraft.responsible,null);assert.equal(r.editorialReviewDraft.reviewedAt,null);
 const bad=structuredClone(manifest);bad.resources.push({...bad.resources[0],book:book.slug,edition:r.edition,path:'/recursos/ia-para-el-dia-a-dia-completo.pdf'});assert.ok(validateResourceManifest(bad,registry).some(e=>e.includes('online')));
});
