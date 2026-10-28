import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('Retirada: 404 sin sustitución, enlaces vigentes, móvil y privacidad',async({page,request})=>{
 for(const path of ['/relatos/el-ultimo-pasajero/','/relatos/','/autores/gael-beltra/','/tips/','/.local/withdrawn/el-ultimo-pasajero/el-ultimo-pasajero.md']){
  const r=await request.get(path);expect(r.status()).toBe(404);expect(await r.text()).not.toContain('La mujer del bolso rojo bajó');
 }
 const sitemap=await (await request.get('/sitemap.xml')).text();
 for(const fragment of ['/relatos/','/autores/gael-beltra/','/tips/'])expect(sitemap).not.toContain(fragment);
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  for(const path of ['/','/biblioteca/','/guias/','/tutoriales/']){
   await page.goto(path);await expect(page.locator('h1')).toHaveCount(1);
   await expect(page.locator('a[href^="/relatos/"],a[href="/autores/gael-beltra/"]')).toHaveCount(0);
   await expect(page.locator('main')).not.toContainText('El último pasajero');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  }
  await page.locator('#privacy-settings').click();await page.locator('#privacy-close').click();
  await page.locator('#privacy-settings').click();await page.locator('#consent-reject').click();
  await expect(page.locator('script[data-cf-beacon]')).toHaveCount(0);
 }
});
