import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
const publicOutput=process.env.SILBIDO_PUBLIC_OUTPUT==='1';
const origin=publicOutput?'http://127.0.0.1:4404':'http://127.0.0.1:4403';
const slug='el-silbido-detras-del-monte';
test('Silbido: integridad, cinco apartados, lectura, navegación, accesibilidad y privacidad',async({page,request})=>{
 const original=JSON.parse(readFileSync('.local/silbido/manuscrito.json','utf8'));
 mkdirSync('.local/silbido/capturas',{recursive:true});
 const external:string[]=[];page.on('request',r=>{if(!r.url().startsWith(origin))external.push(r.url())});
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:900});
  for(const path of [`/relatos/${slug}/`,'/relatos/','/autores/gael-beltra/']){
   expect((await page.goto(path))!.status()).toBe(200);
   if(publicOutput)await expect(page.locator('meta[name=robots]')).toHaveCount(0);else await expect(page.locator('meta[name=robots]')).toHaveAttribute('content',/noindex/);
   if(path.includes(slug)){
    const meta=JSON.parse(readFileSync(`src/content/editorial/${slug}.json`,'utf8'));
    await expect(page.locator('h1')).toHaveText(meta.title);
    await expect(page.locator('meta[name=description]')).toHaveAttribute('content',meta.description);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',`https://lumendia.com.ar/relatos/${slug}/`);
    await expect(page.locator('#reading-index')).toHaveAttribute('aria-label','En este relato');
    const schema=await page.locator('script[type="application/ld+json"]').textContent();
    expect(schema).toContain('ShortStory');expect(schema).toContain('Gael Beltra');expect(schema).toContain('Galumio Studio');expect(schema).toContain('2026-11-02');
    await expect(page.locator('.story-details time')).toHaveAttribute('datetime','2026-11-02');

    expect(await page.locator('article.reader-content > *').allTextContents()).toEqual(original.blocks);
    await expect(page.locator('article.reader-content > p').last()).toHaveText(original.lastLine);
    await expect(page.locator('#reading-index a')).toHaveCount(5);
    for(const link of await page.locator('#reading-index a').all()){
     await link.focus();await page.keyboard.press('Enter');
     expect(page.url()).toContain(await link.getAttribute('href'));
    }
    await page.locator('[data-ux-larger]').focus();await page.keyboard.press('Enter');
    await expect(page.locator('[data-ux-size]')).toHaveText('22 px');
    await page.locator('[data-ux-smaller]').click();
    await page.locator('[data-ux-contrast]').click();
    expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
    await page.locator('[data-ux-contrast]').click();
    for(const theme of ['dark','light']){
     if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
     expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
     await page.evaluate(()=>scrollTo(0,0));
     await page.screenshot({path:`.local/silbido/capturas/${width}-${theme}.png`,fullPage:true});
    }
    for(let i=0;i<6;i++)await page.locator('[data-ux-larger]').click();
    expect(await page.locator('article.reader-content > *').evaluateAll(nodes=>nodes.every(n=>n.scrollHeight<=n.clientHeight+1))).toBe(true);
   }else await expect(page.locator(`main a[href="/relatos/${slug}/"]`)).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
   for(const href of await page.locator('main a[href^="/"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')!)))expect((await request.get(href)).status()).toBe(200);
  }
 }
 expect(external).toEqual([]);expect((await page.context().cookies()).length).toBe(0);
 expect((await request.get('/tips/')).status()).toBe(200);
});
