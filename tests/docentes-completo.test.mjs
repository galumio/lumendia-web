import test from 'node:test';
import assert from 'node:assert/strict';
import {resourceRecord,validateResourceManifest} from '../scripts/verify-public-artifact.mjs';
import {registry,evaluateRecord,effectiveBookRecords} from '../src/lib/publication-policy.mjs';
import {readFileSync} from 'node:fs';
test('Docentes: aprobación exacta y bloqueo si cambia la edición o falta revisión',()=>{
 const current=registry.records['book:ia-para-docentes'];
 assert.equal(current.status,'approved');assert.equal(evaluateRecord(current).eligible,true);
 assert.equal(current.editorialReview.reviewedAt,'2026-11-03');assert.equal(current.professionalReview,null);
 assert.ok(readFileSync(current.editorialReview.evidence,'utf8').includes(current.editionHash));
 assert.equal(effectiveBookRecords(registry)['ia-para-docentes'].edition,current.edition);
 assert.equal(evaluateRecord(current,{actualHash:'f'.repeat(64)}).eligible,false);
 const pending=structuredClone(registry);pending.records['book:ia-para-docentes'].status='pending';
 assert.equal(effectiveBookRecords(pending)['ia-para-docentes'].edition,registry.records['book:ia-para-docentes:published'].edition);
 const undocumented=structuredClone(current);undocumented.editorialReview.evidence=null;assert.equal(evaluateRecord(undocumented).eligible,false);
});

test('Recurso histórico: autorización por edición exacta, nunca por el libro solamente',()=>{
 const manifest=JSON.parse(readFileSync('src/content/approved-resources.json','utf8'));
 const resource=manifest.resources.find(r=>r.book==='ia-para-docentes');
 assert.equal(resourceRecord(resource,registry),registry.records['book:ia-para-docentes:published']);
 assert.equal(evaluateRecord(resourceRecord(resource,registry)).eligible,true);
 assert.deepEqual(validateResourceManifest(manifest,registry),[]);
 const changed=structuredClone(manifest);changed.resources.find(r=>r.book==='ia-para-docentes').edition='unapproved-edition';
 assert.ok(validateResourceManifest(changed,registry).some(e=>e.includes('Edición')));
 const altered=structuredClone(registry);altered.records['book:ia-para-docentes:published'].status='pending';
 assert.equal(evaluateRecord(resourceRecord(resource,altered)).eligible,false);
});
import {activeSection} from '../src/lib/navigation.mjs';
test('Navegación: docentes completo pertenece a Biblioteca; muestra conserva Aprendé IA',()=>{
 assert.equal(activeSection('/libros/ia-para-docentes/anexo/',['ia-para-docentes']),'/biblioteca/');
 assert.equal(activeSection('/libros/ia-para-docentes/',[]),'/aprende-ia/');
});
