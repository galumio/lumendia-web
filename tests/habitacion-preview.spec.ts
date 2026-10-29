import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
const slug='la-habitacion-que-no-figuraba';
const paths=[`/relatos/${slug}/`,'/relatos/','/autores/gael-beltra/'];
test('Relato íntegro, navegación, lectura, teclado, móvil, privacidad y capturas',async({page,request})=>{
 mkdirSync('.local/screenshots',{recursive:true});
 const original=readFileSync(`src/content/editorial/${slug}.md`,'utf8').trim().split(/\n\s*\n/);
 const external:string[]=[];page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4351'))external.push(r.url())});
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});
  for(const [index,path] of paths.entries()){
   expect((await page.goto(path))!.status()).toBe(200);
   await expect(page.locator('h1')).toHaveCount(1);
   await expect(page.locator('main')).toContainText('Gael Beltra');
   await expect(page.locator('meta[name=robots]')).toHaveAttribute('content',/noindex/);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   if(index===0){
    expect(await page.locator('article.reader-content > p').allTextContents()).toEqual(original);
    await page.locator('[data-ux-larger]').focus();await page.keyboard.press('Enter');
    await expect(page.locator('[data-ux-size]')).toHaveText('22 px');
    await page.locator('[data-ux-smaller]').click();
    await page.locator('[data-ux-contrast]').click();
    await expect(page.locator('[data-ux-contrast]')).toHaveAttribute('aria-pressed','true');
    expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
    await page.locator('[data-ux-contrast]').click();
    await page.getByRole('link',{name:'Empezar a leer',exact:true}).click();expect(page.url()).toContain('#relato');
   }else{
    await expect(page.locator(`main a[href="/relatos/${slug}/"]`)).toBeVisible();
   }
   expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
   await expect(page.locator('script[data-cf-beacon]')).toHaveCount(0);
   await page.evaluate(()=>window.scrollTo(0,0));
   await page.screenshot({path:`.local/screenshots/${['relato','relatos','autor'][index]}-${width}.png`,fullPage:index!==0});
   for(const href of await page.locator('main a[href^="/"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')!))){expect((await request.get(href)).status()).toBe(200)}
  }
 }
 expect(external).toEqual([]);
 expect((await request.get('/relatos/el-ultimo-pasajero/')).status()).toBe(404);
 expect((await request.get('/tips/')).status()).toBe(404);
});
