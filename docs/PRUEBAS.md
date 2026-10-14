# Informe de pruebas

Fecha: 12 de octubre de 2026. Entorno local Windows, Node.js 24, Astro 7.3.8, Microsoft Edge mediante Playwright.

## Resultados ejecutados

| Comprobación | Resultado |
|---|---|
| TypeScript y plantillas Astro | Sin errores, advertencias ni hints en la comprobación ejecutada |
| Compilación de revisión | 49 páginas HTML; libro completo disponible solo en revisión local |
| Compilación de producción | 11 páginas HTML; no genera los libros ni la descarga sanitaria pendientes |
| Integridad, enlaces y SEO | 3.785 comprobaciones sin errores en la ejecución registrada |
| Pruebas de navegador | 6 pruebas aprobadas, sin fallos ni pruebas omitidas |
| Auditoría de dependencias | 0 vulnerabilidades tras actualizar Astro e instalar sus tipos |
| Control de publicación | Bloqueo esperado por falta de aprobación sanitaria, datos legales y hoja aprobada |
| Archivos premium | Ausentes de public, dist y .preview; originales ignorados por Git |
| Repositorio remoto y DNS | No creados ni modificados |

## Cobertura

1. Inicio a 1440, 768 y 390 px, sin desbordamiento horizontal; capturas y análisis axe con reglas WCAG 2 A/AA y 2.1 AA.
2. Búsqueda insensible a acentos, resultados vacíos, restablecimiento y categorías sin libros ficticios.
3. Las 50 situaciones, filtro por texto y acceso a anclas; análisis de accesibilidad de la página de situaciones en móvil.
4. Tamaño de letra persistente, tema oscuro, progreso y continuación; análisis axe del lector en oscuro.
5. PDF gratuito con cabecera válida y hash idéntico al original; tarjeta premium sin URL inventada; diálogo de privacidad; ausencia de peticiones de Analytics/AdSense.
6. Recorrido de capítulos, escenas, fuentes y temas: respuestas HTTP 200, un H1 y advertencia sanitaria; sin excepciones JavaScript.

Las comprobaciones estáticas verifican títulos únicos, descripciones, canonical, Open Graph, todos los enlaces y anclas internos, los 25 capítulos, cuatro escenas, 50 situaciones con sus cinco campos y ausencia de PDF premium por nombre/hash. Producción no contiene rutas de libros pendientes ni las incluye en sitemap.

## Correcciones realizadas durante QA

- Actualización de Astro para resolver avisos de seguridad de dependencias.
- Ajuste del contraste de los números de categorías (la primera prueba detectó 4,43:1).
- Exclusión de fichas no numeradas del conteo de las 50 situaciones.
- Desactivación de telemetría de Astro para ejecución reproducible dentro del proyecto.
- Tipos de Node incorporados y advertencias de código corregidas.

## Evidencias locales

- `.local/validation.json`: cantidad de comprobaciones y errores.
- `.local/browser-results.json`: resultados completos de Playwright.
- `.local/home-1440.png`, `.local/home-768.png`, `.local/home-390.png`: capturas de portada.
- `.local/reader-mobile.png`: lector de situaciones.
- `.local/inspection.json`: páginas de PDF y hashes de archivos.
- `.local/pdf-comparison.json`: cotejo de párrafos HTML/PDF.

Estas evidencias y los originales están excluidos del repositorio. Las pruebas automáticas no acreditan cumplimiento legal ni revisión clínica y no sustituyen pruebas con tecnologías de asistencia reales. No se verificó un despliegue remoto, certificado o propagación DNS porque no se realizaron esas operaciones. No se probaron integraciones comerciales, anuncios ni analítica con cuentas reales, que siguen desactivadas.

## Repetición

```powershell
npm run check
npm run build:preview
npm run build
npm test
npm run test:browser
npm run audit:repository
npm run release:check
```

Si la vista local ya está abierta, en PowerShell puede usarse `$env:LUMENDIA_TEST_SERVER_EXTERNAL='1'` antes de `npm run test:browser`. Esto evita que Playwright intente administrar el servidor existente. En Windows se usa Edge instalado; en Linux instalar Chromium con `npx playwright install --with-deps chromium`.

Después del ajuste final de la ruta de descarga, se repitió la prueba de descarga, kit y privacidad: **1 aprobada**. El JSON de Playwright conserva esa última ejecución parcial; la suite completa de seis pruebas había pasado previamente. Se repitió también la validación estática.
