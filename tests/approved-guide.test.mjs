import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {renderEditorialMarkdown} from '../src/lib/editorial-loader.mjs';
import {validateEditorialEntry} from '../src/lib/editorial-content.mjs';
test('Original aprobado de 2716 palabras íntegro, seis fuentes y cinco pedidos copiables',()=>{
 const path='src/content/editorial/empezar-con-la-ia-cinco-tareas-sencillas';
 const bytes=readFileSync(path+'.md');const entry=JSON.parse(readFileSync(path+'.json','utf8'));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),'9e57475863069613dae6ced43b8757dbe677c3a11a62bcc26853d64a37b15b63');
 const rendered=renderEditorialMarkdown(bytes.toString());
 assert.equal(rendered.words,2716);assert.equal((rendered.html.match(/data-copy-prompt/g)||[]).length,5);
 assert.equal(entry.status,'approved');assert.equal(entry.author.name,'Lumendia · Galumio Studio');
 assert.equal(entry.sources.length,6);assert.deepEqual(validateEditorialEntry(entry),[]);
});
