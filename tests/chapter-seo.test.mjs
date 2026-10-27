import test from 'node:test';
import assert from 'node:assert/strict';
import {chapterSeoTitle} from '../src/lib/chapter-seo.mjs';
test('Desambigua solo títulos repetidos con el título editorial real, sin mutar capítulos',()=>{
 const a={title:'Libro A',pages:[{title:'Inicio'},{title:'Capítulo único'}]};
 const b={title:'Libro B',pages:[{title:'Inicio'}]};const catalog=[a,b];const before=JSON.stringify(catalog);
 assert.equal(chapterSeoTitle(a,a.pages[0],catalog),'Inicio | Libro A');
 assert.equal(chapterSeoTitle(b,b.pages[0],catalog),'Inicio | Libro B');
 assert.equal(chapterSeoTitle(a,a.pages[1],catalog),'Capítulo único');
 assert.equal(JSON.stringify(catalog),before);
});
