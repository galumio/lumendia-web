import test from 'node:test';
import assert from 'node:assert/strict';
import {validateEditorialEntry,selectEditorialEntries,editorialUrl,editorialIndexes,topicGroups} from '../src/lib/editorial-content.mjs';
// Fixture exclusivo de pruebas; no representa una obra, autor o fecha editorial real.
const entry=()=>({slug:'fixture',title:'Prueba',description:'Solo fixture',format:'guide',language:'es',topics:['IA'],audiences:['Principiantes'],scope:'complete',author:{name:'Autor de prueba'},publishedAt:'2020-01-01',reviewedAt:null,sources:[{title:'Fuente de prueba',url:'https://example.org/'}],related:[{type:'book',slug:'ia-para-docentes'}],bodyPath:'fixture.md',status:'approved',rights:{kind:'original',evidence:'fixture'},healthContent:false});
test('No genera índices vacíos ni publica borradores, fechas futuras o fechas pendientes',()=>{
 assert.deepEqual(editorialIndexes(selectEditorialEntries([],'2020-02-01')),[]);
 for(const overrides of [{status:'draft'},{publishedAt:null},{publishedAt:'2021-01-01'},{reviewedAt:'2021-01-01'}])assert.deepEqual(selectEditorialEntries([{...entry(),...overrides}],'2020-02-01'),[]);
 assert.equal(selectEditorialEntries([entry()],'2020-02-01').length,1);
});
test('Rechaza rutas privadas, metadatos incompletos, duplicados y contenido sanitario sin revisión',()=>{
 for(const overrides of [{bodyPath:'../../.local/original.pdf'},{author:null},{rights:null},{publishedAt:'2020-02-30'},{format:'../private'},{sources:[]},{healthContent:true}])assert.ok(validateEditorialEntry({...entry(),...overrides}).length);
 assert.throws(()=>selectEditorialEntries([entry(),entry()],'2020-02-01'),/duplicada/);
 assert.throws(()=>editorialUrl({...entry(),slug:'../private'}));
});
test('Mantiene formato y tema separados, con rutas estables',()=>{
 assert.equal(editorialUrl(entry()),'/guias/fixture/');
 assert.deepEqual(editorialIndexes([entry()]),['/guias/']);
 assert.equal(topicGroups([entry()])[0].topic,'IA');
});
