import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync} from 'node:fs';
const story='/relatos/el-ultimo-pasajero/';
const author='/autores/gael-beltra/';
test('Relato publicado: texto exacto, navegación, autor, SEO, móvil y privacidad',async({page,context,request})=>{
 let beaconLoads=0;
 await context.route('https://static.cloudflareinsights.com/beacon.min.js',async route=>{beaconLoads++;await route.fulfill({contentType:'application/javascript',body:''})});
 const paragraphs=readFileSync('src/content/editorial/el-ultimo-pasajero.md','utf8').trim().split(/\r?\n\s*\r?\n/);
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  for(const path of ['/relatos/',story,author]){
   await page.goto(path);await expect(page.locator('h1')).toHaveCount(1);
   await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://lumendia.com.ar'+path);
   await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  }
  await page.getByRole('link',{name:'El último pasajero',exact:true}).click();
  expect(await page.locator('article p').allTextContents()).toEqual(paragraphs);
  const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(schema['@type']).toBe('ShortStory');expect(schema.datePublished).toBe('2026-10-28');expect(schema.author.name).toBe('Gael Beltra');expect(schema.publisher.name).toBe('Galumio Studio');expect(schema.wordCount).toBe(3151);
  const larger=page.getByRole('button',{name:'Letra más grande'});await larger.focus();await page.keyboard.press('Enter');await expect(page.locator('[data-ux-size]')).toHaveText('22 px');
  await page.getByRole('button',{name:'Alto contraste'}).click();await expect(page.locator('.editorial-reader')).toHaveClass(/ux-high-contrast/);
  await page.getByRole('link',{name:'Gael Beltra',exact:true}).click();await expect(page).toHaveURL(new RegExp(author+'$'));
 }
 expect(beaconLoads).toBe(0);
 await page.locator('#privacy-settings').click();await page.locator('#privacy-close').click();expect(beaconLoads).toBe(0);
 await page.locator('#privacy-settings').click();await page.locator('#consent-reject').click();await page.reload();expect(beaconLoads).toBe(0);
 await page.locator('#privacy-settings').click();
 if(await page.locator('#consent-accept').isVisible()){
  await page.locator('#consent-accept').click();await expect.poll(()=>beaconLoads).toBe(1);
  await page.locator('#privacy-settings').click();await page.locator('#consent-accept').click();expect(beaconLoads).toBe(1);
  await page.locator('#privacy-settings').click();await Promise.all([page.waitForEvent('load'),page.locator('#consent-reject').click()]);await expect(page.locator('script[data-cf-beacon]')).toHaveCount(0);expect(beaconLoads).toBe(1);
 }
 const sitemap=await (await request.get('/sitemap.xml')).text();for(const path of [story,author,'/relatos/'])expect(sitemap).toContain('https://lumendia.com.ar'+path);
 for(const path of ['/tips/','/.local/editorial/el-ultimo-pasajero.md','/src/content/editorial/el-ultimo-pasajero.md'])expect((await request.get(path)).status()).toBe(404);
 expect(await page.locator('script[src*="google-analytics"],script[src*="googletagmanager"],script[src*="googlesyndication"]').count()).toBe(0);
});
