// Compila, valida y empaqueta la biblioteca en .local/release/ para publicarla como artefacto.
// Uso: node scripts/package-library.mjs [--dry-run]
// --dry-run incluye el contenido aunque falten aprobaciones; el paquete queda marcado y publish-library.mjs lo rechaza.
import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,readdirSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {launchReport,publishable,loadBooks} from './release-library.mjs';

const run=(command,args)=>{const result=spawnSync(command,args,{stdio:'inherit'});if(result.status!==0)throw new Error(`Falló: ${command} ${args.join(' ')}`)};
const walk=dir=>readdirSync(dir).flatMap(f=>{const p=join(dir,f);return statSync(p).isDirectory()?walk(p):[p]});

export function packageLibrary({dryRun=false}={}){
 if(!dryRun){
  const {errors,excluded}=launchReport();
  if(excluded.length)console.log('Excluidos del build:\n- '+excluded.join('\n- '));
  if(errors.length)throw new Error('PUBLICACIÓN BLOQUEADA:\n'+errors.join('\n'));
 }
 run(process.execPath,['scripts/build.mjs',dryRun?'dry-run':'library']);
 run(process.execPath,['scripts/validate.mjs','dist-library',...(dryRun?['--dry-run']:[])]);
 const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\..+/,'');
 const name=`lumendia-site-${stamp}${dryRun?'-DRY-RUN':''}.tar.gz`;
 mkdirSync('.local/release',{recursive:true});
 const archive=join('.local/release',name);
 run('tar',['-czf',archive,'-C','dist-library','.']);
 const sha256=createHash('sha256').update(readFileSync(archive)).digest('hex');
 // Libros y recursos incluidos: publish-library.mjs los verifica en el sitio después de desplegar.
 const books=loadBooks().filter(b=>dryRun||publishable(b)).map(b=>({slug:b.slug,resources:(b.resources??[]).map(r=>({slug:r.slug,sha256:r.sha256}))}));
 const manifest={name,archive,sha256,dryRun,books,files:walk('dist-library').length,createdAt:new Date().toISOString()};
 writeFileSync(archive+'.json',JSON.stringify(manifest,null,2));
 console.log(`Paquete ${dryRun?'de ENSAYO (no publicable) ':''}listo: ${archive}\nSHA-256 ${sha256} · ${manifest.files} archivos`);
 return manifest;
}

if(import.meta.url===pathToFileURL(process.argv[1]).href){
 try{packageLibrary({dryRun:process.argv.includes('--dry-run')})}catch(error){console.error(error.message);process.exit(1)}
}
