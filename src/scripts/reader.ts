const reader=document.querySelector<HTMLElement>('[data-reader]');
const article=document.querySelector<HTMLElement>('.reader-content');
if(reader&&article){
 const get=(key:string)=>{try{return localStorage.getItem(key)}catch{return null}};
 const save=(key:string,value:string)=>{try{localStorage.setItem(key,value)}catch{}};
 let size=Number(get('lumendia-font'))||20;size=Math.min(28,Math.max(16,size));
 const smaller=document.querySelector<HTMLButtonElement>('#font-smaller');const larger=document.querySelector<HTMLButtonElement>('#font-larger');
 function apply(){article!.style.setProperty('--reader-size',size+'px');if(smaller)smaller.disabled=size<=16;if(larger)larger.disabled=size>=28;save('lumendia-font',String(size))}apply();
 smaller?.addEventListener('click',()=>{size=Math.max(16,size-2);apply()});larger?.addEventListener('click',()=>{size=Math.min(28,size+2);apply()});
 const progress=document.querySelector<HTMLProgressElement>('#reading-progress');const label=document.querySelector('#progress-label');
 const key='lumendia-progress-'+reader.dataset.book;
 try{const stored=JSON.parse(get(key)||'null');if(stored?.url===location.pathname&&!location.hash&&Number.isFinite(stored.scroll)){requestAnimationFrame(()=>window.scrollTo(0,stored.scroll))}}catch{}
 let timer:ReturnType<typeof setTimeout>;
 function update(){const top=article!.getBoundingClientRect().top+window.scrollY;const total=article!.offsetHeight-window.innerHeight;const value=Math.round(Math.min(100,Math.max(0,total>0?(window.scrollY-top)/total*100:100)));if(progress)progress.value=value;if(label)label.textContent=value+' %';clearTimeout(timer);timer=setTimeout(()=>save(key,JSON.stringify({url:location.pathname,title:reader!.dataset.title,scroll:window.scrollY,percent:value})),200)}
 window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
 document.querySelector('#share')?.addEventListener('click',async()=>{const feedback=document.querySelector('#reader-feedback');try{if(navigator.share){await navigator.share({title:document.title,url:location.href})}else{await navigator.clipboard.writeText(location.href);if(feedback)feedback.textContent='Enlace copiado'}}catch(error){if(feedback)feedback.textContent=error instanceof DOMException&&error.name==='AbortError'?'':'Podés copiar el enlace desde la barra de direcciones.'}});
 if(matchMedia('(max-width:700px)').matches){document.querySelector('.reader-sidebar details')?.removeAttribute('open')}
}
