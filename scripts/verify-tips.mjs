import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {renderEditorialMarkdown} from '../src/lib/editorial-loader.mjs';
import {validateEditorialEntry} from '../src/lib/editorial-content.mjs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const hash=s=>createHash('sha256').update(s).digest('hex');
const manifest=read('src/content/tips-approved.json');
assert.equal(manifest.length,12);
assert.equal(new Set(manifest.map(m=>m.slug)).size,12);
const dates=[];
for(const reference of read('src/content/tips-sources-approved.json')){
 const entry=read(`src/content/editorial/${reference.slug}.json`);
 assert.deepEqual(entry.sources[reference.sourceIndex],reference.source,`Changed approved Spanish reference: ${reference.slug}`);
}
for(const m of manifest){
 const e=read(`src/content/editorial/${m.slug}.json`);
 assert.deepEqual(validateEditorialEntry(e),[]);
 assert.equal(e.status,'approved');assert.equal(e.format,'tip');
 const md=readFileSync(`src/content/editorial/${e.bodyPath}`,'utf8');
 assert.equal(hash(md),m.sha256,`Changed approved file: ${m.slug}`);
 const prose=md.replace(/^## (.+)\n\n/gm,'$1\n').replace(/^> /gm,'').trim();
 assert.equal(hash(e.title+'\n\n'+prose),m.approvedTextSha256,`Changed approved prose: ${m.slug}`);
 assert.equal((renderEditorialMarkdown(md).html.match(/data-copy-prompt/g)||[]).length,m.promptCount);
 dates.push(e.publishedAt);
}
assert.equal(new Set(dates).size,1,'The twelve tips must remain pending or share one publication date; partial release refused.');
console.log('Twelve approved tips: text, identity, copy blocks and batch dates verified.');
