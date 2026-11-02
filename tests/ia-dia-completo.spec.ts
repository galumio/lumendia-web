import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const book=JSON.parse(readFileSync('src/content/books/ia-para-el-dia-a-dia.json','utf8'));
const approved=JSON.parse(readFileSync('src/content/ia-dia-final-approved.json','utf8'));
const root='/libros/ia-para-el-dia-a-dia/';
const hash=(b:any)=>createHash('sha256').update(b).digest('hex');
test('complete final edition, online only, reader, mobile, dark and accessibility',async({page,request})=>{
 test.setTimeout(240000);const external:string[]=[];page.on('request',r=>{if(!r.url().startsWith((process.env.LUMENDIA_IA_TEST_ORIGIN??'http://127.0.0.1:4392')+'/'))external.push(r.url())});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 expect(book.sample).toBe(false);expect(book.pages).toHaveLength(16);expect(book.premium).toBeUndefined();
 expect(book.resources).toEqual([]);expect(book.pages.filter((p:any)=>p.title.startsWith('Capítulo '))).toHaveLength(10); for(const format of ['pdf','epub'])expect((await request.get('/recursos/ia-para-el-dia-a-dia-completo.'+format)).status()).toBe(404);
 for(const width of [390,1440])for(const dark of [false,true]){
  await page.setViewportSize({width,height:844});await page.goto(root);await page.evaluate(d=>{document.documentElement.dataset.theme=d?'dark':'light';localStorage.setItem('lumendia-theme',d?'dark':'light')},dark);
  await expect(page.locator('a[download]')).toHaveCount(0);await expect(page.locator('a[href$=".pdf"],a[href$=".epub"]')).toHaveCount(0);await expect(page.locator('main')).not.toContainText('USD');await expect(page.locator('main input[type=password]')).toHaveCount(0);
  expect(await page.locator('.book-hero img').evaluate((e:HTMLImageElement)=>e.naturalWidth>0)).toBeTruthy();
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  if(width===390)await page.screenshot({path:`.local/ia-final-ficha-${dark?'oscuro':'claro'}.png`,fullPage:true});
  for(const section of book.pages){await page.goto(root+section.slug+'/');await page.evaluate(d=>document.documentElement.dataset.theme=d?'dark':'light',dark);
   await expect(page.locator('h1')).toHaveCount(1);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
   const actual=await page.locator('.reader-content').evaluate(el=>{const copy=el.cloneNode(true) as HTMLElement;copy.querySelector('.aviso-salud')?.remove();return (copy.textContent??'').replace(/\s/g,'')});
   expect(hash(Buffer.from(actual))).toBe(approved.sections.find((p:any)=>p.slug===section.slug).textHash);
   expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  }
 }
 await page.goto(root+'arrancar-en-10-minutos/');await page.getByRole('button',{name:'Aumentar tamaño de letra'}).focus();await page.keyboard.press('Enter');expect(await page.locator('.reader-content').evaluate(e=>e.style.getPropertyValue('--reader-size'))).toBe('22px');
 await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await page.waitForTimeout(350);expect(await page.locator('#reading-progress').getAttribute('value')).not.toBe('0');
 await page.locator('.chapter-nav a').last().click();await expect(page).toHaveURL(root+'dinero-y-cuentas/');
 await page.goto(root+'ejemplos-practicos/');await expect(page.getByRole('link',{name:'Ver el índice completo'})).toBeVisible();expect(errors).toEqual([]);expect(external).toEqual([]);
});
