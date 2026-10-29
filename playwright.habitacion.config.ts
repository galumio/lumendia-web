import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'habitacion-preview.spec.ts',workers:1,use:{baseURL:'http://127.0.0.1:4351',headless:true,channel:process.platform==='win32'?'msedge':undefined},reporter:'list',outputDir:'.local/habitacion-results'});
