import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validateEditorialEntry,selectEditorialEntries} from '../src/lib/editorial-content.mjs';
import {renderEditorialMarkdown} from '../src/lib/editorial-loader.mjs';
test('Relato aprobado exacto, fecha autorizada y exclusión antes de la publicación',()=>{
 const body=readFileSync('src/content/editorial/el-ultimo-pasajero.md');
 const entry=JSON.parse(readFileSync('src/content/editorial/el-ultimo-pasajero.json','utf8'));
 assert.equal(createHash('sha256').update(body).digest('hex'),'2425b4e91157f7c0f61e2b7cdea14907e3678bd41d93776580f7ca2d3e179927');
 assert.equal(renderEditorialMarkdown(body.toString()).words,3151);
 assert.deepEqual(validateEditorialEntry(entry),[]);assert.equal(entry.publishedAt,'2026-10-28');
 assert.deepEqual(selectEditorialEntries([entry],'2026-10-27'),[]);
 assert.deepEqual(selectEditorialEntries([entry],'2026-10-28'),[entry]);
 assert.deepEqual(selectEditorialEntries([{...entry,publishedAt:null}],'2099-01-01'),[]);
 assert.equal(entry.author.name,'Gael Beltra');assert.equal(entry.publisher.name,'Galumio Studio');
 assert.ok(validateEditorialEntry({...entry,author:{...entry.author,slug:'../private'}}).length);
 assert.ok(validateEditorialEntry({...entry,publisher:{name:'x',type:'Person'}}).length);
});
