import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'stories-preview.spec.ts',workers:1,use:{baseURL:'http://127.0.0.1:4325',headless:true,channel:process.platform==='win32'?'msedge':undefined},webServer:{command:'node scripts/serve.mjs .preview 4325',url:'http://127.0.0.1:4325',reuseExistingServer:true},reporter:'list'});
