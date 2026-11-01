import {defineConfig} from '@playwright/test';
const rehearsal=process.env.TIPS_PUBLIC_OUTPUT==='1';
const port=rehearsal?4384:4383;
export default defineConfig({reporter:[['list'],['json',{outputFile:'.local/tips-browser-results.json'}]],testDir:'./tests',testMatch:'tips-preview.spec.ts',workers:1,outputDir:'.local/tips-launch-browser-results',use:{baseURL:`http://127.0.0.1:${port}`,headless:true,channel:'msedge'},webServer:process.env.LUMENDIA_TEST_SERVER_EXTERNAL==='1'?undefined:{command:`node scripts/serve.mjs ${rehearsal?'dist-library':'.preview'} ${port}`,url:`http://127.0.0.1:${port}`,reuseExistingServer:false}});
