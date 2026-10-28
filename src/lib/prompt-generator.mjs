// Plantillas deterministas. Sin red, almacenamiento, HTML ni servicios de IA.
export const promptTasks = Object.freeze([
 {id:'mensajes',label:'Escribir correos y mensajes',hint:'Por ejemplo: preguntar el horario de un taller.',instruction:'Prepará un borrador de correo o mensaje. No inventes nombres, fechas ni compromisos.',check:'Comprobá destinatario, datos y compromisos antes de enviarlo.'},
 {id:'estudio',label:'Estudiar y aprender',hint:'Por ejemplo: practicar fracciones con un ejercicio.',instruction:'Ayudame a estudiar. Explicá una idea y proponé un ejercicio; esperá mi intento antes de dar la solución.',check:'Contrastá las explicaciones con tu material de estudio.'},
 {id:'tareas',label:'Organizar tareas',hint:'Por ejemplo: repartir tres tareas entre lunes y miércoles.',instruction:'Organizá las tareas según el tiempo disponible. Mostrá lo que no entra y no inventes duraciones.',check:'Sumá los tiempos y comprobá que no se superpongan tareas.'},
 {id:'educacion',label:'Preparar actividades educativas',hint:'Por ejemplo: clasificar figuras en una actividad de quince minutos.',instruction:'Proponé una actividad con objetivo, materiales, pasos y una comprobación del aprendizaje. Incluí una alternativa de participación.',check:'Una persona docente debe revisar la actividad antes de usarla.'},
 {id:'ideas',label:'Generar ideas',hint:'Por ejemplo: ideas para una reunión de lectura sin gastos.',instruction:'Proponé cinco ideas distintas y una forma sencilla de probar cada una. Respetá los recursos disponibles.',check:'Revisá si cada idea es viable con tus recursos y tu tiempo.'},
 {id:'textos',label:'Explicar textos sencillos',hint:'Por ejemplo: entender un aviso del centro cultural sin datos personales.',instruction:'Explicá el texto con palabras sencillas. Separá lo que dice expresamente de lo que no está confirmado.',check:'Compará la explicación con el original. No uses esta plantilla para decidir sobre asuntos médicos, legales o financieros.'}
]);
export const promptStyles=Object.freeze({claro:'Claro y sencillo',cercano:'Cercano y amable',formal:'Formal y respetuoso'});
export const promptFormats=Object.freeze({lista:'Lista breve',pasos:'Pasos numerados',parrafo:'Un párrafo corto'});
export const promptLimits=Object.freeze({goal:240,context:1000,output:4000});
/** @param {{task:string,goal:string,context:string,style:string,format:string}} input */
export function buildPrompt(input){
 const task=promptTasks.find(t=>t.id===input.task);
 if(!task)throw new Error('Elegí una tarea de la lista.');
 for(const key of ['goal','context']){
  if(typeof input[key]!=='string'||input[key].length>promptLimits[key])throw new Error('El texto supera el límite permitido.');
  if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(input[key]))throw new Error('Quitá los caracteres de control del texto.');
 }
 if(!input.goal.trim())throw new Error('Escribí qué querés lograr.');
 if(!Object.hasOwn(promptStyles,input.style)||!Object.hasOwn(promptFormats,input.format))throw new Error('Elegí un estilo y un formato de la lista.');
 const text=[task.instruction,`Quiero lograr: ${input.goal.trim()}`,input.context.trim()?`Contexto que aporto:\n${input.context.trim()}`:'Si falta contexto para responder, haceme una pregunta antes de avanzar.',`Estilo: ${promptStyles[input.style]}. Formato: ${promptFormats[input.format]}.`,'No inventes información. Señalá las dudas y qué debería comprobar antes de usar el resultado.'].join('\n\n');
 if(text.length>promptLimits.output)throw new Error('El pedido es demasiado largo.');
 return {text,check:task.check};
}
