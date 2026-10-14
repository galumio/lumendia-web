import {readFileSync,readdirSync,lstatSync} from 'node:fs';
import {resolve,relative,join} from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
export const publicFiles=['.nojekyll','404.html','CNAME','favicon.svg','index.html','robots.txt','sitemap.xml','styles.css'];
export function verifyInstitutional(directory){
 const root=resolve(directory);const errors=[];let checks=0;
 const assert=(condition,message)=>{checks++;if(!condition)errors.push(message)};
 const walk=dir=>readdirSync(dir).flatMap(name=>{const p=join(dir,name);assert(!lstatSync(p).isSymbolicLink(),'No se permiten enlaces simbólicos: '+p);return lstatSync(p).isDirectory()?walk(p):[p]});
 const files=walk(root);const names=files.map(p=>relative(root,p).replaceAll('\\','/')).sort();
 assert(JSON.stringify(names)===JSON.stringify([...publicFiles].sort()),'El artefacto contiene archivos faltantes o no permitidos: '+names.join(', '));
 const premium=['5ed6a7780d59997655fbacaf746093cfe3aa7923c5a548808d9f6db24c2a6162','f8d6bf11c4428aa254faeb3bd3026492a77ab1ba5289096b1e8e701177b2d71f'];
 for(const file of files){const data=readFileSync(file);const text=data.toString('utf8');assert(!premium.includes(createHash('sha256').update(data).digest('hex')),'PDF premium: '+file);assert(!/alzheimer|demencia|situacion-\d|\/libros\/|\.pdf\b|COMPRAR|\bFORMULARIO\b|googletagmanager|googlesyndication|localStorage|<script\b|<form\b/i.test(text),'Contenido o integración no permitida: '+file);assert(!/-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}/.test(text),'Posible credencial: '+file);
 if(file.endsWith('.html')){assert((text.match(/<h1(?:\s|>)/g)||[]).length===1,'H1 inválido: '+file);assert(/<title>[^<]+<\/title>/.test(text),'Falta título');assert(/name="description"/.test(text),'Falta descripción');assert(/rel="canonical"/.test(text),'Falta canonical');assert(/lang="es-AR"/.test(text),'Falta idioma');for(const m of text.matchAll(/(?:href|src)="([^"\s]+)"/g)){if(m[1].startsWith('http')){assert(m[1].startsWith('https://'),'URL externa sin HTTPS');continue}const url=new URL(m[1],'https://lumendia.com.ar/'+relative(root,file).replaceAll('\\','/'));const dest=url.pathname==='/'?'index.html':url.pathname.slice(1);assert(publicFiles.includes(dest),'Enlace no permitido: '+m[1]);if(url.hash&&publicFiles.includes(dest))assert(readFileSync(join(root,dest),'utf8').includes(`id="${url.hash.slice(1)}"`),'Ancla inexistente: '+m[1])}}
 }
 assert(readFileSync(join(root,'CNAME'),'utf8').trim()==='lumendia.com.ar','Dominio incorrecto');const sitemap=readFileSync(join(root,'sitemap.xml'),'utf8');assert((sitemap.match(/<loc>/g)||[]).length===1&&sitemap.includes('<loc>https://lumendia.com.ar/</loc>'),'Sitemap debe contener solo el inicio');
 if(errors.length)throw new Error(errors.join('\n'));return {directory:root,files:names,checks,errors:[]};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){console.log(JSON.stringify(verifyInstitutional(process.argv[2]||'dist'),null,2))}

