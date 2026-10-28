import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildPrompt,promptTasks,promptStyles,promptFormats} from '../src/lib/prompt-generator.mjs';
const input={task:'mensajes',goal:'Consultar el horario',context:'Taller ficticio',style:'claro',format:'lista'};
test('Seis tareas y formatos deterministas, sin respuestas de IA',()=>{
 assert.equal(promptTasks.length,6);
 for(const task of promptTasks)for(const style of Object.keys(promptStyles))for(const format of Object.keys(promptFormats)){
  const data={...input,task:task.id,style,format};const a=buildPrompt(data);
  assert.deepEqual(a,buildPrompt(data));assert.ok(a.text.includes(input.goal));assert.ok(a.text.includes(task.instruction));assert.ok(a.check);assert.ok(a.text.length<=4000);
 }
});
test('Entradas vacías, excesivas, controles y opciones manipuladas fallan',()=>{
 for(const patch of [{task:'__proto__'},{goal:'  '},{goal:'x'.repeat(241)},{context:'x'.repeat(1001)},{context:'\0'},{style:'constructor'},{format:'__proto__'}])assert.throws(()=>buildPrompt({...input,...patch}));
 assert.ok(buildPrompt({...input,goal:'x'.repeat(240),context:'x'.repeat(1000)}).text.length<4000);
 assert.ok(buildPrompt({...input,context:''}).text.includes('haceme una pregunta'));
});
test('Contenido hostil sigue siendo texto; no hay red, almacenamiento o evaluación',()=>{
 const hostile='</textarea><img src=x onerror=alert(1)>${fetch("https://example.org")}';
 assert.ok(buildPrompt({...input,context:hostile}).text.includes(hostile));
 for(const file of ['src/lib/prompt-generator.mjs','src/scripts/prompt-generator.ts']){
  const source=readFileSync(file,'utf8');assert.doesNotMatch(source,/\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB|innerHTML|eval\s*\(|new Function/);
 }
});
