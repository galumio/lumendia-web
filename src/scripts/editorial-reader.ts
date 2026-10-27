// Se ejecuta solo en lectores editoriales. Copiar no envía eventos ni solicitudes.
for(const group of document.querySelectorAll<HTMLElement>('[data-copy-prompt]')){
 const button=group.querySelector<HTMLButtonElement>('button');
 const text=group.querySelector('blockquote p')?.textContent;
 const feedback=group.querySelector<HTMLElement>('.copy-feedback');
 if(!button||!text||!feedback)continue;
 button.hidden=false;
 button.addEventListener('click',async()=>{
  try{
   if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');
   await navigator.clipboard.writeText(text);
   feedback.textContent='Pedido copiado.';
  }catch{
   feedback.textContent='No se pudo copiar. Seleccioná el texto del pedido y usá la opción Copiar de tu dispositivo.';
  }
 });
}
