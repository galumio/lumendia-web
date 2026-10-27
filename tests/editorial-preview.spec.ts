import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {existsSync,readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
const slug='empezar-con-la-ia-cinco-tareas-sencillas';
test('Guía aprobada: lectura, navegación, móvil, teclado y privacidad',async({page,request})=>{
 const external:string[]=[];page.on('request',r=>{if(new URL(r.url()).hostname!=='127.0.0.1')external.push(r.url())});
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:900});await page.goto('/biblioteca/');
  await page.getByRole('link',{name:'Empezar con la IA: cinco tareas sencillas y cómo revisar las respuestas',exact:true}).click();
  await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('html')).toHaveAttribute('lang','es-AR');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow');
  await expect(page.locator('article h2').filter({hasText:/^Tarea [1-5]:/})).toHaveCount(5);
  for(const label of ['Pedido para copiar','Qué comprobar','Ejercicio'])await expect(page.locator('article h3').filter({hasText:new RegExp('^'+label+'$')})).toHaveCount(5);
  await expect(page.locator('article h3').filter({hasText:/^Respuestas? de referencia$/})).toHaveCount(5);
  await expect(page.locator('.editorial-reader header')).toContainText('Lumendia · Galumio Studio');
  await expect(page.locator('.editorial-reader time')).toHaveAttribute('datetime','2026-10-27');
  await expect(page.locator('article')).toContainText('Lista filtrada por verdulería: peras y manzanas');
  const metadata=JSON.parse(readFileSync(`src/content/editorial/${slug}.json`,'utf8'));
  for(const source of metadata.sources)await expect(page.locator('a').filter({hasText:source.title})).toHaveAttribute('href',source.url);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  const link=page.locator('.editorial-toc a').first();await link.focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/#seccion-1$/);
  await page.locator('#privacy-settings').click();await page.locator('#privacy-close').click();await expect(page.locator('#privacy-dialog')).not.toBeVisible();
  await page.locator('#privacy-settings').click();await page.locator('#consent-reject').click();
  await expect(page.locator('script[src*="cloudflareinsights"]')).toHaveCount(0);
  await page.screenshot({path:`.local/editorial-guide-${width}.png`,fullPage:true});
 }
 expect(external).toEqual([]);
 await expect(page.locator('a[href="/recursos/hoja-de-referencia-rapida-ia-para-docentes.pdf"]')).toBeVisible();
 await page.goto('/guias/');await expect(page.locator('h1')).toHaveText('Guías gratuitas');
 for(const url of ['/tutoriales/','/tips/','/relatos/','/temas/','/.local/editorial/'+slug+'.md'])expect((await request.get(url)).status()).toBe(404);
});
test('La salida pública incluye solo la guía aprobada, sin originales ni respaldos',()=>{
 expect(existsSync(`dist-library/guias/${slug}/index.html`)).toBe(true);
 expect(readFileSync('dist-library/sitemap.xml','utf8')).toContain(`/guias/${slug}/`);
 expect(readFileSync('dist-library/biblioteca/index.html','utf8')).toContain(slug);
 const files=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);
 for(const dir of ['dist','dist-library'])for(const path of files(dir)){
  expect(path).not.toMatch(/\.local|\.epub$|\.md$|\.docx$|\.zip$/i);
  if(/\.(html|js|json|xml|txt|map)$/.test(path)){
   const body=readFileSync(path,'utf8');expect(body).not.toContain('antes-revision-final-2026-10-27');
   expect(body).not.toContain('Quizás escuchaste que la inteligencia artificial puede escribir');
   if(dir==='dist')expect(body).not.toContain(slug);
  }
 }
});
test('Los cinco botones copian el pedido exacto; teclado y error de permisos',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{(window as any).copiedPrompt=text}}}));
 await page.goto(`/guias/${slug}/`);
 const groups=page.locator('[data-copy-prompt]');await expect(groups).toHaveCount(5);
 for(let i=0;i<5;i++){
  const group=groups.nth(i);const button=group.getByRole('button',{name:'Copiar pedido',exact:true});
  const expected=await group.locator('blockquote p').textContent();
  await button.focus();await page.keyboard.press('Enter');
  await expect(group.getByRole('status')).toHaveText('Pedido copiado.');
  expect(await page.evaluate(()=>(window as any).copiedPrompt)).toBe(expected);
  const box=await button.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);
 }
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('Denied')}}}));
 await groups.first().getByRole('button').click();
 await expect(groups.first().getByRole('status')).toContainText('No se pudo copiar. Seleccioná el texto');
 await expect(groups.first().locator('blockquote')).toBeVisible();
});
test('Lectura completa sin JavaScript ni registro',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});
 try{const page=await context.newPage();await page.goto(`http://127.0.0.1:4323/guias/${slug}/`);
  await expect(page.locator('article h2').filter({hasText:/^Tarea [1-5]:/})).toHaveCount(5);
  await expect(page.locator('article')).toContainText('Tu práctica final');
  await expect(page.locator('main form, main input[type="email"]')).toHaveCount(0);
  await expect(page.locator('[data-copy-prompt] button:visible')).toHaveCount(0);
 }finally{await context.close()}
});
