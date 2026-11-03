import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./tests',testMatch:'reader-restoration.spec.ts',workers:1,
 use:{baseURL:'http://127.0.0.1:4511',channel:process.platform==='win32'?'msedge':undefined,headless:true},
 webServer:{command:'node scripts/serve.mjs .preview 4511',url:'http://127.0.0.1:4511',reuseExistingServer:true},
 reporter:[['list'],['json',{outputFile:'.local/reader-restoration-results.json'}]]
});
