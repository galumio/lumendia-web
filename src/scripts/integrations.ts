import config from '../../site.config.json';
type IntegrationWindow=Window&{dataLayer?:unknown[];gtag?:(...args:unknown[])=>void;adsbygoogle?:unknown[]};
const w=window as IntegrationWindow;
const measurement=String(config.analytics.measurementId||'');const client=String(config.ads.client||'');
const analytics=Boolean(config.analytics.enabled&&/^G-[A-Z0-9]+$/.test(measurement));
const ads=Boolean(config.ads.enabled&&/^ca-pub-\d+$/.test(client)&&document.querySelector('[data-ad-placeholder]'));
let started=false;
const read=()=>{try{return localStorage.getItem('lumendia-consent')}catch{return null}};
const write=(v:string)=>{try{localStorage.setItem('lumendia-consent',v)}catch{}};
function script(src:string){const s=document.createElement('script');s.src=src;s.async=true;document.head.append(s)}
function start(){if(started||read()!=='accepted')return;started=true;if(analytics){w.dataLayer=w.dataLayer||[];w.gtag=function(){w.dataLayer!.push(arguments)};w.gtag('js',new Date());w.gtag('config',measurement,{send_page_view:true});script('https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(measurement));if(document.querySelector('[data-reader]'))w.gtag('event','chapter_view',{page_path:location.pathname})}if(ads){for(const placeholder of document.querySelectorAll<HTMLElement>('[data-ad-placeholder]')){const parent=placeholder.closest<HTMLElement>('[data-ad-client]')!;const ins=document.createElement('ins');ins.className='adsbygoogle';ins.style.display='block';ins.dataset.adClient=client;ins.dataset.adSlot=parent.dataset.adSlot;ins.dataset.adFormat='auto';ins.dataset.fullWidthResponsive='true';placeholder.append(ins);(w.adsbygoogle=w.adsbygoogle||[]).push({})}script('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+encodeURIComponent(client))}}
if(analytics||ads){const dialog=document.querySelector<HTMLDialogElement>('#privacy-dialog');const accept=document.querySelector<HTMLButtonElement>('#consent-accept');if(accept)accept.hidden=false;document.querySelector('#consent-description')?.removeAttribute('hidden');accept?.addEventListener('click',()=>{write('accepted');dialog?.close();start()});document.querySelector('#consent-reject')?.addEventListener('click',()=>{write('rejected');location.reload()});if(read()==='accepted')start();else if(!read())dialog?.showModal()}
document.addEventListener('click',event=>{const target=(event.target as Element)?.closest<HTMLElement>('[data-event]');if(target&&analytics&&read()==='accepted')w.gtag?.('event',target.dataset.event,{link_url:target.getAttribute('href')})});
