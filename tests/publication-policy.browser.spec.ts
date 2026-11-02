import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
test('Salida pública incluye IA completa sin descargas y conserva recursos históricos; Alzheimer excluido',async({page,request})=>{
 test.setTimeout(90000);
 const root='/libros/ia-para-el-dia-a-dia/';
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:844});await page.goto(root);
  await expect(page.locator('main')).toContainText('Libro completo gratuito');await expect(page.locator('a[download]')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await page.getByRole('link',{name:'Empezar a leer'}).click();await expect(page).toHaveURL(root+'creditos/');
 }
 for(const path of ['/recursos/ia-para-el-dia-a-dia-completo.pdf','/recursos/ia-para-el-dia-a-dia-completo.epub','/libros/cuidar-a-mama-o-papa/','/.local/ia-dia-published-sample.json','/src/content/editorial-policy.json'])expect((await request.get(path)).status()).toBe(404);
 const manifest=JSON.parse(readFileSync('src/content/approved-resources.json','utf8'));
 for(const r of manifest.resources.filter((r:any)=>['como-estudiar-para-un-final','ia-para-docentes'].includes(r.book))){const response=await request.get(r.path);expect(response.status()).toBe(200);expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(r.sha256);}
 for(const path of [root+'salud-y-bienestar/',root+'creditos/','/autores/gael-beltra/','/relatos/el-silbido-detras-del-monte/','/relatos/la-habitacion-que-no-figuraba/','/herramientas/generador-de-prompts/','/tutoriales/tu-primera-conversacion-con-una-ia/'])expect((await request.get(path)).status()).toBe(200);
});
