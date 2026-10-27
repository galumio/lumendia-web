// Only this manually installed integration is authorized for publication.
export const beaconUrl = 'https://static.cloudflareinsights.com/beacon.min.js';
export function approvedAnalytics(config) {
 const a = config.analytics;
 return config.siteUrl === 'https://lumendia.com.ar' && a?.enabled === true &&
  a.provider === 'cloudflare' && a.token === '66da1e1b5fe34fc28bdfcad1629fdaa0' &&
  a.consentRequired === true && a.measurementId === null && config.ads.enabled === false;
}
export function analyticsErrors(config) {
 const errors = [];
 if (config.ads.enabled) errors.push('La publicidad debe permanecer desactivada.');
 if (config.analytics?.measurementId) errors.push('Google Analytics no está autorizado.');
 if (config.analytics?.enabled && !approvedAnalytics(config)) errors.push('Solo se autoriza Cloudflare con el dominio, token y consentimiento aprobados.');
 return errors;
}
