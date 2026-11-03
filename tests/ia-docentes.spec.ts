import {test,expect,type Page} from '@playwright/test';import AxeBuilder from '@axe-core/playwright';import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
const root='/libros/ia-para-docentes/';
const book=JSON.parse(readFileSync('src/content/books/ia-para-docentes.json','utf8'));
const axe=async(page:Page)=>expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
const noOverflow=async(page:Page)=>expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
test('Docentes: publicación autorizada en Biblioteca y acceso desde Aprendé IA',async({page})=>{
 await page.goto('/biblioteca/');await expect(page.locator('.book-card')).toHaveCount(5);await expect(page.locator('.book-card',{hasText:'IA para docentes'})).toHaveCount(1);
 await page.locator('#primary-navigation').getByRole('link',{name:'Aprendé IA',exact:true}).click();await expect(page).toHaveURL(/\/aprende-ia\/$/);
 await expect(page.locator('main')).not.toContainText('selección de seis prompts');const link=page.getByRole('link',{name:'IA para docentes',exact:true});await expect(link).toHaveAttribute('href',root);await link.click();await expect(page).toHaveURL(new RegExp(root+'$'));
 await expect(page.locator('#primary-navigation a[aria-current]')).toHaveText('Biblioteca');await expect(page.locator('.editorial-note')).toHaveCount(0);
});
test('Ficha completa: índice, portada, recurso independiente y accesibilidad',async({page})=>{
 await page.goto(root);await expect(page.locator('h1')).toHaveText('IA para docentes');await expect(page.locator('.book-meta')).toContainText('10 capítulos');await expect(page.locator('.book-hero .eyebrow')).toContainText('Lectura completa gratuita');await expect(page.locator('.book-hero img')).toHaveAttribute('src',book.cover);
 await expect(page.locator('#kit')).toHaveCount(0);await expect(page.locator('main a[href$=".epub"]')).toHaveCount(0);await expect(page.locator('main a[href$=".pdf"]')).toHaveAttribute('href','/recursos/hoja-de-referencia-rapida-ia-para-docentes.pdf');await expect(page.locator('.toc-list a')).toHaveCount(15);await axe(page);
 await page.getByRole('link',{name:'Empezar a leer'}).click();await expect(page).toHaveURL(new RegExp(root+'portada-y-creditos/$'));
});
test('Lectura completa de 15 cuerpos: capítulos, avisos y anexo sin CTA históricos',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(root+book.readingOrder[0]+'/');
 for(const slug of book.readingOrder){await expect(page).toHaveURL(new RegExp(root+slug+'/$'));await expect(page.locator('.reader-content h1')).toHaveCount(1);await expect(page.locator('.breadcrumb')).toContainText('IA para docentes');await expect(page.locator('.reader-sidebar a[aria-current]')).toHaveAttribute('href',root+slug+'/');
 const original=book.pages.find((p:any)=>p.slug===slug).html;expect(await page.locator('.reader-content').evaluate((e,html)=>{const d=document.createElement('div');d.innerHTML=html;return e.innerHTML===d.innerHTML},original)).toBe(true);
 await expect(page.locator('.reader-content a[href="#COMPRAR"],.reader-content a[href*="galumio.com.ar/productos/"],.reader-content a[href$=".pdf"],.reader-content a[href$=".epub"]')).toHaveCount(0);await page.locator('.chapter-nav a').last().click();}
 await expect(page).toHaveURL(new RegExp(root+'$'));expect(errors).toEqual([]);
});
test('Capítulo 8: 50 prompts íntegros en celular y modo oscuro',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto(root+'biblioteca-de-prompts/');const titles=await page.locator('.reader-content .prompt h3').allTextContents();expect(titles.map(t=>Number(t.match(/PROMPT\s+(\d+)/)?.[1]))).toEqual(Array.from({length:50},(_,i)=>i+1));
 await expect(page.locator('.editorial-note')).toHaveCount(0);await noOverflow(page);await axe(page);await page.getByRole('button',{name:'Activar modo oscuro'}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await axe(page);await page.screenshot({path:'.local/ia-docentes-mobile.png',fullPage:true});
});

test('Hoja de referencia: descarga gratuita idéntica al original',async({request})=>{const response=await request.get('/recursos/hoja-de-referencia-rapida-ia-para-docentes.pdf');expect(response.ok()).toBeTruthy();expect(createHash('sha256').update(await response.body()).digest('hex')).toBe('814dbebca17b21268003b16514433c809fceccdb3469fb2a9e1b72c7bc29d97a')});
