import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync} from 'node:fs';
const slugs=['ia-cotidiana-para-adultos-mayores','ia-para-el-dia-a-dia','cuidar-a-mama-o-papa','como-estudiar-para-un-final'];
for(const slug of slugs){
 const book=JSON.parse(readFileSync(`src/content/books/${slug}.json`,'utf8'));
 if(slug==='ia-cotidiana-para-adultos-mayores'&&book.sample)continue;
 const chapter=slug==='ia-cotidiana-para-adultos-mayores'?'capitulo-5':book.pages.filter((p:any)=>p.words>500)[0].slug;
 for(const width of [390,768,1440])for(const dark of [false,true])test(`${slug}: ${width}px ${dark?'dark':'light'} restoration and keyboard`,async({page})=>{
  await page.setViewportSize({width,height:844});
  await page.addInitScript(d=>localStorage.setItem('lumendia-theme',d?'dark':'light'),dark);
  const root=`/libros/${slug}/`,route=root+chapter+'/';await page.goto(route);
  await page.locator('#font-larger').focus();await page.keyboard.press('Enter');
  expect(await page.evaluate(()=>localStorage.getItem('lumendia-font'))).toBe('22');
  expect(await page.locator('#font-larger').evaluate(e=>({focused:e===document.activeElement,outline:getComputedStyle(e).outlineStyle}))).toEqual({focused:true,outline:'solid'});
  await page.evaluate(()=>scrollTo({top:1800,behavior:'instant'}));await page.waitForTimeout(250);
  const stored=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!),`lumendia-progress-${slug}`);expect(stored.scroll).toBe(1800);
  await page.reload();await page.evaluate(()=>new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r()))));
  expect(await page.evaluate(()=>scrollY)).toBe(1800);
  expect(await page.locator('#reading-progress').getAttribute('value')).toBe(String(stored.percent));
  // Leave before the 200ms save delay, then return via a fresh document.
  await page.evaluate(()=>scrollTo({top:1900,behavior:'instant'}));
  await page.goto(root);expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).scroll,`lumendia-progress-${slug}`)).toBe(1900);
  await page.goto(route);await page.evaluate(()=>new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r()))));expect(await page.evaluate(()=>scrollY)).toBe(1900);
  await page.goBack();await page.goForward();await expect(page).toHaveURL(route);expect(await page.evaluate(()=>scrollY)).toBe(1900);
  await page.locator('#font-larger').focus();for(let i=0;i<3;i++)await page.keyboard.press('Enter');
  expect(await page.evaluate(()=>localStorage.getItem('lumendia-font'))).toBe('28');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.dataset.theme)).toBe(dark?'dark':'light');
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
 });
}
