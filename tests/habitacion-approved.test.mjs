import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validateEditorialEntry,selectEditorialEntries} from '../src/lib/editorial-content.mjs';
import {renderEditorialMarkdown} from '../src/lib/editorial-loader.mjs';
test('La habitación: original aprobado íntegro, atribución y fecha autorizada',()=>{
 const base='src/content/editorial/la-habitacion-que-no-figuraba';
 const body=readFileSync(base+'.md');const meta=JSON.parse(readFileSync(base+'.json','utf8'));
 assert.equal(createHash('sha256').update(body).digest('hex'),'7898d1784f00ac018342e0e85eaa19e66017a54b212a59089f34248bdbc7c4ff');
 assert.equal(renderEditorialMarkdown(body.toString()).words,4042);
 assert.deepEqual(validateEditorialEntry(meta),[]);
 assert.equal(meta.author.name,'Gael Beltra');assert.equal(meta.publisher.name,'Galumio Studio');
 assert.equal(meta.publishedAt,'2026-10-29');assert.equal(meta.reviewedAt,null);
 assert.deepEqual(selectEditorialEntries([meta],'2026-10-28'),[]);
 assert.equal(selectEditorialEntries([meta],'2026-10-29').length,1);
});
