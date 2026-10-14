import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'institutional.spec.ts',workers:1,timeout:90000,use:{baseURL:'http://127.0.0.1:4322',headless:true,channel:process.platform==='win32'?'msedge':undefined},reporter:[['list'],['json',{outputFile:'.local/institutional-browser-results.json'}]]});

