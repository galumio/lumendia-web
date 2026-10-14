import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const files=execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,'ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
// Premium PDFs y hoja de emergencia: el contenido de los libros nunca entra al repositorio público.
const forbidden=['5ed6a7780d59997655fbacaf746093cfe3aa7923c5a548808d9f6db24c2a6162','f8d6bf11c4428aa254faeb3bd3026492a77ab1ba5289096b1e8e701177b2d71f','abc5f12181054f412b911a93d75407dbb1a80124fbf726b7c7e0a009b7e26ba5'];
const errors=[];
for(const path of files){const bytes=readFileSync(path);const hash=createHash('sha256').update(bytes).digest('hex');if(forbidden.includes(hash)||/\.(zip|pem|key|pdf|tar|gz)$/i.test(path)||/(^|\/)(\.local|\.env|node_modules|dist|dist-library|\.preview|resources|release)(\/|$)/.test(path)||/^src\/content\/books\//.test(path))errors.push(path);if(bytes.length<1000000&&/-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}/.test(bytes.toString()))errors.push(path)}
if(errors.length){console.error('Archivos no aptos para repositorio público:',errors);process.exit(1)}console.log(`${files.length} archivos candidatos revisados; sin PDF premium, ZIP, claves privadas ni tokens con los patrones comprobados. Revisión humana requerida antes de publicar.`);
