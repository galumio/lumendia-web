import {defineConfig} from '@playwright/test';
const origin=process.env.LUMENDIA_POLICY_TEST_ORIGIN??'http://127.0.0.1:4494';
process.env.LUMENDIA_PRIVACY_TEST_ORIGIN=origin;
export default defineConfig({testDir:'./tests',testMatch:['publication-policy.browser.spec.ts','privacy.spec.ts','tips-public-state.spec.ts','ia-docentes.spec.ts'],workers:1,use:{baseURL:origin,headless:true,channel:process.platform==='win32'?'msedge':undefined},webServer:process.env.LUMENDIA_TEST_SERVER_EXTERNAL==='1'?undefined:{command:'node scripts/serve.mjs dist-library 4494',url:'http://127.0.0.1:4494',reuseExistingServer:false},reporter:[['list'],['json',{outputFile:'.local/policy-browser-production.json'}]]});
