const toggle=document.querySelector<HTMLButtonElement>('#navigation-toggle');
const navigation=document.querySelector<HTMLElement>('#primary-navigation');
if(toggle&&navigation){
 const mobile=window.matchMedia('(max-width: 1000px)');
 const close=(restore=false)=>{toggle.setAttribute('aria-expanded','false');toggle.textContent=toggle.dataset.openLabel??'Menú';navigation.hidden=mobile.matches;if(restore)toggle.focus();};
 const sync=()=>{const focused=navigation.contains(document.activeElement);toggle.hidden=!mobile.matches;close(mobile.matches&&focused);};
 toggle.addEventListener('click',()=>{if(toggle.getAttribute('aria-expanded')==='true'){close(true);}else{navigation.hidden=false;toggle.setAttribute('aria-expanded','true');toggle.textContent=toggle.dataset.closeLabel??'Cerrar menú';navigation.querySelector<HTMLAnchorElement>('a')?.focus();}});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){event.preventDefault();close(true);}});
 navigation.addEventListener('click',event=>{if((event.target as Element).closest('a')&&mobile.matches)close();});
 mobile.addEventListener('change',sync);sync();
}
