import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync} from 'node:fs';
const entry=JSON.parse(readFileSync('src/content/editorial/empezar-con-la-ia-cinco-tareas-sencillas.json','utf8'));
const path=`/guias/${entry.slug}/`;
test('Guía publicada: catálogo, SEO, fuentes, móvil, teclado y cinco copias exactas',async({page,request})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{(window as any).copiedPrompt=text}}}));
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:900});await page.goto('/biblioteca/');
  await page.getByRole('link',{name:entry.title,exact:true}).click();
  await expect(page.locator('h1')).toHaveText(entry.title);
  await expect(page.locator('.editorial-reader header')).toContainText('Lectura completa gratuita');
  await expect(page.locator('.editorial-reader header')).toContainText('Lumendia · Galumio Studio');
  await expect(page.locator('main')).not.toContainText(/Borrador privado|Publicación pendiente|Atribución editorial propuesta/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://lumendia.com.ar'+path);
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page.locator('.editorial-reader time')).toHaveAttribute('datetime',entry.publishedAt);
  const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(schema.author).toEqual({'@type':'Organization',name:entry.author.name});expect(schema.datePublished).toBe(entry.publishedAt);expect(schema.isAccessibleForFree).toBe(true);
  for(const source of entry.sources)await expect(page.getByRole('link',{name:source.title,exact:true})).toHaveAttribute('href',source.url);
  const groups=page.locator('[data-copy-prompt]');await expect(groups).toHaveCount(5);
  for(let i=0;i<5;i++){const g=groups.nth(i);const button=g.getByRole('button');await button.focus();await page.keyboard.press('Enter');await expect(g.getByRole('status')).toHaveText('Pedido copiado.');expect(await page.evaluate(()=>(window as any).copiedPrompt)).toBe(await g.locator('blockquote p').textContent());}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await expect(page.locator('script[src*="cloudflareinsights"]')).toHaveCount(0);
 }
 for(const related of entry.related){const url=related.type==='book'?`/libros/${related.slug}/`:`/recursos/${related.slug}.pdf`;expect((await request.get(url)).status()).toBe(200);}
 await page.goto('/guias/');await expect(page.getByRole('link',{name:entry.title,exact:true})).toBeVisible();
 expect(await (await request.get('/sitemap.xml')).text()).toContain('https://lumendia.com.ar'+path);
 for(const url of [`/.local/editorial/${entry.slug}.md`,`/src/content/editorial/${entry.slug}.json`,`/src/content/editorial/${entry.slug}.md`,'/.local/editorial/backups/','/tutoriales/','/tips/','/relatos/','/temas/'])expect((await request.get(url)).status()).toBe(404);
});
