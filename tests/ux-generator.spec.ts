import{test,expect}from'@playwright/test';
import AxeBuilder from'@axe-core/playwright';
import{existsSync,readFileSync}from'node:fs';
const path='/herramientas/generador-de-prompts/';
test('Seis tareas, edición, copia y borrado: cero red y cero almacenamiento de campos',async({page})=>{
 const external:string[]=[];page.on('request',r=>{if(new URL(r.url()).hostname!=='127.0.0.1')external.push(r.url())});
 await page.addInitScript(()=>{localStorage.setItem('lumendia-cloudflare-consent-v1','accepted');Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{(window as any).copied=text}}})});
 await page.goto(path);await page.waitForLoadState('networkidle');const requests:string[]=[];page.on('request',r=>requests.push(r.url()));
 const storage=await page.evaluate(()=>JSON.stringify({...localStorage}));
 for(const task of ['mensajes','estudio','tareas','educacion','ideas','textos']){
  await page.locator('#prompt-task').selectOption(task);await page.locator('#prompt-goal').fill('Objetivo de prueba');await page.locator('#prompt-context').fill('Dato ficticio privado Z9');await page.getByRole('button',{name:'Preparar mi pedido'}).click();
  await expect(page.locator('#prompt-output')).toBeFocused();await expect(page.locator('#prompt-output')).toHaveValue(/Objetivo de prueba/);
  await page.locator('#prompt-output').fill('Pedido editado por la persona');await page.locator('#prompt-copy').focus();await page.keyboard.press('Enter');expect(await page.evaluate(()=>(window as any).copied)).toBe('Pedido editado por la persona');
 }
 expect(await page.evaluate(()=>JSON.stringify({...localStorage}))).toBe(storage);expect(await page.evaluate(()=>sessionStorage.length)).toBe(0);
 await page.locator('#prompt-goal').fill('Cambio');await expect(page.locator('#prompt-copy')).toBeDisabled();
 await page.locator('#prompt-clear').click();await expect(page.locator('#prompt-goal')).toHaveValue('');await expect(page.locator('#prompt-context')).toHaveValue('');await expect(page.locator('#prompt-output')).toHaveValue('');await expect(page.locator('#prompt-task')).toBeFocused();
 expect(requests).toEqual([]);expect(external).toEqual([]);await expect(page.locator('script[src*="cloudflareinsights"]')).toHaveCount(0);await expect(page.locator('body')).not.toHaveAttribute('data-measurement','cloudflare');
});
test('Validación, inyección de HTML y portapapeles denegado',async({page})=>{
 await page.goto(path);await page.getByRole('button',{name:'Preparar mi pedido'}).click();await expect(page.locator('#prompt-result')).not.toBeVisible();await expect(page.locator('#prompt-task')).toBeFocused();
 await page.locator('#prompt-task').selectOption('textos');await page.locator('#prompt-goal').fill('Entender un aviso');
 const hostile='</textarea><img src="https://example.org/pixel" onerror="window.pwned=1"><script>window.pwned=1</script>';
 await page.locator('#prompt-context').fill(hostile);await page.getByRole('button',{name:'Preparar mi pedido'}).click();await expect(page.locator('#prompt-output')).toHaveValue(new RegExp('window.pwned=1'));expect(await page.evaluate(()=>(window as any).pwned)).toBeUndefined();await expect(page.locator('img[src*="example.org"]')).toHaveCount(0);
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied')}}}));await page.locator('#prompt-copy').click();await expect(page.locator('#prompt-status')).toContainText('No se pudo copiar');await expect(page.locator('#prompt-output')).toBeFocused();
 await page.locator('#prompt-context').evaluate((e:HTMLTextAreaElement)=>e.value='x'.repeat(1001));await page.locator('#prompt-form').evaluate((e:HTMLFormElement)=>e.dispatchEvent(new Event('submit',{cancelable:true,bubbles:true})));await expect(page.locator('#prompt-error')).toContainText('límite');await expect(page.locator('#prompt-result')).not.toBeVisible();
 await page.reload();await expect(page.locator('#prompt-goal')).toHaveValue('');
});
test('Escritorio, tablet, móvil, teclado y accesibilidad del formulario y resultado',async({page})=>{
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:900});await page.goto(path);await page.locator('#prompt-task').focus();await page.keyboard.press('ArrowDown');await page.keyboard.press('Tab');await expect(page.locator('#prompt-goal')).toBeFocused();await page.keyboard.type('Pedir un horario');await page.locator('#prompt-style').selectOption('formal');await page.locator('#prompt-format').selectOption('pasos');await page.getByRole('button',{name:'Preparar mi pedido'}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  expect((await page.locator('#prompt-copy').boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await page.screenshot({path:`.local/ux-generator-${width}.png`,fullPage:true});
 }
});
test('Inicio y biblioteca: accesos existentes, lectores accesibles y etiquetas',async({page,request})=>{
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:900});await page.goto('/');await expect(page.locator('h1')).toHaveText('¿Qué te gustaría hacer hoy?');
  for(const link of await page.locator('.start-card').all())expect((await request.get((await link.getAttribute('href'))!)).status()).toBe(200);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);await page.screenshot({path:`.local/ux-home-${width}.png`,fullPage:true});
 }
 await page.goto('/biblioteca/');await expect(page.getByText('Este buscador filtra los libros', {exact:false})).toBeVisible();await expect(page.locator('.book-meta').filter({hasText:'Muestra del ebook comercial'}).first()).toBeVisible();
 await page.goto('/guias/empezar-con-la-ia-cinco-tareas-sencillas/');await page.getByRole('button',{name:'Letra más grande',exact:true}).click();await expect(page.locator('[data-ux-size]')).toHaveText('22 px');await page.getByRole('button',{name:'Alto contraste',exact:true}).click();await expect(page.locator('[data-ux-contrast]')).toHaveAttribute('aria-pressed','true');expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);await page.getByRole('link',{name:'Ir al índice'}).click();await expect(page).toHaveURL(/#reading-index$/);
});
test('Sin JavaScript no hay envío de formulario; herramienta pública y tips pendientes excluidos',async({browser})=>{
 const c=await browser.newContext({javaScriptEnabled:false});try{const p=await c.newPage();await p.goto('http://127.0.0.1:4373'+path);await expect(p.locator('#prompt-form')).not.toBeVisible();await expect(p.getByText('Para preparar una plantilla necesitás JavaScript.',{exact:false})).toBeVisible();}finally{await c.close()}
 expect(existsSync('dist-library'+path+'index.html')).toBe(true);expect(readFileSync('dist-library/index.html','utf8')).toContain('¿Qué te gustaría');expect(readFileSync('dist-library/sitemap.xml','utf8')).toContain(path);expect(existsSync('dist-library/tips')).toBe(false);expect(readFileSync('dist-library/sitemap.xml','utf8')).not.toContain('/tips/');
});
test('Dominio de producción simulado: consentimiento previo no carga beacon en la herramienta',async({page,context})=>{
 const unexpected:string[]=[];
 await context.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.hostname==='lumendia.com.ar'){const r=await route.fetch({url:'http://127.0.0.1:4373'+u.pathname});await route.fulfill({response:r});return;}
  unexpected.push(u.href);await route.abort();
 });
 await page.addInitScript(()=>localStorage.setItem('lumendia-cloudflare-consent-v1','accepted'));
 await page.goto('https://lumendia.com.ar'+path);await page.waitForLoadState('networkidle');
 await page.locator('#prompt-task').selectOption('ideas');await page.locator('#prompt-goal').fill('Ideas ficticias');await page.getByRole('button',{name:'Preparar mi pedido'}).click();
 await page.locator('#privacy-settings').click();await expect(page.locator('#consent-accept')).not.toBeVisible();await page.locator('#privacy-close').click();
 await expect(page.locator('script[src*="cloudflareinsights"]')).toHaveCount(0);expect(unexpected).toEqual([]);
});

test('Menú móvil: teclado, Escape, cierre y cambio a escritorio',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');const toggle=page.locator('#navigation-toggle');const nav=page.locator('#primary-navigation');
 await expect(nav).toBeHidden();await toggle.focus();await page.keyboard.press('Enter');await expect(toggle).toHaveAttribute('aria-expanded','true');await expect(nav.locator('a').first()).toBeFocused();
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
 await page.keyboard.press('Escape');await expect(nav).toBeHidden();await expect(toggle).toBeFocused();await toggle.click();await toggle.click();await expect(nav).toBeHidden();
 await toggle.click();await nav.locator('a[href="/biblioteca/"]').click();await expect(page).toHaveURL(/\/biblioteca\/$/);await expect(nav).toBeHidden();
 await page.setViewportSize({width:1440,height:900});await expect(nav).toBeVisible();await expect(toggle).toBeHidden();
});
test('Ayuda, ejemplo ficticio y resultado con movimiento reducido',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(path);await page.getByText('Cómo funciona',{exact:true}).click();await expect(page.locator('.prompt-help')).toHaveAttribute('open','');
 await page.locator('#prompt-example').click();await expect(page.locator('#prompt-goal')).toBeFocused();await expect(page.locator('#prompt-context')).toHaveValue(/Ejemplo ficticio/);await expect(page.locator('#prompt-status')).toContainText('Ejemplo ficticio cargado');
 await page.getByRole('button',{name:'Preparar mi pedido'}).click();await expect(page.locator('#prompt-output')).toBeFocused();await expect(page.locator('#prompt-output')).toHaveValue(/encuentro de lectura/);
 await page.locator('#prompt-clear').click();await expect(page.locator('#prompt-context')).toHaveValue('');
});

test('Artefacto publicable: generador rastreable, cinco accesos y ningún tip o borrador',async({page,request})=>{
 await page.goto('/');await expect(page.locator('.start-card')).toHaveCount(5);await expect(page.locator('a[href^="/tips/"]')).toHaveCount(0);
 await page.goto(path);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://lumendia.com.ar'+path);await expect(page.locator('meta[name="robots"]')).toHaveCount(0);await expect(page.locator('.preview-note')).toHaveCount(0);
 const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());expect(schema['@type']).toBe('WebApplication');expect(schema.isAccessibleForFree).toBe(true);
 for(const url of ['/tips/','/tips/preparar-menu-semanal-con-chatgpt/','/.local/editorial/','/src/content/editorial/','/tutoriales/como-utilizar-la-voz-para-hablar-con-la-ia/'])expect((await request.get(url)).status()).toBe(404);
});
