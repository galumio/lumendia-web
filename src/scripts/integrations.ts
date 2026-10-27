import config from '../../site.config.json';
import {approvedAnalytics, beaconUrl} from '../lib/analytics-policy.mjs';
import {translator} from '../lib/i18n';
const key = 'lumendia-cloudflare-consent-v1';
const dialog = document.querySelector<HTMLDialogElement>('#privacy-dialog');
const enabled = document.body.dataset.measurement === 'cloudflare' &&
 location.hostname === 'lumendia.com.ar' && location.protocol === 'https:' && approvedAnalytics(config);
const read = () => { try { return localStorage.getItem(key); } catch { return null; } };
const write = (value:string) => { try { localStorage.setItem(key,value); return true; } catch { return false; } };
const t = translator(document.documentElement.lang === 'en' ? 'en' : 'es');
function renderChoice() {
 const choice = read();
 const state = document.querySelector('#consent-state');
 if (state) state.textContent = t(choice === 'accepted' ? 'Medición aceptada' : choice === 'rejected' ? 'Medición rechazada' : 'Sin elección');
 const rejectButton = document.querySelector('#consent-reject');
 if (rejectButton) rejectButton.textContent = t(choice === 'accepted' ? 'Retirar consentimiento' : 'Rechazar medición');
}
for (const trigger of document.querySelectorAll('[data-privacy-open]')) trigger.addEventListener('click', renderChoice);
renderChoice();
let started = false;
function start() {
 if (!enabled || started || read() !== 'accepted') return;
 started = true;
 if (document.querySelector('script[data-cf-beacon]')) return;
 const script = document.createElement('script');
 script.src = beaconUrl;
 script.defer = true;
 script.dataset.cfBeacon = JSON.stringify({token:config.analytics.token});
 document.body.append(script);
}
const accept = document.querySelector<HTMLButtonElement>('#consent-accept');
if (accept) accept.hidden = !enabled;
document.querySelector('#consent-description')?.toggleAttribute('hidden', !enabled);
accept?.addEventListener('click', () => {
 if (!enabled) return;
 if (!write('accepted')) {
  const status = document.querySelector('#consent-status');
  if (status) status.textContent = document.documentElement.lang === 'en' ?
   'Your choice could not be saved. Analytics remains off.' : 'No se pudo guardar tu elección. La medición sigue desactivada.';
  return;
 }
 renderChoice(); dialog?.close(); start();
});
function reject() {
 const saved = write('rejected');
 if (!saved) { try { localStorage.removeItem(key); } catch {} }
 renderChoice(); dialog?.close();
 // Removing a script element does not undo its listeners. Reload without consent.
 if (started) location.reload();
}
document.querySelector('#consent-reject')?.addEventListener('click', reject);
window.addEventListener('storage', event => {
 if (event.key !== key && event.key !== null) return;
 renderChoice();
 if (read() !== 'accepted' && started) location.reload();
});
window.addEventListener('pageshow', () => {
 renderChoice();
 if (started && read() !== 'accepted') location.reload(); else start();
});
start();
