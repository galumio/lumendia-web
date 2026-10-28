# Publicación de los primeros tres tutoriales

Versiones editoriales autorizadas el 28 de octubre de 2026: «Cómo escribir un buen pedido a la IA» (770 palabras), «Cómo comprobar una respuesta de la IA» (836) y «Tu primera conversación con una IA» (855). Atribución: Lumendia · Galumio Studio. Lecturas completas gratuitas, sin registro.

Los originales aprobados y sus metadatos se conservan en `src/content/editorial/`. Los hashes fijados en `tests/approved-tutorials.test.mjs` comprueban la integridad exacta del texto, su extensión y los cinco pedidos copiables en total. La fecha editorial preparada es 2026-10-28 y debe coincidir con la confirmación del despliegue en Argentina. No se asigna una fecha de revisión posterior ficticia.

El catálogo, índice `/tutoriales/`, rutas, canonical, datos estructurados y sitemap utilizan el adaptador existente. Los tres tutoriales se relacionan entre sí, con la guía principal y con libros disponibles. No se enlaza el tutorial de voz, que continúa como borrador privado sin autorización de publicación. Los respaldos permanecen fuera del repositorio y del artefacto público.

Validación: pruebas unitarias de originales y contrato, pruebas de navegador `tutorials-public.spec.ts` (catálogo, SEO, copias, enlaces, teclado, móvil, accesibilidad y exclusión de rutas privadas), suites previas, tres compilaciones, validador y auditorías. El tutorial de voz sigue disponible exclusivamente en vista previa privada y no tiene original aprobado en el directorio público. No se alteran manuscritos de libros, la guía principal, dependencias, anuncios ni consentimiento de Cloudflare.

Se conserva el procedimiento de publicación mediante PR, CI y artefacto local de biblioteca. `.preview` nunca se publica. Una publicación en otra fecha requiere ajustar los metadatos antes de integrar.
