import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readdirSync,readFileSync} from 'node:fs';
test('El relato retirado no tiene original ni registro en contenido público',()=>{
 const dir='src/content/editorial';
 for(const ext of ['json','md'])assert.equal(existsSync(`${dir}/el-ultimo-pasajero.${ext}`),false);
 const entries=readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(readFileSync(`${dir}/${f}`,'utf8')));
 assert.ok(!entries.some(e=>e.slug==='el-ultimo-pasajero'));
 assert.ok(!entries.some(e=>e.related.some(r=>r.slug==='el-ultimo-pasajero')));
});
