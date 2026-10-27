# Cloudflare Web Analytics: integración local

Revisión: 27 de octubre de 2026. Rama inicial `main`, limpia, sobre `96b866f`. Sin cambios en Galumio, DNS, proxy, GitHub Pages ni dependencias. La revisión local se completó sin publicación. El titular autorizó posteriormente commit, PR y despliegue; sus resultados se registran en GitHub y en el informe de entrega.

## Comportamiento

- Instalación manual centralizada, con el token suministrado y la URL oficial `https://static.cloudflareinsights.com/beacon.min.js`.
- Solo la biblioteca compilada para producción habilita la integración. Desarrollo, vista previa, dry-run, localhost y dominios distintos de `https://lumendia.com.ar` no cargan el beacon.
- El lector abre «Preferencias de privacidad» en el pie de página. No se interrumpe automáticamente la lectura con un modal.
- Antes de aceptar no se solicita el script ni se envían métricas. Rechazar o cerrar el diálogo no autoriza medición.
- Se usa una nueva clave local: `lumendia-cloudflare-consent-v1`. Una aceptación antigua en `lumendia-consent` no autoriza Cloudflare.
- Tras aceptar se carga un solo beacon por documento. Navegar a otra página puede cargar uno nuevo, siempre que siga vigente la aceptación.
- Si no puede guardarse la aceptación, no se carga el script y se informa el problema.
- Al retirar consentimiento se guarda el rechazo y, si el beacon ya estaba cargado, se recarga la página. Se atiende también el retiro desde otra pestaña y la restauración de páginas desde la caché de navegación.
- Quitar una etiqueta script no elimina los listeners de código que ya se ejecutó: por eso se recarga. Las mediciones enviadas no pueden retirarse; una solicitud en curso o generada al abandonar el documento podría completarse. Esto se explica en ambos idiomas.
- No hay carga de Google Analytics, anuncios ni otros servicios. Los atributos comerciales existentes no envían eventos a Cloudflare.
- El token de Web Analytics es un identificador público del beacon, no una credencial de administración.

## Archivos

Configuración y funcionamiento:

- `site.config.json`: habilitación local exclusivamente de Cloudflare, token y consentimiento obligatorio; Google Analytics sin ID y anuncios apagados.
- `src/lib/analytics-policy.mjs` (nuevo): proveedor, dominio y token autorizados; URL fija del script; comprobaciones reutilizadas por cliente y publicación.
- `src/layouts/Base.astro`: marca de habilitación según build, diálogo bilingüe y enlaces de privacidad ingleses.
- `src/scripts/integrations.ts`: consentimiento, carga única, rechazo, retiro y sincronización entre pestañas; reemplaza la integración inactiva de Google Analytics/AdSense.
- `src/scripts/site.ts`: elimina el manejador antiguo duplicado de rechazo.
- `scripts/release-library.mjs`: permite únicamente la configuración aprobada. Mantiene las comprobaciones editoriales, sanitarias, legales, recursos originales y enlaces HTTPS; sigue bloqueando publicidad y Google Analytics.

Textos y navegación:

- `src/lib/privacy.ts` (nuevo): explicaciones de Cloudflare, finalidad, conservación y retiro en español e inglés.
- `src/lib/i18n.ts`: traducción del diálogo y controles.
- `src/pages/[slug].astro`: privacidad y cookies en español.
- `src/pages/en/[policy].astro` (nuevo): `/en/privacy/` y `/en/cookies/`.
- `src/pages/sitemap.xml.ts`: incluye ambas páginas nuevas.

Pruebas:

- `tests/privacy.spec.ts` (nuevo): consentimiento ES/EN, carga única, rechazo, retiro, navegación, aceptación antigua, almacenamiento bloqueado, retiro entre pestañas, localhost y preview, accesibilidad y ancho móvil.
- `tests/analytics-policy.test.mjs` (nuevo): rechaza proveedores, tokens, dominios, IDs de Google, publicidad o ausencia de consentimiento no autorizados.
- `playwright.config.ts`: incorpora las pruebas de privacidad.
- `tests/site.spec.ts`: adapta el nombre del control de rechazo en la regresión de Alzheimer.
- Este informe.

## Validación

- `npm run check`: 51 archivos, sin errores, advertencias ni hints.
- `node --test tests/analytics-policy.test.mjs tests/commercial-links.test.mjs`: 3 pruebas aprobadas.
- `npm run build` y `npm test`: institucional, 63 comprobaciones aprobadas; continúa sin scripts externos.
- `npm run build:library`: 47 páginas; `npm run test:library`: 3742 comprobaciones, cero errores.
- `npm run build:preview`: 85 páginas, integración inhabilitada.
- Suite nueva de privacidad: 4 pruebas aprobadas, incluyendo el diálogo móvil en ambos idiomas y axe WCAG A/AA.
- Suites anteriores de biblioteca: 18 aprobadas; las 5 de Alzheimer se omiten en la salida publicable y se ejecutaron separadamente contra preview: las 5 aprobaron.
- Suite institucional de navegador: 3 aprobadas.
- Se revisaron visualmente `.local/cloudflare-consent-es.png` y `.local/cloudflare-consent-en.png` a 390 × 844.
- Auditoría del repositorio y `git diff --check` sin incidencias.
- Los libros y portadas anteriores conservan sus hashes. Las salidas institucional (8 archivos) y biblioteca (91) no contienen originales privados ni EPUB; los únicos PDF son los recursos gratuitos anteriores autorizados por hash.

Las pruebas de privacidad simulan el dominio de producción sirviendo los archivos locales y sustituyen el beacon por una respuesta controlada. No cargan el script real ni envían visitas de prueba a Cloudflare. Verifican la integración y las solicitudes de carga, no el funcionamiento interno de un script externo ni la recepción de estadísticas en el panel.

Para repetirlas, compilar primero biblioteca y preview, servir `dist-library` en el puerto 4321 y ejecutar `npx playwright test tests/privacy.spec.ts`. La preview se sirve desde sus archivos dentro de la prueba y no requiere un segundo servidor. Las suites institucionales usan su configuración existente.

## Pendiente antes de publicar

1. Revisión de los textos y aprobación de publicación: autorización recibida.
2. Commit, PR y despliegue mediante el flujo habitual, cuando se autoricen.
3. Confirmar en producción la carga única después de aceptar, el rechazo y el retiro. Verificar el dominio/token en Cloudflare y la aparición de métricas reales con consentimiento.
4. Mantener desactivada la inserción automática para evitar duplicar la instalación manual. No cambiar DNS o proxy.

Referencias: [instalación manual](https://developers.cloudflare.com/web-analytics/get-started/), [privacidad del producto](https://www.cloudflare.com/web-analytics/), [conservación y limitaciones](https://developers.cloudflare.com/web-analytics/faq/).
