# Lanzamiento de la biblioteca

El repositorio es público y contiene solo código. El texto de los libros (`src/content/books/*.json`) y los PDF viven en este equipo (`.local/originals/`) y están ignorados por Git. El sitio se compila localmente y se publica como artefacto.

## Flujo

1. `scripts/package-library.mjs`: comprueba las aprobaciones (`scripts/release-library.mjs`), compila `dist-library/`, ejecuta `scripts/validate.mjs dist-library` y genera `.local/release/lumendia-site-<fecha>.tar.gz` con su SHA-256.
2. `scripts/publish-library.mjs --confirm-launch`: sube el paquete como adjunto de un **release borrador** (solo visible con acceso de escritura; no crea tag público) y dispara `.github/workflows/deploy-library.yml` en `main`.
3. El workflow descarga el adjunto, verifica el SHA-256, CNAME, ausencia de `noindex` y que el único PDF sea la hoja de emergencia gratuita, y despliega en GitHub Pages.
4. El script verifica en `https://lumendia.com.ar` la portada, la biblioteca, las situaciones y el hash del PDF gratuito.

Credenciales: usa la sesión `galumio` del administrador de credenciales de Git. No se guardan tokens en el proyecto.

## Qué libros se publican

La aprobación es **por libro** (`node scripts/release-library.mjs` muestra cuáles entran). Un libro se publica si su JSON local tiene `"editorialStatus": "approved"` y además:

- `"healthContent": false` (contenido no sanitario), o
- contenido sanitario (`healthContent` true o ausente) con `"healthReview": {"reviewer": "nombre y profesión/matrícula", "reviewedAt": "AAAA-MM-DD", "evidence": "referencia a la constancia, guardada fuera del repo"}`.

Los libros que no cumplen se excluyen del build sin frenar a los demás. Estado al 2026-10-14: se publica "Cómo estudiar para un final"; "Cuidar a mamá o papá" queda excluido hasta cargar `healthReview`.

Para habilitar Alzheimer: completar `healthReview` y `editorialStatus: "approved"` en `src/content/books/cuidar-a-mama-o-papa.json`, ejecutar las pruebas y volver a publicar.

## Bloqueos globales

- `site.config.json` > `legal` (`approved`, `responsibleName`, `tradeName`, `jurisdiction`) y `contactEmail` completos.
- Cada recurso gratuito de un libro publicado existe en `.local/` y coincide con su SHA-256.
- Publicidad y analítica desactivadas.

## Nuevo libro

1. Copiar los originales a `.local/originals/<slug>/`.
2. Crear `scripts/books/<slug>.json` (metadatos, recursos gratuitos con su SHA-256, `healthContent`) tomando como modelo `como-estudiar-para-un-final.json`.
3. `python -I scripts/import_book.py scripts/books/<slug>.json` genera `src/content/books/<slug>.json` y la portada.
4. Agregar el hash de cada PDF gratuito a la lista de `deploy-library.yml` y los de los PDF premium a `scripts/validate.mjs` y `scripts/repository-audit.mjs`.

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
