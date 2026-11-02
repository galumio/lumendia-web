import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:['ia-dia-completo.spec.ts'],workers:1,use:{baseURL:process.env.LUMENDIA_IA_TEST_ORIGIN??'http://127.0.0.1:4392',headless:true,channel:'msedge'},reporter:[['list'],['json',{outputFile:'.local/ia-final-browser.json'}]]});
