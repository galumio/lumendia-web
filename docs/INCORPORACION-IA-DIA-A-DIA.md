# Incorporación local de muestras: IA para el día a día / AI for Everyday Life

Revisión: 22 de octubre de 2026. Trabajo limitado a `C:\Desarrollo\Lumendia`.
Estado de la revisión local: completada. Publicación autorizada por el titular el 22 de octubre de 2026; ejecución y verificación pública registradas por separado en GitHub y en el informe de entrega.

## Base y conservación

- Rama `main`, inicialmente limpia, basada en `91df379` (publicación de las muestras para adultos mayores).
- No se encontraron cambios locales ajenos que conservar ni conflictos.
- Se verificaron por SHA-256 los cinco JSON anteriores, sus cinco portadas y `site.config.json`: los once archivos siguen idénticos a los iniciales.
- No se modificaron Galumio, dependencias, plantillas compartidas ni contenido de libros anteriores.
- Publicidad y analítica continúan desactivadas.

## Selección editorial y procedencia

| Edición | Palabras de muestra | Palabras extraídas del original | Proporción | Páginas físicas del PDF utilizadas |
| --- | ---: | ---: | ---: | --- |
| IA para el día a día | 534 | 10081 | 5,30 % | 5–6, 17–18, 28–29 |
| AI for Everyday Life | 535 | 10108 | 5,29 % | 5–6, 16–17, 28–29 |

El porcentaje se calcula con palabras separadas por espacios del texto extraído, sin números de página; no es un porcentaje del tamaño del archivo ni de sus páginas. Cada original tiene 61 páginas.

Cada muestra incluye dos secciones: introducción y ejemplos prácticos. Se seleccionaron los párrafos iniciales, las instrucciones para interpretar pedidos, las tres reglas del libro, los pedidos de menú semanal y lista de compras, y el caso práctico original sobre redactar y revisar un correo a un cliente. Los fragmentos conservan el idioma y las palabras del original. Los títulos de navegación y los textos de ficha son editoriales; no se presentan como capítulos nuevos del manuscrito. Un aviso aclara que la numeración corresponde al ebook completo.

La extracción es reproducible mediante manifiestos con hashes de los originales y límites de cada fragmento. Se normalizan espacios, se eliminan números de página y se conserva el guion de palabras partidas por salto de línea. Los títulos de navegación de las páginas nuevas incluyen el nombre del libro para evitar duplicados con las muestras anteriores.

Originales privados utilizados:

- `.local/originals/ia-para-el-dia-a-dia/IA_dia_a_dia_PAYHIP_CORREGIDO.pdf`
- `.local/originals/ia-para-el-dia-a-dia/cover.jpg.jpg`
- `.local/originals/ai-for-everyday-life/1_Etsy_Payhip_Ebook_AI_Everyday_Life.pdf`
- `.local/originals/ai-for-everyday-life/cover.jpg.jpg`

Portadas originales optimizadas a JPEG progresivo, 850 × 1360 píxeles, sin recortes ni generación: 97025 bytes (español) y 94806 bytes (inglés).

## Archivos nuevos y modificados

Nuevos para versionar:

- `scripts/books/ia-para-el-dia-a-dia-sample.json`: metadatos, compra y selección española.
- `scripts/books/ai-for-everyday-life-sample.json`: metadatos, compra y selección inglesa.
- `public/images/ia-para-el-dia-a-dia-portada.jpg`
- `public/images/ai-for-everyday-life-portada.jpg`
- `docs/INCORPORACION-IA-DIA-A-DIA.md`: este informe.

Modificados:

- `scripts/import_senior_samples.py`: selección por libro, verificación sin escritura, rango porcentual, manejo de números de página y guiones.
- `scripts/commercial-links.mjs`: dos destinos Payhip exactos, limitados a su propia muestra; se conservan las restricciones anteriores.
- `scripts/validate.mjs`: idioma de la nueva edición inglesa y precio de las muestras.
- `tests/commercial-links.test.mjs`: aislamiento entre productos, protocolo y parámetros no autorizados.
- `tests/senior-samples.spec.ts`: ambas ediciones nuevas, navegación móvil, portadas y regresión de las anteriores.

Contenido generado localmente, excluido de Git por la arquitectura existente:

- `src/content/books/ia-para-el-dia-a-dia.json`
- `src/content/books/ai-for-everyday-life.json`

Los manifiestos alimentan el catálogo, las fichas y los lectores existentes. No fue necesario cambiar las plantillas bilingües.

## Rutas y compra

Rutas comprobadas en el servidor local de biblioteca, puerto 4321; todavía no publicadas:

- `/libros/ia-para-el-dia-a-dia/`
- `/libros/ia-para-el-dia-a-dia/antes-de-empezar/`
- `/libros/ia-para-el-dia-a-dia/ejemplos-practicos/`
- `/libros/ai-for-everyday-life/`
- `/libros/ai-for-everyday-life/before-you-begin/`
- `/libros/ai-for-everyday-life/practical-examples/`

Compra española: `https://payhip.com/b/FmX4P`, USD 4,99.
Compra inglesa: `https://payhip.com/b/DvYKc`, USD 4.99.

Se verificaron destinos exactos y botones visibles en las fichas y ambas secciones de lectura, con área táctil de al menos 44 píxeles de alto. No se realizó una compra ni se validó el proceso de cobro externo de Payhip.

## Validación ejecutada

| Comando o revisión | Resultado |
| --- | --- |
| `python scripts/import_senior_samples.py --check` | Las cuatro muestras coinciden con sus fragmentos originales |
| `node --test tests/commercial-links.test.mjs` | 2 pruebas aprobadas |
| `npm run check` | 46 archivos; 0 errores, advertencias o sugerencias |
| `npm run build` y `npm test` | Compilación institucional y 63 comprobaciones aprobadas |
| `npm run build:library` | 45 páginas compiladas |
| `npm run test:library` | 3644 comprobaciones, 0 errores |
| `npm run test:library:browser` | 18 aprobadas; 5 de Alzheimer omitidas porque no forma parte de la salida publicable |
| `npm run test:institutional:browser` | 3 aprobadas |
| `npm run build:preview` | 83 páginas de vista previa compiladas |
| Suite `tests/site.spec.ts` contra la vista previa | Las 5 pruebas de Alzheimer aprobadas |
| `npm run audit:repository` | Sin archivos premium, archivos comprimidos, claves privadas ni tokens según sus comprobaciones |
| `git diff --check` | Sin errores de whitespace |

Las pruebas de las cuatro muestras recorrieron ficha, introducción y ejemplos en anchos de 320, 390, 768 y 1440 píxeles. Verificaron idioma HTML, texto original, ausencia de desbordamiento horizontal, portadas cargadas, navegación anterior/siguiente/índice, tamaño de letra, modo oscuro y ausencia de errores JavaScript. Axe no detectó infracciones WCAG 2 A/AA y 2.1 AA en las páginas comprobadas. Esto es una comprobación automatizada, no una certificación completa de accesibilidad.

Se revisaron visualmente las capturas móviles de ambas fichas y ejemplos. Las capturas y evidencias de extracción se conservan en `.local/`.

## Privacidad e integridad de la salida

- `dist` contiene 8 archivos; `dist-library`, 89.
- Se compararon hashes de archivos compilados con los originales privados. No hay PDF comercial ni EPUB en ninguna salida publicable.
- Los únicos PDF en `dist-library` son los dos recursos gratuitos anteriores, comprobados por hash. La revisión inicial que comparaba todos los PDF privados también los detectó; se distinguieron explícitamente de los originales comerciales.
- No hay carpetas `.local`, originales, respaldos, fuentes ni scripts privados en las salidas publicables. Las rutas privadas probadas por HTTP devuelven 404.
- Los originales y los JSON de contenido siguen ignorados por Git. Las muestras no ofrecen enlaces de descarga PDF/EPUB.
- La vista previa mantiene el contenido anterior de Alzheimer únicamente para regresión local; no se preparó ningún despliegue de esa salida.
- No se cargan rastreadores en las páginas probadas.

## Pendiente antes de publicar

1. Revisión editorial final: completada; selección corregida aprobada.
2. Autorización explícita para commit, push, PR y despliegue: recibida el 22 de octubre de 2026.
3. En esa futura publicación, repetir las comprobaciones de empaquetado del flujo vigente y verificar las URL públicas después del despliegue.

No quedan fallos conocidos en las validaciones ejecutadas.

## Corrección editorial autorizada

Se sustituyó íntegramente el ejemplo del reclamo por «Ejemplo completo: el correo que nadie quería escribir» / «Worked Example: The Email Nobody Wanted to Write», de las páginas físicas 28–29 de ambos manuscritos. Se conservó todo el caso, desde su encabezado hasta el cierre previo a «Errores comunes» / «Common Mistakes», separando sus párrafos sin reescribirlos.

El nuevo cierre relata que Diego / David revisa el correo, cambia una palabra y lo envía. No requiere consultar otros pedidos. Ya no aparecen «pedido 46», «prompt 46» ni «Me cobraron 30…». Se conserva la introducción y los pedidos 31–32 sobre menú y lista de compras; su numeración original se explica en el aviso editorial.

Las descripciones de libro y páginas ahora precisan que se muestra cómo solicitar un menú semanal a la IA. También describen correctamente el caso del correo y los avisos identifican los capítulos 3 y 5. Se actualizaron ambos manifiestos, ambos JSON generados, la evidencia privada de procedencia y este informe. Las páginas y metadatos HTML se regeneran con la compilación; no se cambiaron las plantillas.

La verificación contra los PDF originales confirmó todos los fragmentos. La comparación de hashes antes y después confirmó que los manuscritos comerciales, todas las portadas, los libros anteriores y la configuración permanecen intactos. Títulos, idiomas, precio y destinos Payhip se mantienen. La revisión editorial de la nueva selección no detectó cortes abruptos, repeticiones problemáticas ni referencias que exijan contenido ausente. Las llamadas a compra ofrecen únicamente el ebook completo.

Después de la corrección se repitieron todas las validaciones de la tabla anterior: 46 archivos sin diagnósticos, 2 pruebas de enlaces, 63 comprobaciones institucionales, 3644 comprobaciones de biblioteca, 18 pruebas de navegador de biblioteca, 3 institucionales y las 5 de Alzheimer en vista previa. Todas aprobaron. Se recompilaron las tres salidas y se revisaron las nuevas capturas móviles. Se comprobó que las descripciones corregidas están presentes en cada página generada y que ya no aparecen los fragmentos retirados. La auditoría final revisó 129 archivos candidatos sin incidencias. No se realizó ninguna publicación.
