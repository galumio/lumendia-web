import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:['library.spec.ts','ia-docentes.spec.ts','site.spec.ts','senior-samples.spec.ts','privacy.spec.ts','editorial-public.spec.ts'],workers:1,use:{baseURL:'http://127.0.0.1:4321',headless:true,channel:process.platform==='win32'?'msedge':undefined},webServer:process.env.LUMENDIA_TEST_SERVER_EXTERNAL==='1'?undefined:{command:'node scripts/serve.mjs '+(process.env.LUMENDIA_TEST_DIR||'dist-library'),url:'http://127.0.0.1:4321',reuseExistingServer:true},reporter:[['list'],['json',{outputFile:'.local/browser-results.json'}]]});



