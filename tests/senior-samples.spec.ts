import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync} from 'node:fs';

const editions=[
 {slug:'ai-for-everyday-life',language:'en',buy:'https://payhip.com/b/DvYKc',start:'Start reading',intro:'before-you-begin',examples:'practical-examples',larger:'Increase text size',dark:'Enable dark mode'},
 {slug:'ia-cotidiana-para-adultos-mayores',language:'es-AR',buy:'https://payhip.com/b/CHPS9',start:'Empezar a leer',intro:'antes-de-empezar',examples:'ejemplos-practicos',larger:'Aumentar tamaño de letra',dark:'Activar modo oscuro'},
 {slug:'everyday-ai-for-seniors',language:'en',buy:'https://payhip.com/b/Y9fCO',start:'Start reading',intro:'before-you-begin',examples:'practical-examples',larger:'Increase text size',dark:'Enable dark mode'},
];
for(const edition of editions){
 const root=`/libros/${edition.slug}/`;
 test(`${edition.slug}: sample, mobile, accessibility and original text`,async({page,request})=>{
  test.setTimeout(120000);
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  const book=JSON.parse(readFileSync(`src/content/books/${edition.slug}.json`,'utf8'));
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});
   for(const section of ['',edition.intro+'/',edition.examples+'/']){
    await page.goto(root+section);
    await expect(page.locator('html')).toHaveAttribute('lang',edition.language);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
    expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
    const buy=page.locator(`main a[href="${edition.buy}"]`).first();
    if(book.sample){await expect(buy).toBeVisible();await expect(buy).toContainText(edition.language==='en'?'USD 4.99':'USD 4,99');expect((await buy.boundingBox())!.height).toBeGreaterThanOrEqual(44);}else{await expect(buy).toHaveCount(0);expect(book.resources).toEqual([]);}
    await expect(page.locator('a[download],a[href$=".pdf"],a[href$=".epub"]')).toHaveCount(0);
    if(section){
     const expected=book.pages.find((p:{slug:string})=>section===p.slug+'/').html;
     const actual=await page.locator('.reader-content').innerText();
     const sourceText=await page.evaluate((html)=>{const el=document.createElement('div');el.innerHTML=html;return el.textContent??''},expected);
     expect(actual.replace(/\s/g,'')).toBe(sourceText.replace(/\s/g,''));
    }
    if(width===390)await page.screenshot({path:`.local/${edition.slug}-${section?section.slice(0,-1):'ficha'}-390.png`,fullPage:true});
   }
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(root);
  expect(await page.locator('.book-hero img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBeTruthy();
  await page.getByRole('link',{name:edition.start}).click();
  await expect(page).toHaveURL(root+(book.readingOrder??book.toc.map((p:{slug:string})=>p.slug))[0]+'/');
  await page.getByRole('button',{name:edition.larger}).click();
  expect(await page.locator('.reader-content').evaluate(e=>e.style.getPropertyValue('--reader-size'))).toBe('22px');
  await page.getByRole('button',{name:edition.dark}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await page.locator('.chapter-nav a').last().click();await expect(page).toHaveURL(root+(book.readingOrder??book.toc.map((p:{slug:string})=>p.slug))[1]+'/');
  await page.locator('.reader-sidebar summary').click();
  await page.locator(`.reader-sidebar a[href="${root}${edition.intro}/"]`).click();
  await expect(page).toHaveURL(root+edition.intro+'/');
  await page.locator('.chapter-nav a').last().click();
  await page.locator('.chapter-nav a').first().click();await expect(page).toHaveURL(root+edition.intro+'/');
  const order=book.readingOrder??book.toc.map((p:{slug:string})=>p.slug);
  const previous=order[order.indexOf(edition.intro)-1];
  await page.locator('.chapter-nav a').first().click();await expect(page).toHaveURL(previous?root+previous+'/':root);
  if(previous){await page.locator(`.breadcrumb a[href="${root}"]`).click();await expect(page).toHaveURL(root);}
  for(const json of await page.locator('script[type="application/ld+json"]').allTextContents())expect(JSON.parse(json).inLanguage).toBe(book.language);
  expect(await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name).filter(n=>/google-analytics|googlesyndication|googletagmanager/.test(n)))).toEqual([]);
  for(const path of [`/recursos/${edition.slug}.pdf`,`/${edition.slug}.pdf`,`/.local/originals/${edition.slug}/`,`/src/content/books/${edition.slug}.json`])expect((await request.get(path)).status()).toBe(404);
  expect(errors).toEqual([]);
 });
}
test('Biblioteca contains four complete books; commercial samples stay separate',async({page})=>{
 await page.goto('/biblioteca/');
 const complete=['ia-cotidiana-para-adultos-mayores','ia-para-el-dia-a-dia','cuidar-a-mama-o-papa','como-estudiar-para-un-final'];
 await expect(page.locator('.book-card')).toHaveCount(4);
 for(const slug of complete)await expect(page.locator(`.book-card h2 a[href="/libros/${slug}/"]`)).toHaveCount(1);
 await page.goto('/muestras/');
 for(const slug of ['ai-for-everyday-life','everyday-ai-for-seniors'])await expect(page.locator(`.book-card h2 a[href="/libros/${slug}/"]`)).toHaveCount(1);
 await expect(page.locator('.book-card h2 a[href="/libros/ia-cotidiana-para-adultos-mayores/"]')).toHaveCount(0);
});
