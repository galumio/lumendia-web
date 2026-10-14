import {readFileSync,existsSync} from 'node:fs';
import {available} from '../../lib/catalog';
export function getStaticPaths(){return available.some(b=>b.resource==='caregiver-emergency')?[{params:{resource:'hoja-de-emergencia-del-cuidador'}}]:[]}
export function GET(){const file=['resources/Hoja-de-emergencia-del-cuidador.pdf','.local/originals/Hoja-de-emergencia-del-cuidador.pdf'].find(existsSync);if(!file)throw new Error('Falta la hoja de emergencia suministrada.');return new Response(new Uint8Array(readFileSync(file)),{headers:{'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="Hoja-de-emergencia-del-cuidador.pdf"'}})}

