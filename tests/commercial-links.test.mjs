import {test} from 'node:test';
import assert from 'node:assert/strict';
import {commercialLinkAllowed as allowed,samplePurchases} from '../scripts/commercial-links.mjs';
const es='dist-library/libros/ia-cotidiana-para-adultos-mayores/index.html';
test('Payhip exception is exact and scoped to the matching book',()=>{
 assert(allowed('https://payhip.com/b/CHPS9',es));
 assert(allowed('https://payhip.com/b/Y9fCO','dist-library/libros/everyday-ai-for-seniors/practical-examples/index.html'));
 for(const url of ['http://payhip.com/b/CHPS9','//payhip.com/b/CHPS9','https://payhip.com/b/Y9fCO','https://payhip.com/b/CHPS9?next=evil','https://payhip.com/b/CHPS9#x','https://payhip.com.evil.test/b/CHPS9','https://payhip.com@evil.test/b/CHPS9','https://shop.payhip.com/b/CHPS9','https://etsy.com/listing/1','javascript:alert(1)','https://%70ayhip.com/b/CHPS9']) assert.equal(allowed(url,es),false,url);
 assert.equal(allowed('https://payhip.com/b/CHPS9','dist-library/libros/ia-para-docentes/index.html'),false);
 for(const url of ['https://p&#97;yhip.com/b/CHPS9','https://pay\nhip.com/b/CHPS9','https&colon;//payhip.com/b/CHPS9']) assert.equal(allowed(url,es),false,url);
 assert(allowed('https://galumio.com.ar/productos/ia-para-maestros/',es));
});
test('Every authorized destination is isolated to its own sample',()=>{
 for(const [slug,url] of Object.entries(samplePurchases)){
  const page=`dist-library/libros/${slug}/ejemplos-practicos/index.html`;
  assert(allowed(url,page));
  assert.equal(allowed(url+'?redirect=other',page),false);
  assert.equal(allowed(url.replace('https:','http:'),page),false);
  for(const [other,otherUrl] of Object.entries(samplePurchases))if(other!==slug)assert.equal(allowed(otherUrl,page),false);
 }
});
