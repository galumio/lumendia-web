import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const files=execFileSync('git',['-c',`safe.directory=${process.cwd().replaceAll('\\','/')}`,'ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
// Premium PDFs y hoja de emergencia: el contenido de los libros nunca entra al repositorio público.
const forbidden=['5ed6a7780d59997655fbacaf746093cfe3aa7923c5a548808d9f6db24c2a6162','f8d6bf11c4428aa254faeb3bd3026492a77ab1ba5289096b1e8e701177b2d71f','abc5f12181054f412b911a93d75407dbb1a80124fbf726b7c7e0a009b7e26ba5','f5786c9052eb5aadc1b4bc362d12e70d5f9491da811f0cbc90d45199944263c5','87a1250fb70a77e9ddfab8c3af942dd0a97b1b4b710e46d48f4b0b0e24927247','53f94ce95a64e10c62f69a57d81dc9960d75f9df377b771e05c5b26d20ca2e19','814dbebca17b21268003b16514433c809fceccdb3469fb2a9e1b72c7bc29d97a'];
const errors=[];
for(const path of files){const bytes=readFileSync(path);const hash=createHash('sha256').update(bytes).digest('hex');if(forbidden.includes(hash)||/\.(zip|pem|key|pdf|tar|gz|epub|mobi|azw3?)$/i.test(path)||/(^|\/)(\.local|\.env|node_modules|dist|dist-library|\.preview|resources|release)(\/|$)/.test(path)||/^src\/content\/books\//.test(path))errors.push(path);if(bytes.length<1000000&&/-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}/.test(bytes.toString()))errors.push(path)}
if(errors.length){console.error('Archivos no aptos para repositorio público:',errors);process.exit(1)}console.log(`${files.length} archivos candidatos revisados; sin PDF premium, ZIP, claves privadas ni tokens con los patrones comprobados. Revisión humana requerida antes de publicar.`);
