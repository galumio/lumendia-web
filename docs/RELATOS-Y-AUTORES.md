# Relatos y autores: retirada de la primera obra

«El último pasajero» fue retirado por decisión editorial del autor. Su Markdown y registro ya no pertenecen al contenido versionable activo. El manuscrito exacto de 3.151 palabras y los respaldos se conservan en el área privada del responsable. No se sustituye la obra por otro texto.

El cargador existente excluye las entradas ausentes; el índice `/relatos/`, el perfil `/autores/gael-beltra/` y sus enlaces desaparecen porque no tienen obras públicas. GitHub Pages devuelve 404 para esas rutas después de reemplazar el artefacto. No se modifican workflows, consentimiento ni publicaciones anteriores.

El contrato admite `author.slug` opcional para personas y `publisher` opcional de tipo Organization. Los registros anteriores siguen siendo válidos. `editorial-authors.ts` valida la identidad y genera perfiles únicamente cuando tienen entradas seleccionadas. Gael Beltra se identifica como seudónimo literario, sin biografía ni bibliografía comercial inventadas.

El lector usa ShortStory y el perfil ProfilePage/Person, con identificador de autor consistente. El sello se declara como Organization. No se atribuye titularidad de derechos al sello por inferencia. El sitemap incorpora el perfil solo si existe una obra elegible. La vista previa conserva sitemap vacío por su política actual.

El relato no tiene capítulos: el control de índice conduce a la navegación del relato, que ofrece el índice de la colección y el inicio del texto. No se insertaron encabezados en el original. Se conserva el control de tamaño de letra y contraste. No hay bloque vacío de fuentes ni pedidos para copiar.

La arquitectura sigue disponible para futuras obras aprobadas. No volver a incorporar este manuscrito ni asignarle una nueva fecha sin autorización editorial expresa. Nunca publicar `.local`, `.preview` ni los respaldos.

Validación de retirada: `node --test tests/withdrawn-story.test.mjs` y `playwright test` (incluye `story-withdrawal.spec.ts`). Las compilaciones y el artefacto local se publican mediante el procedimiento habitual.
