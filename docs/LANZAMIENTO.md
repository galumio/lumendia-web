# Lanzamiento de la biblioteca

El repositorio es público y contiene solo código. El texto de los libros (`src/content/books/*.json`) y los PDF viven en este equipo (`.local/originals/`) y están ignorados por Git. El sitio se compila localmente y se publica como artefacto.

## Flujo

1. `scripts/package-library.mjs`: comprueba las aprobaciones (`scripts/release-library.mjs`), compila `dist-library/`, ejecuta `scripts/validate.mjs dist-library` y genera `.local/release/lumendia-site-<fecha>.tar.gz` con su SHA-256.
2. `scripts/publish-library.mjs --confirm-launch`: sube el paquete como adjunto de un **release borrador** (solo visible con acceso de escritura; no crea tag público) y dispara `.github/workflows/deploy-library.yml` en `main`.
3. El workflow descarga el adjunto, verifica el SHA-256, CNAME, ausencia de `noindex` y que el único PDF sea la hoja de emergencia gratuita, y despliega en GitHub Pages.
4. El script verifica en `https://lumendia.com.ar` la portada, la biblioteca, las situaciones y el hash del PDF gratuito.

Credenciales: usa la sesión `galumio` del administrador de credenciales de Git. No se guardan tokens en el proyecto.

## Antes de lanzar (bloqueos automáticos)

Completar en `site.config.json`:

- `editorial`: `approved: true`, `reviewer` (nombre y matrícula/profesión), `reviewedAt` (AAAA-MM-DD), `evidence` (referencia a la constancia, guardada fuera del repo).
- `legal`: `approved: true`, `responsibleName`, `jurisdiction` (p. ej. "la Ciudad Autónoma de Buenos Aires"); `contactEmail`.

Y en el JSON local del libro: `"editorialStatus": "approved"`.

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
