import {defineConfig} from '@playwright/test';
process.env.LUMENDIA_PRIVACY_TEST_ORIGIN ??= 'http://127.0.0.1:4381';
export default defineConfig({testDir:'./tests',testMatch:['tips-public-state.spec.ts','library.spec.ts','ia-docentes.spec.ts','site.spec.ts','senior-samples.spec.ts','privacy.spec.ts','editorial-public.spec.ts','tutorials-public.spec.ts','story-withdrawal.spec.ts','habitacion-public.spec.ts'],workers:1,use:{baseURL:'http://127.0.0.1:4381',headless:true,channel:process.platform==='win32'?'msedge':undefined},webServer:process.env.LUMENDIA_TEST_SERVER_EXTERNAL==='1'?undefined:{command:'node scripts/serve.mjs '+(process.env.LUMENDIA_TEST_DIR||'dist-library')+' 4381',url:'http://127.0.0.1:4381',reuseExistingServer:false},reporter:[['list'],['json',{outputFile:'.local/browser-results.json'}]]});



