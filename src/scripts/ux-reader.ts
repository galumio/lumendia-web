const controls=document.querySelector<HTMLElement>('[data-ux-reading]');
const article=document.querySelector<HTMLElement>('.editorial-reader .reader-content');
if(controls&&article){
 let size=20;const smaller=controls.querySelector<HTMLButtonElement>('[data-ux-smaller]')!;const larger=controls.querySelector<HTMLButtonElement>('[data-ux-larger]')!;
 const apply=()=>{article.style.setProperty('--reader-size',`${size}px`);smaller.disabled=size<=16;larger.disabled=size>=32;controls.querySelector('[data-ux-size]')!.textContent=`${size} px`;};
 smaller.addEventListener('click',()=>{size=Math.max(16,size-2);apply()});larger.addEventListener('click',()=>{size=Math.min(32,size+2);apply()});
 controls.querySelector('[data-ux-contrast]')!.addEventListener('click',event=>{const button=event.currentTarget as HTMLButtonElement;const active=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(active));document.querySelector('.editorial-reader')!.classList.toggle('ux-high-contrast',active)});
 controls.hidden=false;apply();
}
