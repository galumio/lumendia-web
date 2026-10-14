# Lumendia

Biblioteca digital en Astro y presentación institucional temporal para `lumendia.com.ar`.

## Etapa actual: lanzamiento de la biblioteca preparado

Este repositorio es público y contiene solo código: el texto de los libros y los PDF quedan en el equipo local. La biblioteca se publica desde un build local con `scripts/publish-library.mjs`; ver [docs/LANZAMIENTO.md](docs/LANZAMIENTO.md). Hasta el lanzamiento autorizado, `deploy.yml` sigue publicando la presentación institucional de `site/`.

## Presentación institucional (publicada)

**Desplegada en GitHub Pages con HTTPS; DNS verificado.** La página temporal presenta el proyecto sin ebooks, PDF, formularios, publicidad ni analítica. La biblioteca sanitaria continúa pendiente de revisión profesional; no se cambió ninguna aprobación para esta etapa.

```powershell
npm.cmd run prepare:publication
npm.cmd run test:institutional
node scripts/serve.mjs dist 4322
```

Abrir http://127.0.0.1:4322. La presentación publicada es `site/` (idéntica a `institutional/`), desplegada por `.github/workflows/deploy.yml` desde este mismo repositorio. El contenido de los libros y los PDF están ignorados por Git; `npm run audit:repository` lo comprueba antes de cada commit.

Ver [estado y próximos pasos de publicación](docs/DESPLIEGUE-INICIAL.md). El plan de DNS está en `deploy/initial-plan.json`; la cuenta GitHub verificada es galumio y el CNAME de www será galumio.github.io. Los servidores Cloudflare cartman.ns.cloudflare.com y hattie.ns.cloudflare.com ya están delegados y verificados públicamente.

## Biblioteca completa: revisión local

Requiere Node.js 22.12 o superior y npm; dependencias fijadas en package-lock.json.

```powershell
npm.cmd ci
npm.cmd run dev
npm.cmd run check
npm.cmd run build:preview
```

`dev` permite revisar el ebook completo localmente. `build:preview` genera `.preview/` con noindex y descarga gratuita local. No alojar esa carpeta en Internet. `build:library` genera una salida separada `dist-library/`; `release:library` conserva el bloqueo editorial/legal. No está autorizada la publicación de la biblioteca.

Los originales intactos, herramientas y evidencias están en `.local/`. Los PDF premium, ZIP y el archivo de contenido sanitario pendiente están ignorados por Git. La aprobación futura exige revisar las exclusiones deliberadamente; no usar `git add -f` para sortearlas.

## Pruebas

- `npm test` / `npm run test:institutional`: lista permitida de archivos y contenido del sitio temporal.
- `npm run test:institutional:browser`: pruebas de presentación, móvil, accesibilidad y rutas privadas. Requiere el servidor de `dist/` en 4322.
- `npm run audit:repository`: candidatos de Git, patrones de credenciales y PDF premium.
- `npm run test:library`: comprobaciones del desarrollo original; conservar como referencia de la etapa de biblioteca, cuya salida y controles son distintos.
- `npm run test:browser`: suite original sobre la vista completa de revisión.

El workflow institucional funciona sin dependencias npm: verifica una lista cerrada y publica únicamente `site/` en la copia pública. La ejecución es manual. El primer despliegue autorizado finalizó correctamente; el estado y los pasos DNS pendientes están documentados en docs/DESPLIEGUE-INICIAL.md.

## Organización

- `institutional/`: presentación pública temporal.
- `deploy/`: workflow, README exportable y plan DNS.
- `release/github-pages/`: copia histórica del primer despliegue, ignorada por Git (ya no se usa).
- `src/`: desarrollo de la biblioteca completa, conservado localmente.
- `scripts/`: importación, compilación, pruebas y exportación segura.
- `docs/ARQUITECTURA.md`: arquitectura de la biblioteca.
- `docs/REVISION-EDITORIAL.md`: revisión sanitaria pendiente.
- `docs/PRUEBAS.md`: informe histórico de la biblioteca del 12/10/2026.
- `docs/DESPLIEGUE-INICIAL.md`: procedimiento vigente de publicación temporal.

No se modificaron repositorios, sitios ni dominios de Galumio.
