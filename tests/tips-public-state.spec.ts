import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync('src/content/tips-approved.json','utf8'));
const entries=manifest.map((m:any)=>JSON.parse(readFileSync(`src/content/editorial/${m.slug}.json`,'utf8')));
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Argentina/Buenos_Aires'}).format(new Date());
const published=entries.every((e:any)=>e.publishedAt&&e.publishedAt<=today);
test('Public tip routes, menu and sitemap follow the approved batch dates; private originals never ship',async({page,request})=>{
 expect(new Set(entries.map((e:any)=>e.publishedAt)).size).toBe(1);
 for(const path of ['/tips/',...entries.map((e:any)=>`/tips/${e.slug}/`)]){
  expect((await request.get(path)).status()).toBe(published?200:404);
 }
 const sitemap=await(await request.get('/sitemap.xml')).text();
 expect((sitemap.match(/<loc>https:\/\/lumendia.com.ar\/tips\//g)||[]).length).toBe(published?13:0);
 for(const path of ['/','/biblioteca/']){
  await page.goto(path);
  await expect(page.locator('header nav a[href="/tips/"]')).toHaveCount(0);await page.locator('#primary-navigation').getByRole('link',{name:'Aprendé IA',exact:true}).click();await expect(page).toHaveURL(/\/aprende-ia\/$/);const tips=page.locator('main').getByRole('link',{name:'Tips de IA',exact:true});await expect(tips).toHaveCount(published?1:0);if(published){await tips.click();await expect(page).toHaveURL(/\/tips\/$/);await expect(page.locator('#primary-navigation a[aria-current]')).toHaveText('Aprendé IA');}
  if(!published)await expect(page.locator('a[href^="/tips/"]')).toHaveCount(0);
 }
 for(const path of ['/.local/','/docs/editorial-history/tips-approved-v1.json',...entries.map((e:any)=>`/src/content/editorial/${e.slug}.md`)]){
  expect((await request.get(path)).status()).toBe(404);
 }
});
