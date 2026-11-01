// Local metadata preparation only. Never uploads, schedules or deploys.
import './verify-tips.mjs';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const args=process.argv.slice(2);
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const manifest=JSON.parse(readFileSync('src/content/tips-approved.json','utf8'));
const files=manifest.map(m=>`src/content/editorial/${m.slug}.json`);
const original=files.map(file=>readFileSync(file,'utf8'));
const entries=original.map(s=>JSON.parse(s));
if(args.length===1&&args[0]==='--check'){
 console.log(JSON.stringify({mode:'read-only',todayInArgentina:today,dates:entries.map(e=>({slug:e.slug,publishedAt:e.publishedAt})),notice:'No date assigned. Explicit publication authorization required.'},null,2));
}else if(args.length===2&&args[0]==='--authorized-publication-today'&&args[1]===today){
 if(entries.some(e=>e.publishedAt!==null))throw Error('Existing publication date: stop and review; nothing overwritten.');
 const backup=`.local/tips-date-backup-${Date.now()}`;mkdirSync(backup,{recursive:true});
 original.forEach((bytes,i)=>writeFileSync(`${backup}/${entries[i].slug}.json`,bytes));
 try{files.forEach((file,i)=>writeFileSync(file,JSON.stringify({...entries[i],publishedAt:today},null,2)+'\n'));}
 catch(error){files.forEach((file,i)=>writeFileSync(file,original[i]));throw error;}
 console.log(`Local dates set to ${today}. Backup: ${backup}. NOT published; validate and deploy only with authorization. If cancelled, restore this backup before any later deployment.`);
}else{
 console.error('Use --check; only after explicit authorization on launch day: --authorized-publication-today YYYY-MM-DD (must equal today in Argentina).');process.exitCode=1;
}
