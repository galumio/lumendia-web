import {spawnSync} from 'node:child_process';
const mode=process.argv[2]||'production';
if(!['preview','production','library','dry-run'].includes(mode))throw new Error('Modo desconocido');
const institutional=mode==='production';
const args=institutional?['scripts/build-institutional.mjs']:['node_modules/astro/bin/astro.mjs','build'];
const result=spawnSync(process.execPath,args,{stdio:'inherit',env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1',LUMENDIA_PREVIEW:mode==='preview'?'1':'0',LUMENDIA_LIBRARY:mode==='library'||mode==='dry-run'?'1':'0',LUMENDIA_DRY_RUN:mode==='dry-run'?'1':'0'}});
process.exit(result.status??1);
