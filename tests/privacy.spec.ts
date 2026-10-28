import {readFileSync} from 'node:fs';
import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const key='lumendia-cloudflare-consent-v1';
const beacon='https://static.cloudflareinsights.com/beacon.min.js';
for(const en of [false,true])test(`Cloudflare opt-in and withdrawal ${en?'EN':'ES'}`,async({page,context})=>{
 const calls:string[]=[];
 await context.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.href===beacon){calls.push(u.href);await route.fulfill({contentType:'application/javascript',body:'window.__beaconLoads=(window.__beaconLoads||0)+1;'});return;}
  if(u.hostname==='lumendia.com.ar'){const r=await route.fetch({url:(process.env.LUMENDIA_PRIVACY_TEST_ORIGIN||'http://127.0.0.1:4321')+u.pathname+u.search});await route.fulfill({response:r});return;}
  throw Error('Unexpected external request: '+u.href);
 });
 await page.setViewportSize({width:390,height:844});
 const root='https://lumendia.com.ar/libros/'+(en?'ai-for-everyday-life':'ia-para-el-dia-a-dia')+'/';
 await page.goto(root);
 await expect(page.locator('#privacy-dialog')).not.toBeVisible();
 for (const width of [1440,390]) {
  await page.setViewportSize({width,height:844});
  const trigger=page.locator('.footer-grid #privacy-settings');
  await expect(trigger).toBeVisible();
  const box=await trigger.boundingBox();expect(box!.width).toBeGreaterThanOrEqual(44);expect(box!.height).toBeGreaterThanOrEqual(44);
  expect(await trigger.evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(14);
  await trigger.focus();await page.keyboard.press('Enter');
  await expect(page.locator('#consent-state')).toHaveText(en?'No choice made':'Sin elección');
  await page.locator('#privacy-close').click();await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');await page.keyboard.press('Escape');
  await expect(page.locator('#privacy-dialog')).not.toBeVisible();
  expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBeNull();expect(calls).toEqual([]);
 }
 await expect(page.locator('script[data-cf-beacon]')).toHaveCount(0);expect(calls).toEqual([]);
 // Legacy consent must not authorize a different provider.
 await page.evaluate(()=>localStorage.setItem('lumendia-consent','accepted'));await page.reload();expect(calls).toEqual([]);
 await page.locator('#privacy-settings').click();
 await expect(page.locator('#consent-description')).toContainText('Cloudflare');
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.locator('#consent-reject').click();await page.reload();expect(calls).toEqual([]);
 await page.locator('#privacy-settings').click();
 await expect(page.locator('#consent-state')).toHaveText(en?'Analytics rejected':'Medición rechazada');
 await expect(page.locator('#consent-accept')).toHaveText(en?'Accept optional analytics':'Aceptar medición opcional');
 await page.locator('#consent-accept').click();
 await expect.poll(()=>calls.length).toBe(1);
 await expect(page.locator('script[data-cf-beacon]')).toHaveCount(1);
 await expect(page.locator('script[data-cf-beacon]')).toHaveAttribute('data-cf-beacon',JSON.stringify({token:'66da1e1b5fe34fc28bdfcad1629fdaa0'}));
 await page.locator('#privacy-settings').click();
 await expect(page.locator('#consent-state')).toHaveText(en?'Analytics accepted':'Medición aceptada');
 await expect(page.locator('#consent-reject')).toHaveText(en?'Withdraw consent':'Retirar consentimiento');
 await page.locator('#consent-accept').click();expect(calls.length).toBe(1);
 await page.getByRole('link',{name:en?'Start reading':'Empezar a leer'}).click();await expect.poll(()=>calls.length).toBe(2);
 await page.locator('#privacy-settings').click();
 await Promise.all([page.waitForEvent('load'),page.locator('#consent-reject').click()]);
 expect(calls.length).toBe(2);await expect(page.locator('script[data-cf-beacon]')).toHaveCount(0);
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe('rejected');
 await page.goto(root);expect(calls.length).toBe(2);
 await page.locator('footer a[href="'+(en?'/en/privacy/':'/privacidad/')+'"]').click();
 await expect(page.locator('main')).toContainText('Cloudflare');await expect(page.locator('html')).toHaveAttribute('lang',en?'en':'es-AR');
 await page.locator('main [data-privacy-open]').click();
 await expect(page.locator('#consent-state')).toHaveText(en?'Analytics rejected':'Medición rechazada');
 await expect(page.locator('#consent-reject')).toHaveText(en?'Reject analytics':'Rechazar medición');
 await page.locator('#privacy-close').click();expect(calls.length).toBe(2);
});
test('No analytics on localhost, preview or when storage is unavailable',async({page,context})=>{
 await context.route('https://static.cloudflareinsights.com/**',()=>{throw Error('Unexpected beacon')});
 await page.addInitScript(k=>{localStorage.setItem(k,'accepted')},key);
 await page.goto('/');await expect(page.locator('script[data-cf-beacon]')).toHaveCount(0);
 await expect(page.locator('#consent-accept')).toBeHidden();
 // Simulate production hostname serving a preview build: both controls must be off.
 await context.route('https://lumendia.com.ar/**',async route=>{
  const u=new URL(route.request().url());const path='.preview'+u.pathname+(u.pathname.endsWith('/')?'index.html':'');await route.fulfill({body:readFileSync(path),contentType:u.pathname.endsWith('.js')?'application/javascript':u.pathname.endsWith('.css')?'text/css':'text/html'});
 });
 await page.goto('https://lumendia.com.ar/');await expect(page.locator('body')).not.toHaveAttribute('data-measurement','cloudflare');
 await expect(page.locator('script[data-cf-beacon]')).toHaveCount(0);
});
test('Storage denied fails closed and cross-tab withdrawal reloads',async({browser})=>{
 const context=await browser.newContext();let calls=0;
 await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.href===beacon){calls++;await route.fulfill({contentType:'application/javascript',body:''});return;}if(u.hostname==='lumendia.com.ar'){const r=await route.fetch({url:(process.env.LUMENDIA_PRIVACY_TEST_ORIGIN||'http://127.0.0.1:4321')+u.pathname});await route.fulfill({response:r});return;}throw Error(u.href)});
 const page=await context.newPage();await page.goto('https://lumendia.com.ar/');
 await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new Error('denied')}});
 await page.locator('#privacy-settings').click();await page.locator('#consent-accept').click();await expect(page.locator('#consent-status')).not.toBeEmpty();expect(calls).toBe(0);
 await page.reload();await page.locator('#privacy-settings').click();await page.locator('#consent-accept').click();await expect.poll(()=>calls).toBe(1);
 const other=await context.newPage();await other.goto('https://lumendia.com.ar/');await expect.poll(()=>calls).toBe(2);
 await other.locator('#privacy-settings').click();await Promise.all([page.waitForEvent('load'),other.waitForEvent('load'),other.locator('#consent-reject').click()]);
 await expect(page.locator('script[data-cf-beacon]')).toHaveCount(0);await expect(other.locator('script[data-cf-beacon]')).toHaveCount(0);expect(calls).toBe(2);
 await context.close();
});
