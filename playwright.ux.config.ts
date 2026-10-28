import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'ux-generator.spec.ts',workers:1,outputDir:'.local/ux-test-results',use:{baseURL:'http://127.0.0.1:4373',channel:process.platform==='win32'?'msedge':undefined,headless:true},webServer:{command:'node scripts/serve.mjs dist-library 4373',url:'http://127.0.0.1:4373',reuseExistingServer:true}});
