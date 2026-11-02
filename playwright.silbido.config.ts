import {defineConfig} from '@playwright/test';
const publicOutput=process.env.SILBIDO_PUBLIC_OUTPUT==='1';
const port=publicOutput?4404:4403;
export default defineConfig({testDir:'./tests',testMatch:'silbido-preview.spec.ts',workers:1,timeout:180000,outputDir:'.local/silbido-launch-browser-output',use:{baseURL:`http://127.0.0.1:${port}`,headless:true,channel:'msedge'},webServer:{command:`node scripts/serve.mjs ${publicOutput?'dist-library':'.preview'} ${port}`,url:`http://127.0.0.1:${port}`,reuseExistingServer:!publicOutput},reporter:[['list'],['json',{outputFile:`.local/silbido/browser-${publicOutput?'public':'preview'}-results.json`}]]});
