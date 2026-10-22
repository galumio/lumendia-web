export {};
const english=document.documentElement.lang==='en';
const get=(key:string)=>{try{return localStorage.getItem(key)}catch{return null}};
const set=(key:string,value:string)=>{try{localStorage.setItem(key,value)}catch{}};
const theme=document.querySelector<HTMLButtonElement>('#theme');
function updateTheme(){theme?.setAttribute('aria-label',document.documentElement.dataset.theme==='dark'?(english?'Enable light mode':'Activar modo claro'):(english?'Enable dark mode':'Activar modo oscuro'))}
updateTheme();theme?.addEventListener('click',()=>{const mode=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=mode;set('lumendia-theme',mode);updateTheme()});
const dialog=document.querySelector<HTMLDialogElement>('#privacy-dialog');
document.querySelector('#privacy-settings')?.addEventListener('click',()=>dialog?.showModal());
document.querySelector('#privacy-close')?.addEventListener('click',()=>dialog?.close());
document.querySelector('#consent-reject')?.addEventListener('click',()=>{set('lumendia-consent','rejected');dialog?.close()});
const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
for(const form of document.querySelectorAll<HTMLElement>('[data-search]')){
 const input=form.querySelector<HTMLInputElement>('input');const select=form.querySelector<HTMLSelectElement>('select');
 const items=Array.from(document.querySelectorAll<HTMLElement>('[data-search-item]'));
 const update=()=>{const query=norm(input?.value||'');let count=0;for(const item of items){const match=norm(item.dataset.searchItem||'').includes(query)&&(!select?.value||item.dataset.category===select.value);item.hidden=!match;if(match)count++}const status=document.querySelector('[data-results]');if(status)status.textContent=count?`${count} ${form.dataset.search==='situations'?'situaciones':'publicaciones'}`:'No encontramos resultados. Probá con otras palabras o cambiá el filtro.';};
 input?.addEventListener('input',update);select?.addEventListener('change',update);form.querySelector('button')?.addEventListener('click',()=>{if(input)input.value='';if(select)select.value='';update()});update();
}
for(const resume of document.querySelectorAll<HTMLAnchorElement>('[data-resume]')){
 try{const data=JSON.parse(get('lumendia-progress-'+resume.dataset.resume)||'null');if(data&&typeof data.url==='string'&&data.url.startsWith('/libros/'+resume.dataset.resume+'/')&&!data.url.includes('//')){resume.href=data.url;resume.hidden=false;resume.textContent=(english?'Continue: ':'Continuar: ')+data.title}}catch{}
}
