# Lanzamiento de la biblioteca

El repositorio es público y contiene solo código. El texto de los libros (`src/content/books/*.json`) y los PDF viven en este equipo (`.local/originals/`) y están ignorados por Git. El sitio se compila localmente y se publica como artefacto.

## Flujo

1. `scripts/package-library.mjs`: comprueba las aprobaciones (`scripts/release-library.mjs`), compila `dist-library/`, ejecuta `scripts/validate.mjs dist-library` y genera `.local/release/lumendia-site-<fecha>.tar.gz` con su SHA-256.
2. `scripts/publish-library.mjs --confirm-launch`: sube el paquete como adjunto de un **release borrador** (solo visible con acceso de escritura; no crea tag público) y dispara `.github/workflows/deploy-library.yml` en `main`.
3. El workflow descarga el adjunto, verifica el SHA-256, CNAME, ausencia de `noindex` y la elegibilidad, rutas, texto y recursos PDF/EPUB contra los manifiestos del commit confiable, y despliega en GitHub Pages.
4. El script verifica en `https://lumendia.com.ar` la portada, la biblioteca, las situaciones y el hash del PDF gratuito.

Credenciales: usa la sesión `galumio` del administrador de credenciales de Git. No se guardan tokens en el proyecto.

## Qué libros se publican

La elegibilidad vigente está centralizada en `src/lib/publication-policy.mjs` y documentada en [POLITICA-EDITORIAL-Y-DESCARGAS.md](POLITICA-EDITORIAL-Y-DESCARGAS.md). `healthContent: false` ya no autoriza por sí solo una publicación. A requiere revisión editorial documentada; B requiere además revisión profesional; mixtos/ambiguos permanecen bloqueados. Los libros publicados conservan únicamente su edición histórica exacta, sin reclasificación automática.

Los registros confiables son `src/content/editorial-policy.json` y `src/content/approved-resources.json`. Las revisiones se vinculan a la edición y clasificación por hashes. La constancia de IA está en docs/APROBACION-EDITORIAL-IA-DIA-20261102.txt; los maestros y manuscritos privados permanecen fuera del repositorio. Una revisión incompleta o un cambio de contenido invalida la elegibilidad.

La edición FOCALIZADO_CIERRE de Alzheimer tiene aprobación A documentada el 2026-11-02 y es elegible para lectura completa online, sin descargas PDF/EPUB; véase docs/APROBACION-EDITORIAL-ALZHEIMER-20261102.txt. La edición SANITARIO completa de IA tiene clasificación A aprobada el 2026-11-02; el build público incluye los diez capítulos y complementos, sin PDF/EPUB gratuitos.

## Bloqueos globales

- `site.config.json` > `legal` (`approved`, `responsibleName`, `tradeName`, `jurisdiction`) y `contactEmail` completos.
- Cada recurso gratuito de un libro publicado existe en `.local/` y coincide con su SHA-256.
- Publicidad y analítica desactivadas.

## Nuevo libro

1. Copiar los originales a `.local/originals/<slug>/`.
2. Crear `scripts/books/<slug>.json` (metadatos, recursos gratuitos con su SHA-256, `healthContent`) tomando como modelo `como-estudiar-para-un-final.json`.
3. `python -I scripts/import_book.py scripts/books/<slug>.json` genera `src/content/books/<slug>.json` y la portada.
4. Registrar clasificación y revisiones reales en `editorial-policy.json`; registrar los recursos aprobados con ruta, edición, formato, tamaño y hash en `approved-resources.json`. No se añaden excepciones de extensión ni listas de hashes al workflow.

Opciones del manifiesto (ver `ia-para-docentes.json`): `coverFromZip` (portada incluida en el ZIP en lugar de renderizar el PDF), `printPages`, `chapterOrder` (verifica el índice), `removeSelectors` (bloques de la plantilla que se quitan), `buyUrl` (reemplaza `#COMPRAR` en los capítulos) y `allowedNumberedPrompts` (muestras parciales: falla si aparece otro prompt numerado).

Estado al 2026-10-14: publicados "Cómo estudiar para un final" (sin premium por ahora); preparado "IA para docentes" (premium: galumio.com.ar/productos/ia-para-maestros/); Alzheimer excluido hasta cargar `healthReview`.

## Ensayo sin aprobaciones

```powershell
npm run build:library:dry-run   # salida de producción con el libro incluido
npm run test:library            # validación estática de dist-library
npm run test:library:browser    # Playwright + axe sobre dist-library
node scripts/package-library.mjs --dry-run   # paquete marcado DRY-RUN, no publicable
```

## Volver a la presentación institucional

`node scripts/publish-library.mjs --rollback-institutional` vuelve a ejecutar `deploy.yml`, que publica `site/`.

Los releases borrador quedan como historial privado de despliegues; se pueden borrar desde GitHub > Releases.
## IA para docentes — aprobación editorial del 2026-11-03

La edición `IA_para_docentes_ES_EDITORIAL_20261103` tiene aprobación A documentada en `docs/APROBACION-EDITORIAL-DOCENTES-20261103.txt`, vinculada a EPUB, PDF y 15 cuerpos web. Es elegible para preparar lectura completa online: diez capítulos, 50 prompts, avisos y anexo, sin descargas del libro. La hoja de referencia independiente conserva exclusivamente su autorización histórica y hash.

La aprobación editorial no registra una publicación ni autoriza el despliegue. Hasta la autorización final, la ficha aparece en la vista previa como preparada; no se añade fecha a `publication-history.json`. Al preparar el lanzamiento autorizado deberá registrarse la publicación de la edición exacta para incorporar la ficha al catálogo público y a las novedades, generar un artefacto nuevo y repetir las comprobaciones correspondientes.

## Lanzamiento autorizado — IA para docentes (2026-11-03)

El usuario autorizó expresamente publicar esta edición el 3 de noviembre de 2026, Argentina. `publication-history.json` identifica la edición aprobada y la fecha real para incorporar su ficha a Biblioteca. La autorización no sustituye las validaciones locales, CI aprobado ni la comprobación final en producción. No se agregan descargas del libro.
