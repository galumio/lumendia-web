# Incorporación de muestras de IA para adultos mayores

Fecha: 22 de octubre de 2026. Rama: `biblioteca`.

La incorporación está preparada localmente. No se ejecutaron commit, push, publicación ni cambios en Galumio. El repositorio estaba limpio al comenzar esta continuación. Los originales y el contenido de los libros anteriores se conservaron.

## Lecturas incorporadas

| Edición | Ruta de la ficha | Muestra | Compra |
| --- | --- | --- | --- |
| Español | `/libros/ia-cotidiana-para-adultos-mayores/` | 365 palabras, aproximadamente 5,5 % del texto extraído | `https://payhip.com/b/CHPS9`, USD 4,99 |
| Inglés | `/libros/everyday-ai-for-seniors/` | 394 palabras, aproximadamente 5,7 % del texto extraído | `https://payhip.com/b/Y9fCO`, USD 4.99 |

Cada edición tiene dos secciones: introducción y ejemplos prácticos. Se conservaron fragmentos reales sobre la primera conversación con la IA, un menú con lista de compras y mensajes familiares. No se inventaron capítulos, ejemplos ni respuestas de la IA. Los encabezados que agrupan la muestra y los avisos de compra son interfaz editorial, no se presentan como capítulos originales.

La selección usa estas páginas físicas del PDF, distintas de la numeración impresa:

- Español: introducción en páginas 5–8; primera conversación en 18–19; menú en 43; mensajes familiares en 44–45.
- Inglés: introducción en páginas 5–8; primera conversación en 19; menú en 44; mensajes familiares en 45–46.

Los manifiestos identifican cada fragmento mediante sus límites textuales y páginas de origen. La extracción solo normaliza espacios y saltos de línea, retira la numeración de pie de página y convierte las listas a HTML. El comando `python scripts/import_senior_samples.py --check` reconstruye la selección desde los PDF y exige igualdad con los JSON de las muestras, sin escribirlos.

Los originales completos tienen 84 y 86 páginas, respectivamente. Se mantienen exclusivamente en `.local/originals/`. No se agregaron recursos descargables, PDF ni EPUB comerciales a `public/` o a la compilación.

## Diseño, idioma y compra

Se reutilizan las fichas, tarjetas, lector, navegación, preferencias y estilos actuales. Las portadas originales se optimizaron como JPEG progresivos, sin recortes ni cambios de diseño: 850 × 1360 píxeles; 88.866 bytes en español y 87.628 bytes en inglés.

El idioma por defecto sigue siendo español. La edición inglesa usa `lang="en"`, metadatos de idioma, navegación, controles del lector, textos de privacidad y compra en inglés. Los enlaces generales mantienen los destinos existentes del sitio. El catálogo identifica el idioma de cada muestra y suma la categoría «Tecnología cotidiana».

Los botones de compra muestran el precio y aparecen en la ficha y en ambas secciones de lectura. La excepción del validador comercial admite únicamente cada URL exacta de Payhip dentro de las rutas del libro correspondiente. Rechaza otras tiendas antes prohibidas, el enlace cruzado de la otra edición, HTTP, subdominios, dominios falsos, credenciales en la URL, parámetros, fragmentos, caracteres de control y entidades HTML que oculten el destino. Se conservan las comprobaciones previas de rutas, sitemap, descargas, contenido y productos anteriores.

`site.config.json` no se modificó: publicidad y analítica permanecen desactivadas. El estado editorial de Alzheimer tampoco se modificó; sigue excluido de producción y disponible en la vista local de revisión.

## Archivos

Archivos existentes modificados:

- `src/lib/catalog.ts`: idioma opcional, marca de muestra y categoría.
- `src/layouts/Base.astro`: idioma y textos compartidos localizados.
- `src/components/BookCard.astro`: idioma visible y denominación de muestra.
- `src/components/Premium.astro`: textos localizados y compra directa de las muestras.
- `src/pages/libros/[book]/index.astro`: ficha e idioma de cada edición.
- `src/pages/libros/[book]/[page].astro`: lector localizado y compra de la muestra.
- `src/scripts/site.ts`: tema y continuación en el idioma de la página.
- `src/scripts/reader.ts`: mensajes de compartir en el idioma de la página.
- `scripts/validate.mjs`: excepción comercial acotada y controles de muestras y duplicados.
- `playwright.config.ts`: incluye la nueva suite de muestras.

Archivos nuevos:

- `src/lib/i18n.ts`.
- `scripts/commercial-links.mjs`.
- `scripts/import_senior_samples.py`.
- `scripts/books/ia-cotidiana-para-adultos-mayores-sample.json`.
- `scripts/books/everyday-ai-for-seniors-sample.json`.
- `public/images/ia-cotidiana-para-adultos-mayores-portada.jpg`.
- `public/images/everyday-ai-for-seniors-portada.jpg`.
- `tests/commercial-links.test.mjs`.
- `tests/senior-samples.spec.ts`.
- Este informe.

Contenido generado local, ignorado por Git según la arquitectura existente:

- `src/content/books/ia-cotidiana-para-adultos-mayores.json`.
- `src/content/books/everyday-ai-for-seniors.json`.
- `.local/*-provenance.json`: texto de cada fragmento, páginas de origen y hashes.
- `.local/*-390.png`: capturas de las fichas y lecturas nuevas en móvil.
- `dist/`, `dist-library/` y `.preview/`: compilaciones; `.preview/` no debe publicarse.

## Validación

| Comprobación | Resultado |
| --- | --- |
| `npm.cmd run check` | Sin errores, advertencias ni sugerencias |
| `python scripts/import_senior_samples.py --check` | Ambas muestras coinciden con la selección de los originales |
| `node --test tests/commercial-links.test.mjs` | Aprobado, incluidos destinos falsos y variantes no autorizadas |
| `npm.cmd run build` | Presentación institucional compilada; 63 comprobaciones aprobadas |
| `npm.cmd test` | 63 comprobaciones institucionales aprobadas |
| `npm.cmd run build:library` | 39 páginas generadas |
| `npm.cmd run test:library` | 3.220 comprobaciones, cero errores |
| Navegador institucional | 3 pruebas aprobadas |
| Navegador biblioteca | 16 pruebas aprobadas; 5 de Alzheimer omitidas en producción |
| Alzheimer en `.preview/` | Las 5 pruebas omitidas en producción pasaron en la vista local |
| Auditoría del repositorio | Sin archivos comerciales, claves ni tokens detectados por los controles existentes |

Las pruebas de las muestras recorren ficha e introducción/ejemplos a 320, 390, 768 y 1440 píxeles; comprueban desbordamientos, accesibilidad automatizada WCAG A/AA, navegación anterior/siguiente, tamaño de letra, tema oscuro, metadatos, idioma, botones de compra, catálogo sin duplicados y ausencia de rastreadores y descargas comerciales. Las capturas móviles se revisaron visualmente. Las suites anteriores verificaron IA para docentes y Cómo estudiar para un final sin fallos.

Los enlaces de compra coinciden exactamente con los proporcionados y están validados en el HTML. La disponibilidad y el precio efectivos en Payhip no pudieron verificarse desde este entorno: la herramienta web no accedió a las páginas y la conexión directa devolvió una restricción de red. No se realizó ninguna compra.

## Pendiente

El 22 de octubre de 2026 el usuario autorizó expresamente el commit, el flujo de GitHub y el despliegue de ambas muestras. La publicación debe detenerse ante conflictos, material privado expuesto o pruebas fallidas. La comprobación final del despliegue y las URL públicas se informa al finalizar la operación.

Para reproducir las pruebas de navegador sin que Playwright tenga que cerrar un servidor propio en Windows, iniciar `node scripts/serve.mjs dist-library 4321` y ejecutar con `LUMENDIA_TEST_SERVER_EXTERNAL=1`. El sitio institucional usa el puerto 4322. Las pruebas de Alzheimer se ejecutan únicamente sobre `.preview/` con `npx.cmd playwright test tests/site.spec.ts --reporter=list`.
