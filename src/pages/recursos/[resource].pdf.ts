import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resources,type Resource} from '../../lib/catalog';
export function getStaticPaths(){return resources.map(({resource})=>({params:{resource:resource.slug},props:{resource}}))}
// Los PDF gratuitos se leen de .local/ en el build; el hash impide publicar un archivo distinto del aprobado.
export function GET({props}:{props:{resource:Resource}}){const {resource}=props;if(!existsSync(resource.file))throw new Error('Falta el recurso '+resource.file);const bytes=readFileSync(resource.file);if(createHash('sha256').update(bytes).digest('hex')!==resource.sha256)throw new Error('El recurso no coincide con el original aprobado: '+resource.file);return new Response(new Uint8Array(bytes),{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="${resource.slug}.pdf"`}})}
