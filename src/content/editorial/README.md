# Textos originales aprobados

Ubicación reservada para pares `<slug>.json` (metadatos) y `<slug>.md` (texto original aprobado). El cargador `src/lib/editorial-loader.mjs` la conecta al catálogo, rutas y sitemap. Contiene la primera guía aprobada, con fecha editorial de publicación 2026-10-27, habilitada para su publicación autorizada. La fecha debe coincidir con la confirmación del despliegue.

Los borradores, manuscritos comerciales, evidencias privadas y respaldos permanecen en `.local/editorial/` o `.local/originals/`, nunca en `public/`. Solo ingresarán aquí textos cuya publicación íntegra haya sido autorizada. Los archivos de este directorio podrán versionarse después de revisión; no se cambia `.gitignore` ni se habilitan los JSON privados de libros.

Contrato: `src/lib/editorial-content.mjs`. Campos: `slug`, `title`, `description`, `format` (guide/tutorial/tip/story), `language`, `topics`, `audiences`, `scope`, `author: {name}`, `publishedAt`, `reviewedAt`, `sources: [{title,url}]`, `related: [{type,slug}]`, `bodyPath`, `status`, `rights: {kind,evidence}`, `healthContent`, `healthReview` cuando corresponda. Las evidencias deben ser identificadores de revisión, no documentos privados. Tema, público, formato, idioma y alcance son dimensiones independientes.

No completar autor ni fechas por inferencia. Las fechas desconocidas quedan en null; una entrada aprobada sin fecha real de publicación no es elegible. La fecha de revisión solo se asigna cuando se revisa. Los nombres y fechas usados en tests son fixtures ficticios, nunca publicaciones.

La atribución admite `author.type` opcional (`Person` u `Organization`); las instituciones no deben describirse como personas en los datos estructurados. En los borradores el lector identifica la atribución como propuesta. Esto no cambia su estado de aprobación ni asigna fechas.

El cargador valida metadatos, nombres, ubicaciones sin enlaces simbólicos, tamaño máximo de 1 MB por archivo y relaciones disponibles. Producción solo lee registros aprobados de este directorio, con fecha elegible; no enumera `.local`. Desarrollo y `build:preview` también admiten originales aprobados pendientes de publicación y borradores de `.local/editorial/`, con aviso y `noindex`, bajo el régimen de privacidad de la vista previa existente. `.preview` contiene material privado y nunca es un artefacto publicable. No se cambia el flujo de despliegue.

Markdown admitido: encabezados H2/H3, párrafos, listas con guion y citas para pedidos, separados por líneas vacías. Sin HTML, H1 adicional, MDX, imágenes, enlaces incrustados ni código. Las fuentes HTTPS y relaciones se declaran en JSON; no se copian archivos originales a la salida. Relaciones resueltas actualmente: libros disponibles, entradas editoriales elegibles y recursos del catálogo existente (descargas explícitas y validadas). No se habilitan PDF arbitrarios ni equivalencias de idioma.

Los índices por formato solo se generan con entradas elegibles. Las páginas temáticas siguen pendientes. Para aprobar una obra: revisar el texto, resolver atribución y derechos, asignar fechas reales, mover su par JSON/Markdown aquí y cambiar el estado a `approved`. Evitar conservar un duplicado en el directorio de borradores, porque bloqueará la vista previa. La incorporación a Git y la publicación necesitan la revisión correspondiente; este mecanismo no realiza ninguna de ellas automáticamente.

Los recursos descargables nuevos necesitan un registro específico, original aprobado, hash y autorización individual. La lista actual de PDF permitidos no se modifica en esta etapa. Las herramientas interactivas tendrán otro contrato de comportamiento y privacidad: no se habilitan con un formato genérico ni con scripts embebidos en Markdown.

Los cinco pedidos prácticos de la guía tienen botones de copia como mejora de la lectura: el renderer identifica un bloque de cita inmediatamente posterior a `### Pedido para copiar`. No modifica el Markdown ni su conteo; el script solo llama al portapapeles tras pulsar el botón, informa el resultado y ofrece copia manual si no hay permiso. No envía mediciones ni solicitudes.
