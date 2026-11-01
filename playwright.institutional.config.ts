import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'institutional.spec.ts',workers:1,webServer:{command:'node scripts/serve.mjs dist 4382',url:'http://127.0.0.1:4382',reuseExistingServer:false},timeout:90000,use:{baseURL:'http://127.0.0.1:4382',headless:true,channel:process.platform==='win32'?'msedge':undefined},reporter:[['list'],['json',{outputFile:'.local/institutional-browser-results.json'}]]});

