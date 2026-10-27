import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {analyticsErrors} from '../src/lib/analytics-policy.mjs';
const config=JSON.parse(readFileSync('site.config.json'));
test('Only approved consent-based Cloudflare configuration may launch',()=>{
 assert.deepEqual(analyticsErrors(config),[]);
 for(const patch of [{provider:'google'},{token:'unapproved'},{consentRequired:false},{measurementId:'G-ABC'}])assert(analyticsErrors({...config,analytics:{...config.analytics,...patch}}).length);
 assert(analyticsErrors({...config,ads:{...config.ads,enabled:true}}).length);
 assert(analyticsErrors({...config,siteUrl:'https://other.example'}).length);
});
