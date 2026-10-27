# Primera guía de IA: preparación y publicación autorizada

## Candidato de publicación autorizado

Fecha registrada para esta publicación: **2026-10-27**, día local de Argentina de la ejecución autorizada. Se comprobará que coincide con la fecha de finalización de GitHub Pages; si cambia antes del merge, la integración se detiene. Los estados de preparación anteriores se conservan abajo como historial.

La guía aprobada de 2.716 palabras entra ahora en la biblioteca, `/guias/` y `/guias/empezar-con-la-ia-cinco-tareas-sencillas/`. El sitemap incluye ambas rutas; el schema Article identifica a Lumendia · Galumio Studio como Organization y declara acceso gratuito. La compilación publicable pasa a 49 páginas. Los seis enlaces oficiales respondieron HTTP 200; Gemini requirió otro cliente HTTP por superar el límite de cabeceras de Node, sin que el enlace estuviera roto.

Se conserva el SHA-256 del Markdown aprobado y los 36 hashes anteriores de artículos, portadas y recursos. Los PDF disponibles siguen siendo exclusivamente los recursos gratuitos autorizados. La auditoría estática de biblioteca y preview pasa 8.916 comprobaciones sin errores. Se añade al CI la ejecución de las pruebas unitarias, sin modificar el flujo de despliegue mediante artefacto local privado.

Las nuevas pruebas públicas verifican catálogo, canonical, sitemap, schema, fecha, fuentes, enlaces relacionados, cinco copias exactas, teclado, móvil y axe, además de rechazar las URL de originales y respaldos. Los controles de privacidad y seguridad existentes se conservan. Validación local final: 14 pruebas unitarias y 36 de navegador aprobadas; las cinco sanitarias omitidas en producción se ejecutaron en preview. Tres compilaciones correctas, 8.916 comprobaciones estáticas sin errores y auditoría npm con cero vulnerabilidades. Los resultados definitivos de PR, merge, Pages y producción se entregan al finalizar la operación.

## Estado actual: SEO corregido y original aprobado preparado

Esta sección reemplaza el estado de los informes anteriores, que se conservan debajo como historial. No se hizo commit, push, PR ni despliegue.

La generación de metadatos de capítulos usa `src/lib/chapter-seo.mjs`: cuenta coincidencias en el catálogo completo, incluido el contenido pendiente, y añade el nombre editorial del libro solo si el título de capítulo se repite. Así no depende de la modalidad de compilación y no cambia los títulos de otros capítulos. Los resultados son:

- `Antes de empezar | Cuidar a mamá o papá con Alzheimer o demencia | Lumendia`.
- `Antes de empezar | IA cotidiana para adultos mayores | Lumendia`.

Se usan los nombres reales del catálogo. Solo cambian el título SEO y su equivalente Open Graph; H1, contenido, schema del capítulo y URL permanecen intactos. Comparación de 106 cuerpos HTML de páginas de libros entre biblioteca y vista previa: idénticos. Tres cambios de título en los artefactos: las dos páginas de preview y la de adultos mayores en biblioteca (el libro sanitario continúa excluido de producción). Las otras páginas de libros no cambian. Se conservaron también los 36 hashes de artículos, portadas y recursos.

El Markdown aprobado y sus metadatos están ahora en `src/content/editorial/empezar-con-la-ia-cinco-tareas-sencillas.md` y `.json`. El texto conserva 2.716 palabras y su SHA-256 aprobado `9e57475863069613dae6ced43b8757dbe677c3a11a62bcc26853d64a37b15b63`. Estado editorial `approved`, atribución `Lumendia · Galumio Studio` como organización, seis referencias oficiales sin cambios de URL. Son archivos versionables, todavía sin commit.

Los respaldos quedan en `.local/editorial/backups/`: la versión anterior de 2.728 palabras y una copia de la aprobada en `aprobada-2716/`. No se incluyen en ningún artefacto público. Ya no existe un registro activo duplicado en `.local/editorial/`.

Se mantiene `publishedAt: null` hasta registrar la fecha real de publicación. La guía está disponible en la vista previa de revisión, con aviso de publicación pendiente y `noindex`; todavía no genera URL, índice o entrada de sitemap en la compilación publicable. El cargador diferencia aprobación de publicación y permite revisar aprobados sin fecha solo en preview. El schema local no inventa `datePublished`. Al completar la fecha real tras autorización, las rutas y sitemap se generan mediante el mismo contrato; se deberá validar nuevamente ese artefacto antes de publicar.

La lectura muestra «Lectura completa gratuita», la atribución aprobada y cinco botones «Copiar pedido». El texto se copia exclusivamente al pulsar el botón; se anuncia el resultado y, si el navegador no permite copiar, se ofrece hacerlo manualmente. Los botones mejoran la lectura con JavaScript; el texto completo sigue disponible sin JavaScript ni registro. No envían eventos de analítica. Se enlazan tres libros y dos PDF gratuitos existentes del catálogo: la hoja de referencia de IA para docentes y el plan de siete días antes del final. No se admiten archivos privados ni PDF arbitrarios como relaciones.

Validación estática actual: 14 pruebas unitarias aprobadas; Astro sin errores ni advertencias; compilación institucional con 63 comprobaciones aprobadas; biblioteca y preview compilan 47 y 87 páginas. Validación conjunta biblioteca/preview: **8.777 comprobaciones, 0 errores**, incluido el control de títulos únicos que antes fallaba. Auditoría npm: 0 vulnerabilidades; auditoría de repositorio: 156 archivos candidatos sin hallazgos. Las comprobaciones de red y navegador se registran al terminar la ejecución local.

La ejecución separada final de `.preview` pasa **5.465 comprobaciones, 0 errores**. Las cuatro pruebas del lector editorial pasan: lectura, móvil (1440/390/320 px), teclado, axe, enlaces, ausencia de medición en preview, exclusión de originales privados, copia de los cinco pedidos y lectura sin JavaScript. En la prueba de copia se intercepta la API del portapapeles para verificar el texto exacto y simular permiso denegado sin sobrescribir el portapapeles personal. Captura móvil del botón inspeccionada. No se prueba ni se afirma un despliegue público.

Resultado final de navegadores: **35 pruebas aprobadas** (23 biblioteca/privacidad, 5 sanitarias en preview, 3 institucionales, 4 editoriales). Las 5 sanitarias se omiten correctamente en la suite de producción y se ejecutan aparte en preview. No hay fallos pendientes. `git diff --check` pasa; no se alteraron dependencias, configuración de servicios ni scripts de publicación.

Archivos específicos añadidos en esta preparación: `src/lib/chapter-seo.mjs`, `tests/chapter-seo.test.mjs`, `src/content/editorial/empezar-con-la-ia-cinco-tareas-sencillas.md`, su JSON, `src/scripts/editorial-reader.ts` y `tests/approved-guide.test.mjs`. Se ajustaron la plantilla de capítulos (solo generación de título), cargador/catálogo/lector editorial, sus pruebas y documentación. Los cambios locales anteriores continúan conservados.

Pendiente para publicar: autorización final, registrar la fecha real, repetir validación de la salida que incluya la guía, revisión del diff y flujo GitHub/Pages. La configuración de consentimiento, Cloudflare, Google Analytics desactivado y publicidad desactivada permanece intacta.

## Revisión editorial final para aprobación

La versión actual tiene **2.716 palabras**, conserva las cinco tareas y sus cinco ejercicios, y continúa como borrador privado. La descripción y resultados de la primera entrega que siguen más abajo se conservan como antecedente (2.728 palabras).

Cambios de esta revisión:

- Apertura con un beneficio concreto: preparar un mensaje para avisar una ausencia.
- Menos reiteraciones sobre revisión, acceso y privacidad; se mantienen las precauciones sobre datos sensibles, ventanas privadas, acciones no realizadas, fuentes, decisiones importantes y estafas con voces clonadas.
- Tarea 4 adaptada a compras: ordenar arroz/manzanas/pan/peras y filtrar por verdulería. El ejercicio agrega zanahorias. Se comprueba que ordenar conserva todos los productos y filtrar muestra los que cumplen la condición sin borrar la lista original.
- Cinco bloques de «Pedido para copiar», «Respuesta(s) de referencia», «Qué comprobar», «Pedido para ajustar la respuesta» y «Ejercicio», con encabezados H3. Los pedidos conservan su recuadro; las referencias usan párrafos o listas. La distinción no depende solo del color y utiliza el renderer existente.
- El resumen del aviso ahora tiene tres puntos, como solicita el pedido; las cantidades y preguntas de referencia se presentan en listas fáciles de comparar.
- Atribución propuesta: **Lumendia · Galumio Studio**, declarada como organización. El lector señala que es una propuesta; no se aprueba automáticamente el texto ni se inventan fechas. El contrato valida el tipo de autor y el schema futuro no lo convierte en una persona.

Respaldo íntegro previo: `.local/editorial/backups/antes-revision-final-2026-10-27/`, con Markdown y JSON originales. SHA-256 del Markdown original: `cd7d30e5f5bd3f2022ecf80f1a1ca7683ba2b1e453d4a747501ec3e89041e90b`. El cargador no recorre esa subcarpeta y ningún respaldo se copia a la salida.

Se volvieron a consultar los seis enlaces de los metadatos: [funcionamiento de Gemini](https://gemini.google/gp/overview/?hl=en), [requisitos de acceso](https://support.google.com/gemini/answer/13278668?hl=es), [sitio oficial](https://gemini.google.com/), [privacidad](https://support.google.com/gemini/answer/13594961?hl=es), [límites de las respuestas](https://support.google.com/gemini/answer/16279220?hl=es) y [alerta de la FTC sobre voces clonadas](https://consumer.ftc.gov/consumer-alerts/2023/03/scammers-use-ai-enhance-their-family-emergency-schemes). No faltan referencias entre las mencionadas; los dos documentos en inglés están identificados como tales. La página local muestra los enlaces desde los metadatos. Esto verifica documentación, no funciones de una cuenta; la guía mantiene esa aclaración.

Archivos ajustados en esta revisión sobre el trabajo local anterior: el par privado Markdown/JSON; `src/lib/editorial-content.mjs`, `src/lib/editorial-catalog.ts` y `src/pages/[section]/[slug].astro` para la atribución institucional; `tests/editorial-content.test.mjs` y `tests/editorial-preview.spec.ts`; `src/content/editorial/README.md` y este informe. Se conservan todos los demás cambios de la entrega anterior. No se modifican los libros, sus recursos, el consentimiento ni los servicios externos.

Validación de la versión revisada: 11 pruebas unitarias aprobadas; chequeo Astro sin errores ni advertencias; compilaciones institucional (8 archivos), biblioteca (47 páginas) y vista previa (87 páginas) completas. La salida institucional pasa 63 comprobaciones y la biblioteca 3.814. Las dos pruebas editoriales pasan en escritorio y anchos de 390/320 px: estructura de las cinco tareas, atribución propuesta, ausencia de fechas, enlaces de las seis fuentes, teclado, axe, privacidad y exclusión de borradores/respaldo de la salida pública. Capturas móviles inspeccionadas. Auditoría npm: 0 vulnerabilidades; repositorio: 150 archivos candidatos sin hallazgos. Las 36 comparaciones de contenido anterior siguen sin diferencias.

El validador de `.preview` sigue informando el mismo título duplicado de dos libros anteriores (1 error en 5.463 comprobaciones). No se corrige ni se omite ese control. No afecta a la guía ni aparece en la salida de producción. No se publica esta revisión: queda pendiente de aprobación editorial final.

Navegadores, ejecución final: biblioteca 23 pruebas aprobadas (incluidas privacidad ES/EN, aceptación, rechazo, retirada y carga única); 5 pruebas sanitarias omitidas en producción y aprobadas al ejecutarlas en vista previa; institucional 3 aprobadas; editorial 2 aprobadas. Total: 33 pruebas de navegador aprobadas. Sin commit, push ni despliegue.

## Contenido y situación editorial

Título: «Empezar con la IA: cinco tareas sencillas y cómo revisar las respuestas».

El borrador completo y sus metadatos están en `.local/editorial/empezar-con-la-ia-cinco-tareas-sencillas.md` y `.json`. Son privados, ignorados por Git. Extensión: 2.728 palabras del cuerpo, incluidos encabezados y pedidos; no incluye metadatos, índice generado ni fuentes del pie. El conteo separa por espacios después de retirar marcadores Markdown.

Cinco tareas autónomas: preparar un mensaje; resumir un aviso; ordenar materiales y cantidades; comprender ordenar/filtrar; practicar preguntas sobre un texto. Cada una incluye el pedido completo, referencias para comprobar la respuesta y un ejercicio con criterio de logro. También se cubren inicio, corrección de respuestas, verificación externa, errores, privacidad, estafas y límites.

Texto original preparado para esta solicitud con asistencia de IA. No se importó ni extrajo texto de ebooks comerciales. La autoría pública, aprobación y fechas permanecen pendientes; no se atribuye automáticamente a Lumendia ni a una persona. No se publica schema de artículo para el borrador.

## Revisión de contenido

Revisión local realizada el 27 de octubre de 2026; esta fecha documenta el trabajo técnico/editorial y no es una fecha de publicación del artículo.

- Los ejercicios contienen todos sus datos; no requieren documentos, suscripciones, compras ni subir archivos.
- Cuentas verificadas: 4×2−5=3 hojas, 4−3=1 lápiz; variante 6×2−5=7 hojas, 6−3=3 lápices.
- Resumen contrastado con el aviso: horario, lugar, cupo, inscripción, materiales, suspensión y precio desconocido. No transforma ausencia de precio en gratuidad.
- Orden y filtro comprobados con las dos listas; se distingue filtrar una vista de eliminar originales.
- Preguntas de práctica limitadas al texto ficticio: hasta dos libros, diez días, consulta previa y excepción de reservas.
- Los resultados de referencia son ejemplos editoriales, no salidas atribuidas a una aplicación. No se ejecutaron los pedidos en una cuenta de un proveedor ni se verificaron sus pantallas. No se garantiza una respuesta idéntica.
- Se consultó documentación oficial de Google sobre acceso, privacidad, funcionamiento y respuestas de Gemini, y de la FTC sobre voces clonadas. Los enlaces exactos están en los metadatos y se muestran en la lectura. Las condiciones de acceso pueden cambiar; no se afirman ubicaciones de botones ni disponibilidad universal.
- Continuidad revisada: introducción, preparación, cinco tareas, mejora, comprobación, seguridad y práctica final. Sin remisiones a capítulos o materiales ausentes.

## Arquitectura y límites

`editorial-catalog.ts` es un adaptador de compilación separado de `catalog.ts` y de los JSON privados de libros. El cargador utiliza únicamente pares de metadatos/texto validados. Rechaza cuerpos vacíos, ubicaciones enlazadas, archivos demasiado grandes, duplicados y relaciones inexistentes. El renderer admite un subconjunto explícito de Markdown y escapa el texto; no ejecuta HTML ni MDX.

Las rutas `[section]/index.astro` y `[section]/[slug].astro` solo se generan a partir de entradas elegibles. La colección se enlaza desde portada y biblioteca cuando tiene contenido. El lector incluye índice por secciones, idioma, descripción específica, canonical, fuentes y lecturas relacionadas. El sitemap incorpora únicamente entradas e índices públicos. No hay hreflang inventados. La imagen social usa por ahora el favicon institucional, sin reutilizar una portada comercial; una imagen social específica queda pendiente de diseño.

En producción se leen solo originales aprobados en `src/content/editorial/`, que puede versionarse y recuperarse con Git. La aprobación de una obra requiere mover el par de archivos revisados allí, confirmar atribución/derechos y completar las fechas reales. En esta entrega no se realiza ese movimiento: el borrador aún no está aprobado ni respaldado por Git.

La vista previa permite revisar el borrador con `npm run build:preview` y `node scripts/serve.mjs .preview 4323`, en `/guias/empezar-con-la-ia-cinco-tareas-sencillas/`. Está limitada a localhost por el servidor existente, lleva `noindex` y no activa medición. No se debe subir `.preview` a ningún alojamiento. `build:library` no lee `.local/editorial`, y sigue sin generar `/guias/` mientras no haya originales aprobados.

No se modifican dependencias, JSON de libros, recursos, consentimiento, proveedor de analítica, publicidad, reglas de exclusión ni scripts de despliegue. El aviso general de vista previa pasa de «contenido sanitario» a «contenido pendiente de aprobación» en español e inglés, para no presentar esta guía como sanitaria. El buscador existente sigue buscando libros; la colección editorial tiene acceso separado. Búsqueda editorial, filtros y temas requieren otra etapa. El primer lector se revisa en español; antes de añadir una obra inglesa deben localizarse todos sus textos de interfaz y probarse con ese contenido.

## Verificación y pendientes

Pruebas nuevas: aislamiento de borradores, selección por estado/fecha, relaciones, formato seguro, lectura móvil/teclado, accesibilidad y privacidad en vista previa. `node --test tests/*.test.mjs`; navegador editorial: `npx playwright test --config=playwright.editorial.config.ts` después de compilar biblioteca y vista previa. El caso del borrador se omite si sus archivos privados no están presentes en otro equipo; las pruebas del cargador usan fixtures temporales independientes.

Hallazgo previo ajeno a la guía: el validador de `.preview` informa un título duplicado «Antes de empezar | Lumendia» entre `cuidar-a-mama-o-papa` e `ia-cotidiana-para-adultos-mayores`. Ambas páginas y su plantilla pertenecen al contenido anterior. El libro sanitario no aprobado queda fuera de producción, donde la validación pasa. No se cambia su texto ni se debilita el validador; requiere revisión separada.

Antes de publicar: aprobar la guía, resolver atribución y derechos, asignar fechas reales y revisar el artefacto ya con la entrada aprobada. No se hizo commit, push, PR ni despliegue.

## Resultados de esta entrega

| Control | Resultado |
|---|---|
| Git inicial | `main`, limpio, PR #5 integrado en `c49b740` |
| `npm run check` | 0 errores, 0 advertencias |
| `node --test tests/*.test.mjs` | 10 pruebas aprobadas |
| Compilación institucional y `npm test` | 8 archivos; 63 comprobaciones aprobadas |
| Compilación biblioteca y validador | 47 páginas; 3.814 comprobaciones, 0 errores |
| Compilación de revisión | 87 páginas; incluye la guía y su índice solamente en la vista privada |
| Validador estático `.preview` | 5.463 comprobaciones; 1 error previo por el título duplicado descrito arriba |
| Navegador biblioteca | 23 aprobadas; 5 sanitarias omitidas por ausencia de ese libro en producción |
| Navegador sanitario en vista previa | Las 5 pruebas aprobadas |
| Navegador institucional | 3 pruebas aprobadas |
| Navegador editorial | 2 pruebas aprobadas: escritorio, 390/320 px, teclado, axe, ausencia de medición y exclusión de borrador de salidas públicas |
| `npm audit --audit-level=moderate` | 0 vulnerabilidades |
| Auditoría de repositorio | 150 archivos candidatos, sin hallazgos según patrones existentes |
| Conservación de contenido | 36 comparaciones SHA-256 de artículos, portadas y recursos: 0 diferencias frente a la referencia anterior |
| Revisión visual | Capturas móviles de cabecera y cuerpo inspeccionadas; sin desbordamientos |
| `git diff --check` | Sin errores |

La suite de privacidad verifica aceptación, rechazo, cierre, retirada y carga única del beacon en ES/EN mediante el entorno local de pruebas. No se cambia la configuración de producción. La prueba editorial confirma cero solicitudes externas en la vista previa, incluso tras interactuar con privacidad. Los PDF gratuitos autorizados anteriores permanecen; no se incorpora ningún PDF, EPUB o descarga de manuscrito nuevo.

## Archivos de trabajo

17 archivos versionables nuevos o modificados, todavía sin commit:

- Contrato y adaptador: `src/lib/editorial-content.mjs`, `src/lib/editorial-loader.mjs`, `src/lib/editorial-catalog.ts`.
- Presentación y rutas: `src/components/EditorialCollection.astro`, `src/pages/[section]/index.astro`, `src/pages/[section]/[slug].astro`, `src/pages/index.astro`, `src/pages/biblioteca.astro`, `src/pages/sitemap.xml.ts`.
- Aviso de revisión local: `src/layouts/Base.astro`, `src/lib/i18n.ts` (solo ese texto).
- Pruebas: `tests/editorial-loader.test.mjs`, `tests/editorial-preview.spec.ts`, `playwright.editorial.config.ts`.
- Documentación: `src/content/editorial/README.md`, `docs/AMPLIACION-EDITORIAL.md`, este informe.

Además, el par privado Markdown/JSON de la guía permanece en `.local/editorial/`; los informes de prueba, compilaciones y capturas son artefactos locales ignorados. El texto aprobado podrá conservarse en Git cuando se complete la revisión; el borrador actual todavía depende de su copia local.
