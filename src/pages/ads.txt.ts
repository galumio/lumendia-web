import {config} from '../lib/catalog';
export function GET(){return new Response(config.ads.enabled&&config.ads.adsTxt?config.ads.adsTxt:'',{headers:{'Content-Type':'text/plain'}})}
