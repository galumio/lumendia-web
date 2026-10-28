# Rediseño accesible y generador de pedidos

La biblioteca incluye accesos visuales, navegación móvil y controles de lectura. La presentación institucional y el flujo de publicación no cambian.

El generador se publica en `/herramientas/generador-de-prompts/`, con canonical, sitemap y datos estructurados WebApplication. Usa seis plantillas deterministas en el navegador. No llama a servicios de IA, no requiere claves y no guarda ni envía los textos del formulario. El ejemplo es ficticio y reemplaza los campos solo al pulsar su botón. La salida se puede editar y copiar mediante una acción explícita; Borrar todo vacía campos y resultado. Las entradas tienen límites, se validan y se insertan como texto.

Cloudflare conserva su consentimiento opcional en el resto del sitio. La página del generador desactiva la medición incluso si existe consentimiento previo, para evitar cualquier captura accidental de campos o resultados. Las preferencias de tema y el progreso de los lectores existentes no cambian. Publicidad y Google Analytics continúan desactivados.

El menú móvil es una navegación desplegable no modal: permite Tab sin trampa, Escape devuelve el foco al botón y elegir un enlace lo cierra. Sin JavaScript, la navegación permanece visible y el formulario queda oculto con una alternativa de lectura. El resultado recibe foco y respeta movimiento reducido. Los lectores editoriales incorporan tamaño de letra, contraste e índice.

## Separación de contenidos pendientes

Esta publicación no incorpora textos, índices, destacados ni fechas de los doce tips. La portada muestra cinco accesos existentes. El trabajo de lanzamiento de los tips se conserva en el checkout original y deberá reconciliarse con estas plantillas antes de su publicación autorizada. No hay automatizaciones ni cambios en los scripts o workflows de despliegue.

## Verificaciones

- `npm run check`
- `node --test tests/*.test.mjs`
- `npm run build` y `npm test`
- `npm run build:library` y `npm run build:preview`
- `node scripts/validate.mjs dist-library .preview`
- `npx playwright test` y las configuraciones institucional y editorial
- `npx playwright test --config=playwright.ux.config.ts` (sobre dist-library, puerto 4373)
- `npm run audit:repository`
- `npm audit --audit-level=moderate`

Las pruebas específicas comprueban teclado, tamaños móviles, accesibilidad automática, copia, borrado, validación de entradas, ausencia de red y almacenamiento del formulario, consentimiento previo, ausencia de tips y metadatos públicos. No sustituyen una evaluación humana con lectores de pantalla y dispositivos físicos.
