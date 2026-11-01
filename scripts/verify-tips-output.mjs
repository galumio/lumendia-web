import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
const manifest=JSON.parse(readFileSync('src/content/tips-approved.json','utf8'));
const entries=manifest.map(m=>JSON.parse(readFileSync(`src/content/editorial/${m.slug}.json`,'utf8')));
const dirs=process.argv.slice(2);
assert.ok(dirs.length && dirs.every(d=>['dist','dist-library'].includes(d)),'Specify dist and/or dist-library explicitly');

 for(const dir of dirs){
  assert.ok(existsSync(dir),'Build first: '+dir);
  const released=entries.every(e=>e.publishedAt!==null && e.publishedAt<=new Date().toISOString().slice(0,10));
  assert.equal(existsSync(dir+'/tips'),dir==='dist-library'&&released);
  const walk=p=>readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]);
  for(const path of walk(dir)){
   assert.ok(!/\.(md|zip|py)$|\/(?:\.local|docs|respaldo-v1)\//.test(path),path);
   if(/\.(html|xml|js)$/.test(path)){
    const text=readFileSync(path,'utf8');
    if(!released||dir==='dist')for(const e of entries)assert.ok(!text.includes('/tips/'+e.slug+'/'),path);
   }
  }
 }

console.log('Tip artifacts verified: '+dirs.join(', '));
