// Publica la biblioteca en lumendia.com.ar a partir de un build local.
// El contenido nunca entra al repositorio: el paquete se adjunta a un release BORRADOR (visible solo
// para quienes tienen acceso de escritura) y el workflow deploy-library.yml lo verifica y despliega.
//
// Uso:
//   node scripts/publish-library.mjs --confirm-launch          compila, sube y despliega
//   node scripts/publish-library.mjs --rollback-institutional  vuelve a publicar la presentación institucional
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {packageLibrary} from './package-library.mjs';

const REPO='galumio/lumendia-web';
const API=`https://api.github.com/repos/${REPO}`;
const SITE='https://lumendia.com.ar';
const args=process.argv.slice(2);
if(!args.includes('--confirm-launch')&&!args.includes('--rollback-institutional')){
 console.error('Indicá --confirm-launch (publicar la biblioteca) o --rollback-institutional (volver a la presentación).');process.exit(1);
}

function token(){
 const credential=spawnSync('git',['credential','fill'],{input:'protocol=https\nhost=github.com\nusername=galumio\n\n',encoding:'utf8',env:{...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'Never'},windowsHide:true});
 const password=credential.status===0&&credential.stdout.match(/^password=(.+)$/m)?.[1];
 if(!password)throw new Error('No se pudo obtener la sesión GitHub del administrador de credenciales.');
 return password;
}
const headers={Authorization:`Bearer ${token()}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'lumendia-publish'};
async function api(path,options={}){
 const response=await fetch(path.startsWith('https://')?path:API+path,{...options,headers:{...headers,...options.headers}});
 if(!response.ok)throw new Error(`${options.method||'GET'} ${path}: HTTP ${response.status} ${await response.text()}`);
 return response.status===204?null:response.json();
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function dispatchAndWait(workflow,inputs){
 const since=Date.now()-5000;
 await api(`/actions/workflows/${workflow}/dispatches`,{method:'POST',body:JSON.stringify({ref:'main',inputs})});
 console.log(`Workflow ${workflow} solicitado. Esperando resultado…`);
 for(let i=0;i<120;i++){
  await sleep(10000);
  const {workflow_runs:runs}=await api(`/actions/workflows/${workflow}/runs?event=workflow_dispatch&per_page=5`);
  const runInfo=runs.find(r=>Date.parse(r.created_at)>=since);
  if(runInfo?.status==='completed'){console.log(`Resultado: ${runInfo.conclusion} · ${runInfo.html_url}`);if(runInfo.conclusion!=='success')throw new Error('El despliegue no finalizó correctamente. El sitio publicado no cambió.');return runInfo}
 }
 throw new Error('Tiempo de espera agotado; revisar la ejecución en GitHub Actions.');
}

const user=await api('https://api.github.com/user');
if(user.login!=='galumio')throw new Error('La cuenta autenticada no es galumio. No se modificó nada.');

if(args.includes('--rollback-institutional')){
 await dispatchAndWait('deploy.yml',{});
 console.log('Presentación institucional publicada nuevamente.');
 process.exit(0);
}

await api('/contents/.github/workflows/deploy-library.yml?ref=main').catch(()=>{throw new Error('Falta .github/workflows/deploy-library.yml en main.')});
const manifest=packageLibrary();
const release=await api('/releases',{method:'POST',body:JSON.stringify({tag_name:manifest.name.replace('.tar.gz',''),name:`Artefacto privado ${manifest.name}`,draft:true,body:`Build local de la biblioteca. SHA-256 ${manifest.sha256}. Borrador privado: no publicar este release.`})});
const upload=await fetch(`https://uploads.github.com/repos/${REPO}/releases/${release.id}/assets?name=${encodeURIComponent(manifest.name)}`,{method:'POST',headers:{...headers,'Content-Type':'application/gzip'},body:readFileSync(manifest.archive)});
if(!upload.ok)throw new Error(`Falló la subida del artefacto: HTTP ${upload.status}`);
console.log(`Artefacto subido al release borrador ${release.id}.`);
const runInfo=await dispatchAndWait('deploy-library.yml',{release_id:String(release.id),asset_name:manifest.name,sha256:manifest.sha256});

// Comprobación pública posterior al despliegue (la CDN de Pages puede tardar unos minutos).
const checks=[['/','book-card'],['/biblioteca/','Cuidar a mamá o papá'],['/libros/cuidar-a-mama-o-papa/situaciones/','situacion-50']];
for(let attempt=0;attempt<18;attempt++){
 const results=await Promise.all(checks.map(async([path,text])=>{const r=await fetch(SITE+path,{cache:'no-store'});return r.ok&&(await r.text()).includes(text)}));
 const pdf=await fetch(SITE+'/recursos/hoja-de-emergencia-del-cuidador.pdf',{cache:'no-store'});
 const pdfOk=pdf.ok&&createHash('sha256').update(Buffer.from(await pdf.arrayBuffer())).digest('hex')==='abc5f12181054f412b911a93d75407dbb1a80124fbf726b7c7e0a009b7e26ba5';
 if(results.every(Boolean)&&pdfOk){console.log(`Biblioteca publicada y verificada en ${SITE} (${runInfo.html_url}).`);process.exit(0)}
 await sleep(20000);
}
console.error('El workflow finalizó, pero la verificación pública todavía no coincide. Revisar en unos minutos.');process.exit(1);
