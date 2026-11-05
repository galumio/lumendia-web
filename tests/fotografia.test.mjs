import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {renderEditorialMarkdown} from '../src/lib/editorial-loader.mjs';
import {selectEditorialEntries,validateEditorialEntry} from '../src/lib/editorial-content.mjs';
const entry=JSON.parse(readFileSync('src/content/editorial/la-fotografia-del-martes.json','utf8'));
const body=readFileSync('src/content/editorial/la-fotografia-del-martes.md','utf8').replace(/\r\n/g,'\n');
test('Fotografía: fuente narrativa íntegra y publicación autorizada',()=>{
 assert.equal(createHash('sha256').update(body).digest('hex'),'1114ba7ed715be61a3f6a6065edd354a6c051e301610494ab5bcc131acbdf058');
 assert.equal(body.trim().split('\n').at(-1),'Esta vez, nadie había decidido por ella.');
 assert.equal(body.split('\n').filter(l=>l==='* * *').length,4);
 assert.deepEqual(validateEditorialEntry(entry),[]);
 assert.deepEqual(selectEditorialEntries([entry],'2026-11-05'),[entry]);
 assert.deepEqual(selectEditorialEntries([{...entry,publishedAt:null}],'2026-11-05'),[]);
 assert.deepEqual(selectEditorialEntries([entry],'2026-11-04'),[]);
});
test('Saltos literarios opcionales conservan diálogos sin alterar el renderizado anterior',()=>{
 assert.equal(renderEditorialMarkdown('Uno\n—Dos').html,'<p>Uno —Dos</p>');
 assert.equal(renderEditorialMarkdown('Uno\n—Dos',{preserveLineBreaks:true}).html,'<p>Uno<br>—Dos</p>');
 assert(validateEditorialEntry({...entry,illustration:{...entry.illustration,src:'/../privado.webp'}}).length);
});
