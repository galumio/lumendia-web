import {test,expect} from '@playwright/test';import AxeBuilder from '@axe-core/playwright';import {readFileSync} from 'node:fs';
const rehearsal=process.env.TIPS_PUBLIC_OUTPUT==='1';
const manifest=JSON.parse(readFileSync('src/content/tips-approved.json','utf8'));
const entries=JSON.parse(readFileSync('src/content/tips-approved.json','utf8')).map((x:any)=>JSON.parse(readFileSync('src/content/editorial/'+x.slug+'.json','utf8')));
for(const e of entries)test(e.title+': móvil, copia, teclado, enlaces y privacidad',async({page,request})=>{
 const external:string[]=[];page.on('request',r=>{if(new URL(r.url()).hostname!=='127.0.0.1')external.push(r.url())});
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(s:string)=>{(window as any).copiedPrompt=s}}}));
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:900});await page.goto('/tips/');await page.getByRole('link',{name:e.title,exact:true}).click();
  await expect(page.locator('h1')).toHaveText(e.title);await expect(page.locator('html')).toHaveAttribute('lang','es-AR');
  await expect(page.locator('.editorial-reader header')).toContainText('Lectura completa gratuita');await expect(page.locator('.editorial-reader time')).toHaveCount(e.publishedAt?1:0);
  if(!rehearsal)await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow');else await expect(page.locator('meta[name="robots"]')).toHaveCount(0);await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://lumendia.com.ar/tips/'+e.slug+'/');
  await expect(page.getByRole('navigation',{name:'En este tip'})).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',e.description);
  const g=page.locator('[data-copy-prompt]');await expect(g).toHaveCount(manifest.find((m:any)=>m.slug===e.slug).promptCount);for(const block of await g.all()){const button=block.getByRole('button');await button.focus();await page.keyboard.press('Enter');await expect(block.getByRole('status')).toHaveText('Pedido copiado.');expect(await page.evaluate(()=>(window as any).copiedPrompt)).toBe(await block.locator('blockquote p').textContent());expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await page.locator('#privacy-settings').click();await page.locator('#privacy-close').click();await page.locator('#privacy-settings').click();await expect(page.locator('#consent-accept')).not.toBeVisible();await page.locator('#consent-reject').click();await expect(page.locator('script[src*="cloudflareinsights"]')).toHaveCount(0);
 }
 for(const s of e.sources)await expect(page.getByRole('link',{name:s.title,exact:true})).toHaveAttribute('href',s.url);
 for(const a of await page.locator('nav[aria-labelledby="relacionados"] a').all())expect((await request.get((await a.getAttribute('href'))!)).status()).toBe(200);
 expect((await request.get('/.local/editorial/'+e.slug+'.md')).status()).toBe(404);expect(external).toEqual([]);
 await page.goto('/tips/'+e.slug+'/');await page.screenshot({path:'.local/'+e.slug+'-tip-mobile.png'});
});
test('Doce lecturas sin JavaScript ni registro',async({browser})=>{const c=await browser.newContext({javaScriptEnabled:false});try{const p=await c.newPage();for(const e of entries){await p.goto((rehearsal?'http://127.0.0.1:4384/tips/':'http://127.0.0.1:4383/tips/')+e.slug+'/');await expect(p.locator('h1')).toHaveText(e.title);await expect(p.locator('[data-copy-prompt] button:visible')).toHaveCount(0);await expect(p.locator('main form')).toHaveCount(0)}}finally{await c.close()}});

test('Índice, grupos, destacado y trece URL de lanzamiento',async({page,request})=>{
 await page.goto('/tips/');await expect(page.locator('h1')).toHaveText('Tips de IA gratuitos');
 await expect(page.locator('h2[id^="tema-"]')).toHaveCount(4);await expect(page.locator('h3 a')).toHaveCount(12);
 for(const width of [1440,390,320]){await page.setViewportSize({width,height:900});await page.screenshot({path:'.local/tips-index-'+width+'.png',fullPage:true});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([])}
 for(const path of ['/','/biblioteca/']){await page.goto(path);await expect(page.getByRole('link',{name:'Explorar todos los tips'})).toBeVisible();if(await page.locator('#navigation-toggle').isVisible())await page.locator('#navigation-toggle').click();await expect(page.locator('header nav a[href="/tips/"]')).toBeVisible();await expect(page.getByRole('link',{name:entries.find((e:any)=>e.slug==='preparar-menu-semanal-con-chatgpt').title,exact:true})).toHaveCount(1)}
 if(rehearsal){const xml=await(await request.get('/sitemap.xml')).text();expect((xml.match(/<loc>https:\/\/lumendia.com.ar\/tips\//g)||[]).length).toBe(13)}
});
