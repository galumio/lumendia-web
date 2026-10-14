import { defineConfig } from 'astro/config';
export default defineConfig({site:'https://lumendia.com.ar',output:'static',trailingSlash:'always',outDir:process.env.LUMENDIA_PREVIEW==='1'?'./.preview':process.env.LUMENDIA_LIBRARY==='1'?'./dist-library':'./dist'});

