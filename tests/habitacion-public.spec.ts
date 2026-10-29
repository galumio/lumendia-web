import {test,expect} from '@playwright/test';
import {readFileSync,mkdirSync} from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
const paths=['/relatos/la-habitacion-que-no-figuraba/','/relatos/','/autores/gael-beltra/'];
test('Relato publicado: texto exacto, SEO, sitemap, autor, lectura móvil y privacidad',async({page,request})=>{
 const paragraphs=readFileSync('src/content/editorial/la-habitacion-que-no-figuraba.md','utf8').trim().split(/\n\s*\n/);
 const sitemap=await (await request.get('/sitemap.xml')).text();
 for(const path of paths)expect(sitemap).toContain('https://lumendia.com.ar'+path);
 expect(sitemap).not.toContain('/tips/');expect(sitemap).not.toContain('/relatos/el-ultimo-pasajero/');
 mkdirSync('.local/screenshots/publication',{recursive:true});
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});
  for(const [index,path] of paths.entries()){
   expect((await page.goto(path))!.status()).toBe(200);
   await expect(page.locator('h1')).toHaveCount(1);
   await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://lumendia.com.ar'+path);
   await expect(page.locator('meta[name=robots][content*="noindex"]')).toHaveCount(0);
   await expect(page.locator('main')).toContainText('Gael Beltra');
   await expect(page.locator('main')).not.toContainText('Publicación pendiente');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   if(index===0){
    expect(await page.locator('article.reader-content > p').allTextContents()).toEqual(paragraphs);
    const schema=(await page.locator('script[type="application/ld+json"]').allTextContents()).join('');
    for(const value of ['ShortStory','Gael Beltra','Galumio Studio','2026-10-29'])expect(schema).toContain(value);
    await page.locator('[data-ux-larger]').focus();await page.keyboard.press('Enter');
    await expect(page.locator('[data-ux-size]')).toHaveText('22 px');
    await page.locator('[data-ux-smaller]').click();await page.locator('[data-ux-contrast]').click();
    await expect(page.locator('[data-ux-contrast]')).toHaveAttribute('aria-pressed','true');
    await page.locator('[data-ux-contrast]').click();
    await page.getByRole('link',{name:'Ir al índice',exact:true}).click();expect(page.url()).toContain('#reading-index');
   }else await expect(page.locator(`main a[href="${paths[0]}"]`)).toBeVisible();
   expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
   await expect(page.locator('script[data-cf-beacon]')).toHaveCount(0);
   await page.evaluate(()=>scrollTo(0,0));
   await page.screenshot({path:`.local/screenshots/publication/${index}-${width}.png`,fullPage:index!==0});
  }
 }
 for(const path of ['/tips/','/relatos/el-ultimo-pasajero/','/.local/editorial/La_habitacion_que_no_figuraba_Gael_Beltra_FINAL_Lumendia.docx'])expect((await request.get(path)).status()).toBe(404);
});
