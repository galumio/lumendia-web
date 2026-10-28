# Relatos y autores: preparación local

La obra aprobada `src/content/editorial/el-ultimo-pasajero.md` conserva exactamente 3.151 palabras y SHA-256 `2425b4e91157f7c0f61e2b7cdea14907e3678bd41d93776580f7ca2d3e179927`.

Publicación autorizada para el 2026-10-28, fecha real de preparación del lanzamiento en Argentina. `publishedAt: "2026-10-28"`; `reviewedAt: null`. Confirmar la fecha contra el despliegue y corregirla antes de continuar si cambia el día. El cargador incluye relato, índice y perfil en biblioteca desde esa fecha; en `.preview` conserva noindex y medición deshabilitada. No se modificó el despliegue.

El contrato admite `author.slug` opcional para personas y `publisher` opcional de tipo Organization. Los registros anteriores siguen siendo válidos. `editorial-authors.ts` valida la identidad y genera perfiles únicamente cuando tienen entradas seleccionadas. Gael Beltra se identifica como seudónimo literario, sin biografía ni bibliografía comercial inventadas.

El lector usa ShortStory y el perfil ProfilePage/Person, con identificador de autor consistente. El sello se declara como Organization. No se atribuye titularidad de derechos al sello por inferencia. El sitemap incorpora el perfil solo si existe una obra elegible. La vista previa conserva sitemap vacío por su política actual.

El relato no tiene capítulos: el control de índice conduce a la navegación del relato, que ofrece el índice de la colección y el inicio del texto. No se insertaron encabezados en el original. Se conserva el control de tamaño de letra y contraste. No hay bloque vacío de fuentes ni pedidos para copiar.

Vista local:

    npm run build:preview
    node scripts/serve.mjs .preview 4335

Rutas: `/relatos/`, `/relatos/el-ultimo-pasajero/`, `/autores/gael-beltra/`.

Pruebas específicas:

    node --test tests/approved-story.test.mjs
    npx playwright test --config=playwright.stories.config.ts

El worktree necesita los JSON de libros y los recursos autorizados locales para recompilar la biblioteca completa; siguen excluidos de Git. En esta preparación se copiaron los insumos del checkout original, sin alterarlo ni copiar sus tips pendientes. Nunca publicar `.preview` ni `.local`.

Publicar únicamente con CI aprobado y revisión del artefacto completo mediante el flujo habitual. Los originales y respaldos privados nunca se incluyen. Los doce tips quedan fuera de este lanzamiento.
