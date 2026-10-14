import {preview,config} from '../lib/catalog';
export function GET(){return new Response(preview?'User-agent: *\nDisallow: /\n':`User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`,{headers:{'Content-Type':'text/plain'}})}
