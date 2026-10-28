import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync,existsSync} from 'node:fs';
const story='/relatos/el-ultimo-pasajero/';
const author='/autores/gael-beltra/';
test('Relato íntegro, autor, navegación, móvil, teclado y privacidad',async({page,request})=>{
 const external:string[]=[];page.on('request',r=>{if(new URL(r.url()).hostname!=='127.0.0.1')external.push(r.url())});
 const original=readFileSync('src/content/editorial/el-ultimo-pasajero.md','utf8').trim().split(/\r?\n\s*\r?\n/);
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:900});
  for(const url of ['/relatos/',story,author]){
   await page.goto(url);await expect(page.locator('h1')).toHaveCount(1);
   await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow');
   await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://lumendia.com.ar'+url);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  }
  await page.goto('/relatos/');await expect(page.getByRole('link',{name:'Gael Beltra',exact:true})).toBeVisible();await expect(page.locator('.editorial-note')).toContainText('16 minutos');
  await page.goto(story);expect(await page.locator('article p').allTextContents()).toEqual(original);
  await expect(page.locator('.editorial-reader time')).toHaveAttribute('datetime','2026-10-28');
  const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(schema['@type']).toBe('ShortStory');expect(schema.wordCount).toBe(3151);expect(schema.datePublished).toBe('2026-10-28');
  expect(schema.author.name).toBe('Gael Beltra');expect(schema.publisher.name).toBe('Galumio Studio');
  if(width===390)expect(await page.locator('article').evaluate(e=>e.getBoundingClientRect().top)).toBeLessThan(850);
  const details=page.locator('.story-details');await details.locator('summary').focus();await page.keyboard.press('Enter');await expect(details).toHaveAttribute('open','');await expect(details).toContainText('Galumio Studio');await page.keyboard.press('Enter');
  const larger=page.getByRole('button',{name:'Letra más grande'});await larger.focus();await page.keyboard.press('Enter');
  await expect(page.locator('[data-ux-size]')).toHaveText('22 px');
  await page.getByRole('button',{name:'Alto contraste'}).click();await expect(page.locator('.editorial-reader')).toHaveClass(/ux-high-contrast/);
  await page.locator('#privacy-settings').click();await page.locator('#privacy-close').click();
  await page.locator('#privacy-settings').click();await page.locator('#consent-reject').click();
  await expect(page.locator('script[src*="cloudflareinsights"]')).toHaveCount(0);
  await page.screenshot({path:'.local/relato-'+width+'.png'});
  await page.getByRole('link',{name:'Gael Beltra',exact:true}).click();await expect(page).toHaveURL(new RegExp(author+'$'));
  await page.getByRole('link',{name:'El último pasajero',exact:true}).click();await expect(page).toHaveURL(new RegExp(story+'$'));
 }
 expect(external).toEqual([]);
 for(const url of ['/.local/editorial/el-ultimo-pasajero.md','/src/content/editorial/el-ultimo-pasajero.md'])expect((await request.get(url)).status()).toBe(404);
});
test('Publicación autorizada, sitemap y ausencia de originales',()=>{
 for(const url of [story,author,'/relatos/']){
  expect(existsSync('dist-library'+url+'index.html')).toBe(true);
  expect(readFileSync('dist-library/sitemap.xml','utf8')).toContain('https://lumendia.com.ar'+url);
  expect(existsSync('dist'+url+'index.html')).toBe(false);
 }
 expect(existsSync('dist-library/tips')).toBe(false);
});
