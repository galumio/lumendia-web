import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {loadEditorial,renderEditorialMarkdown} from '../src/lib/editorial-loader.mjs';
const fixture=()=>({slug:'fixture',title:'Fixture',description:'Registro de prueba',format:'guide',language:'es',topics:['Prueba'],audiences:['Prueba'],scope:'complete',author:{name:'Autor ficticio'},publishedAt:'2020-01-01',reviewedAt:null,sources:[{title:'Fixture',url:'https://example.org/'}],related:[],bodyPath:'fixture.md',status:'approved',rights:{kind:'original',evidence:'fixture'},healthContent:false});
function setup(t){mkdirSync('.local',{recursive:true});const root=mkdtempSync(resolve('.local/editorial-test-'));t.after(()=>rmSync(root,{recursive:true,force:true}));for(const dir of ['src/content/editorial','.local/editorial'])mkdirSync(join(root,dir),{recursive:true});return root;}
function put(root,entry,privateDraft=false,body='## Ejemplo\n\nTexto de prueba.'){const dir=join(root,privateDraft?'.local/editorial':'src/content/editorial');writeFileSync(join(dir,`${entry.slug}.json`),JSON.stringify(entry));writeFileSync(join(dir,entry.bodyPath),body);}
test('Producción no lee borradores privados, ni siquiera JSON malformado',t=>{const root=setup(t);writeFileSync(join(root,'.local/editorial/invalid.json'),'{');assert.deepEqual(loadEditorial({root,today:'2020-02-01'}),[]);assert.throws(()=>loadEditorial({root,preview:true,today:'2020-02-01'}));});
test('Borradores solo en preview, aprobados elegibles en producción; no expone evidencias o rutas en HTML',t=>{const root=setup(t);put(root,{...fixture(),status:'draft',author:null,publishedAt:null},true);assert.deepEqual(loadEditorial({root,today:'2020-02-01'}),[]);const [draft]=loadEditorial({root,preview:true,today:'2020-02-01'});assert.equal(draft.privateDraft,true);assert.equal(draft.directory,undefined);assert.equal(draft.words,4);put(root,fixture());assert.equal(loadEditorial({root,today:'2020-02-01'})[0].url,'/guias/fixture/');assert.throws(()=>loadEditorial({root,preview:true,today:'2020-02-01'}),/duplicada/);});
test('Fechas futuras, estado en ubicación incorrecta y relaciones ausentes no se publican',t=>{const root=setup(t);put(root,{...fixture(),publishedAt:'2021-01-01'});assert.deepEqual(loadEditorial({root,today:'2020-02-01'}),[]);put(root,{...fixture(),status:'draft'});assert.throws(()=>loadEditorial({root,today:'2020-02-01'}),/Estado/);put(root,{...fixture(),related:[{type:'book',slug:'ausente'}]});assert.throws(()=>loadEditorial({root,today:'2020-02-01'}),/Relación/);});
test('Render seguro, índice navegable, contenido no vacío y cuerpo sin HTML ni recursos arbitrarios',()=>{for(const body of ['', '<script>alert(1)</script>','![foto](/.local/x)','[enlace](javascript:alert(1))','# Segundo título principal'])assert.throws(()=>renderEditorialMarkdown(body));const r=renderEditorialMarkdown('## Título\n\n> Pedido & respuesta\n\n- Uno\n- Dos\n\n### Detalle\n\nTexto.');assert.equal(r.toc.length,1);assert.match(r.html,/<blockquote><p>Pedido &amp; respuesta/);assert.match(r.html,/<h2 id="seccion-1">/);assert.match(r.html,/<ul><li>Uno/);});
test('Aprobado sin fecha: visible solo en revisión, nunca publicable; recursos por lista explícita',t=>{
 const root=setup(t);put(root,{...fixture(),publishedAt:null,related:[{type:'resource',slug:'recurso'}]});
 assert.deepEqual(loadEditorial({root,today:'2020-02-01'}),[]);
 assert.throws(()=>loadEditorial({root,preview:true,today:'2020-02-01'}),/Relación/);
 const relatedTargets=[{type:'resource',slug:'recurso',title:'PDF autorizado',url:'/recursos/recurso.pdf'}];
 const [entry]=loadEditorial({root,preview:true,today:'2020-02-01',relatedTargets});
 assert.equal(entry.publicationPending,true);assert.equal(entry.privateDraft,false);
 assert.equal(entry.relatedLinks[0].url,'/recursos/recurso.pdf');
 assert.throws(()=>loadEditorial({root,preview:true,today:'2020-02-01',relatedTargets:[{...relatedTargets[0],url:'/.local/recurso.pdf'}]}),/Relación/);
});
