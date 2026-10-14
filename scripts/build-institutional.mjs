import {mkdirSync,copyFileSync,existsSync,rmSync,lstatSync,realpathSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {verifyInstitutional,publicFiles} from './verify-institutional.mjs';
const workspace=realpathSync(process.cwd());
const target=resolve(workspace,'dist');
if(target!==join(workspace,'dist'))throw new Error('Destino no permitido');
if(existsSync(target)){if(lstatSync(target).isSymbolicLink()||realpathSync(target)!==target)throw new Error('Destino enlazado no permitido');rmSync(target,{recursive:true})}
mkdirSync(target,{recursive:true});
for(const file of publicFiles)copyFileSync(join('institutional',file),join(target,file));
const result=verifyInstitutional(target);mkdirSync('.local',{recursive:true});writeFileSync('.local/institutional-validation.json',JSON.stringify(result,null,2));console.log(`Página temporal compilada: ${result.files.length} archivos; ${result.checks} comprobaciones aprobadas.`);
