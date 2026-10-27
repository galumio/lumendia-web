# Textos originales aprobados

Ubicación reservada para pares `<slug>.json` (metadatos) y `<slug>.md` (texto original aprobado). No contiene textos ni registros de ejemplo publicables. No está conectada al build ni al sitemap.

Los borradores, manuscritos comerciales, evidencias privadas y respaldos permanecen en `.local/editorial/` o `.local/originals/`, nunca en `public/`. Solo ingresarán aquí textos cuya publicación íntegra haya sido autorizada. Los archivos de este directorio podrán versionarse después de revisión; no se cambia `.gitignore` ni se habilitan los JSON privados de libros.

Contrato: `src/lib/editorial-content.mjs`. Campos: `slug`, `title`, `description`, `format` (guide/tutorial/tip/story), `language`, `topics`, `audiences`, `scope`, `author: {name}`, `publishedAt`, `reviewedAt`, `sources: [{title,url}]`, `related: [{type,slug}]`, `bodyPath`, `status`, `rights: {kind,evidence}`, `healthContent`, `healthReview` cuando corresponda. Las evidencias deben ser identificadores de revisión, no documentos privados. Tema, público, formato, idioma y alcance son dimensiones independientes.

No completar autor ni fechas por inferencia. Las fechas desconocidas quedan en null; una entrada aprobada sin fecha real de publicación no es elegible. La fecha de revisión solo se asigna cuando se revisa. Los nombres y fechas usados en tests son fixtures ficticios, nunca publicaciones.

Antes de conectar este directorio a rutas: revisar cada texto, validar relaciones existentes y equivalencias de idioma, renderizar Markdown sin HTML arbitrario, comprobar límites de archivos y resolver recursos por una lista explícita. Nunca copiar este directorio entero a la salida. Generar índices y páginas temáticas solamente si contienen entradas elegibles; no incluir borradores ni entradas con fechas futuras.

Los recursos descargables nuevos necesitan un registro específico, original aprobado, hash y autorización individual. La lista actual de PDF permitidos no se modifica en esta etapa. Las herramientas interactivas tendrán otro contrato de comportamiento y privacidad: no se habilitan con un formato genérico ni con scripts embebidos en Markdown.
