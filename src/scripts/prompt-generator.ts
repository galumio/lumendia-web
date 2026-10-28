import {buildPrompt,promptTasks} from '../lib/prompt-generator.mjs';
const form=document.querySelector<HTMLFormElement>('#prompt-form');
if(form){
 const task=document.querySelector<HTMLSelectElement>('#prompt-task')!;
 const goal=document.querySelector<HTMLTextAreaElement>('#prompt-goal')!;
 const context=document.querySelector<HTMLTextAreaElement>('#prompt-context')!;
 const style=document.querySelector<HTMLSelectElement>('#prompt-style')!;
 const format=document.querySelector<HTMLSelectElement>('#prompt-format')!;
 const result=document.querySelector<HTMLElement>('#prompt-result')!;
 const output=document.querySelector<HTMLTextAreaElement>('#prompt-output')!;
 const status=document.querySelector<HTMLElement>('#prompt-status')!;
 const error=document.querySelector<HTMLElement>('#prompt-error')!;
 const copy=document.querySelector<HTMLButtonElement>('#prompt-copy')!;
 const counts=()=>{document.querySelector('#goal-count')!.textContent=`${goal.value.length} de 240 caracteres`;document.querySelector('#context-count')!.textContent=`${context.value.length} de 1000 caracteres`;};
 const clear=()=>{form.reset();output.value='';result.hidden=true;copy.disabled=true;error.textContent='';counts();document.querySelector('#task-hint')!.textContent='Elegí una tarea para ver un ejemplo.';};
 form.addEventListener('submit',event=>{
  event.preventDefault();error.textContent='';
  try{
   const generated=buildPrompt({task:task.value,goal:goal.value,context:context.value,style:style.value,format:format.value});
   output.value=generated.text;document.querySelector('#prompt-check')!.textContent=generated.check;
   result.hidden=false;copy.disabled=false;status.textContent='Plantilla preparada. Revisala antes de copiar.';output.focus({preventScroll:true});result.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }catch(e){error.textContent=e instanceof Error?e.message:'Revisá los campos.';result.hidden=true;output.value='';copy.disabled=true;error.focus();}
 });
 form.addEventListener('input',()=>{counts();error.textContent='';if(!result.hidden){copy.disabled=true;status.textContent='Cambiaste los datos. Pulsá Preparar mi pedido para actualizar la plantilla.';}});
 task.addEventListener('change',()=>{document.querySelector('#task-hint')!.textContent=promptTasks.find(t=>t.id===task.value)?.hint??'Elegí una tarea para ver un ejemplo.';});
 output.addEventListener('input',()=>{copy.disabled=!output.value.trim();status.textContent='Revisá tus cambios antes de copiar.';});
 copy.addEventListener('click',async()=>{
  if(copy.disabled||!output.value.trim())return;
  try{await navigator.clipboard.writeText(output.value);status.textContent='Pedido copiado. Podés pegarlo en la herramienta que elijas.';}
  catch{status.textContent='No se pudo copiar. Seleccioná el pedido y usá Copiar en tu dispositivo.';output.focus();output.select();}
 });
 document.querySelector('#prompt-example')!.addEventListener('click',()=>{clear();task.value='mensajes';goal.value='Invitar a un encuentro de lectura en el barrio.';context.value='Ejemplo ficticio: sábado a las 16, en el salón vecinal. Pedir que cada persona lleve un libro para recomendar.';style.value='cercano';format.value='parrafo';counts();task.dispatchEvent(new Event('change'));status.textContent='Ejemplo ficticio cargado. Podés editarlo y preparar tu pedido.';goal.focus();});
 document.querySelector('#prompt-clear')!.addEventListener('click',()=>{clear();status.textContent='Se borraron los campos y el pedido.';task.focus();});
 // Tampoco se restaura el formulario al volver con el botón Atrás.
 window.addEventListener('pageshow',()=>{clear();status.textContent='';});
 clear();document.querySelector<HTMLElement>('#prompt-unavailable')!.hidden=true;form.hidden=false;
}
