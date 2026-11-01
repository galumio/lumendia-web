import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {renderEditorialMarkdown} from '../src/lib/editorial-loader.mjs';
import {selectEditorialEntries,validateEditorialEntry} from '../src/lib/editorial-content.mjs';
import {tipGroups} from '../src/lib/tips.mjs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const manifest=read('src/content/tips-approved.json');
const entries=manifest.map(m=>read(`src/content/editorial/${m.slug}.json`));
const sha=s=>createHash('sha256').update(s).digest('hex');
test('Spanish sources retain the two approved article destinations and language labels',()=>{
 const references=read('src/content/tips-sources-approved.json');
 const expected=[
  ['organizar-presupuesto-familiar','https://consumidor.gov/su-dinero/como-hacer-un-presupuesto'],
  ['reconocer-senales-de-estafas-digitales','https://consumidor.ftc.gov/articulos/los-estafadores-crean-falsas-emergencias-para-robarle-su-dinero']
 ];
 assert.equal(references.length,2);
 for(const [i,[slug,url]] of expected.entries()){
  const ref=references[i];assert.equal(ref.slug,slug);assert.equal(ref.sourceIndex,0);
  assert.equal(ref.source.url,url);assert.ok(ref.source.title.endsWith('(en español)'));
  assert.deepEqual(entries.find(e=>e.slug===slug).sources[0],ref.source);
 }
});
test('Approved V2/V2.1: exact prose, twelve identities, groups, privacy and all fifteen prompts',()=>{
 assert.equal(manifest.length,12);
 assert.deepEqual(manifest.map(m=>m.number),Array.from({length:12},(_,i)=>i+1));
 assert.deepEqual(tipGroups(entries).map(g=>g.entries.length),[4,2,3,3]);
 const previous=read('docs/editorial-history/tips-approved-v1.json');
 assert.deepEqual(manifest.map(m=>m.slug).sort(),previous.map(m=>m.slug).sort());
 let prompts=0;
 for(const [i,m] of manifest.entries()){
  const e=entries[i];assert.deepEqual(validateEditorialEntry(e),[]);
  assert.equal(m.version,[3,7,12].includes(m.number)?'V2.1':'V2');
  assert.equal(e.status,'approved');assert.equal(e.reviewedAt,null);assert.equal(new Set(entries.map(x=>x.publishedAt)).size,1);
  const md=readFileSync(`src/content/editorial/${e.bodyPath}`,'utf8');
  assert.equal(sha(md),m.sha256);
  const original=md.replace(/^## (.+)\n\n/gm,'$1\n').replace(/^> /gm,'').trim();
  assert.equal(sha(e.title+'\n\n'+original),m.approvedTextSha256,'Approved prose changed: '+m.slug);
  const rendered=renderEditorialMarkdown(md);const count=(rendered.html.match(/data-copy-prompt/g)||[]).length;
  assert.equal(count,m.promptCount);prompts+=count;
  assert.ok(md.includes('## Privacidad y alternativa sencilla'));
  for(const type of ['book','guide','tutorial'])assert.ok(e.related.some(r=>r.type===type));
 }
 assert.equal(prompts,15);
});
test('Pending dates never select tips in production, including future cutoffs',()=>{
 for(const today of ['2000-01-01','2099-12-31'])assert.deepEqual(selectEditorialEntries(entries.map(e=>({...e,publishedAt:null,reviewedAt:null})),today),[]);
 // Synthetic dates only in memory; never written to approved metadata.
 const fixture=entries.map(e=>({...e,publishedAt:'2000-01-02'}));
 assert.equal(selectEditorialEntries(fixture,'2000-01-01').length,0);
 assert.equal(selectEditorialEntries(fixture,'2000-01-02').length,12);
});
