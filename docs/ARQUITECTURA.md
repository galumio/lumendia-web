# Arquitectura y operación

## Contenido y rutas

Astro genera HTML estático. Cada archivo JSON en `src/content/books/` representa un libro con `slug`, título, descripción, categoría, portada, audiencia, estado editorial, índice, temas, páginas y situaciones. La interfaz TypeScript `Book` documenta el contrato. Cada página tiene slug, título, descripción, HTML, cantidad de palabras y hash del texto retenido.

Para añadir un libro, crear su archivo con ese contrato, agregar una portada optimizada y registrar la aprobación. Las rutas, tarjetas, buscador y sitemap lo incorporan automáticamente. Adaptar las validaciones de integridad específicas del primer libro para el nuevo título. No copiar ni modificar plantillas de páginas.

HTML editorial estático y confiable: no se aceptan archivos de usuarios ni HTML remoto. Toda importación debe eliminar scripts, formularios y eventos embebidos y pasar controles de enlaces y contenido. El importador actual conserva exactamente el texto de los cuerpos tras quitar la interfaz antigua. Las copias originales y sus hashes permanecen en `.local/`.

## Privacidad

Sin servidor, cuentas, formularios ni base de datos. El tamaño de letra, tema, progreso y elección de consentimiento se guardan en localStorage con manejo de errores para navegadores que lo bloquean. La lectura no depende de ese almacenamiento. No se registra información introducida en PDF o papel.

Analítica y anuncios desactivados. No hay IDs ficticios. Los botones y enlaces tienen puntos de instrumentación `data-event`; no envían eventos mientras no exista una integración aprobada. El componente AdSlot se utiliza solo en contextos no sensibles y se oculta sin configuración real. No habilitar anuncios automáticos en el lector.

## Integraciones

- `commerce.kitUrl`: URL HTTPS real del producto externo. Sin URL, no se muestra botón de compra.
- `searchConsoleVerification`: token real para meta de verificación; no incluye prefijos HTML. No se usa: Search Console está verificado como propiedad de dominio por DNS (Cloudflare) desde el 14/10/2026, con el sitemap enviado. Dejar en `null`.
- `analytics`: preparado para activación posterior, sujeto a privacidad y consentimiento.
- `ads`: cliente, slot y texto de ads.txt reales. Vacío mientras no se habilite. No implica aprobación de AdSense.

Antes de activar rastreadores, actualizar las políticas, validar el mecanismo de consentimiento y las obligaciones del proveedor (incluida CMP certificada en territorios que la requieran). La comprobación de publicación los bloquea en la primera versión.

## Publicación segura

Dos salidas independientes: `.preview/` (revisión local, con noindex) y `dist/` (producción). Los libros pendientes no generan rutas ni entradas de sitemap en producción. El recurso sanitario se copia solo si se aprueba editorialmente. Noindex no constituye control de acceso: nunca alojar `.preview/` públicamente.

El workflow solo se ejecuta manualmente, exige el ambiente `github-pages`, comprobaciones y aprobación editorial/legal. Configurar revisores del ambiente si el plan lo permite. El repositorio debe mantenerse privado mientras contenga textos sanitarios no aprobados; volverlo público también publicaría esas fuentes.

## Diseño

Paleta marfil, verde profundo y ocre. Marca tipográfica propia, serif de sistema para lectura y sans serif para navegación. Fuentes locales del sistema: ninguna llamada a Google Fonts. Portada original renderizada a JPG; no se recreó ni alteró la identidad del libro. CSS adaptable a celular, tablet y escritorio, tema oscuro, foco visible, enlace de salto y respeto de movimiento reducido.

Para los metadatos comerciales de nuevos libros, `printPages`, `publisher`, `resource` y `premium` son opcionales. `premium` define título, descripción, ítems, nota aclaratoria y URL real del producto. Omitirlo si no hay producto. El recurso inicial se identifica como `caregiver-emergency`; un nuevo libro sin esa referencia no recibe esa descarga ni la tarjeta de kit del cuidador.
