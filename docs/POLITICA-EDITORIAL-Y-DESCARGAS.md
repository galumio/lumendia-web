# Política editorial y descargas — versión 1

Esta política sustituye la elegibilidad binaria basada en `healthContent`. La implementación común está en `src/lib/publication-policy.mjs`; los registros auditables, en `src/content/editorial-policy.json`. Son datos de confianza del repositorio y necesitan revisión humana antes de incorporarse a una revisión publicable. No se deben aceptar registros suministrados por un artefacto de despliegue.

## Clasificación y aprobación

- **A:** educación general, incluidos ejemplos sanitarios incidentales que no interpreten casos clínicos, diagnostiquen, indiquen tratamientos/dosis o deleguen decisiones de atención en una IA. Requiere aprobación editorial documentada.
- **B:** asesoramiento especializado, manejo de enfermedades o decisiones clínicas. Requiere aprobación editorial y revisión profesional documentada.
- **Mixto/ambiguo/desconocido:** bloqueado hasta resolver su clasificación y las revisiones aplicables. Un aviso de responsabilidad no convierte B en A.
- **Compatibilidad histórica (`legacy`):** no es una nueva categoría ni revisión. Preserva exclusivamente una edición publicada, identificada por hash y procedencia. Una modificación invalida esa compatibilidad y exige clasificación explícita. No se agregan nuevas obras por esta vía.

La clasificación incluye versión de política, categoría, estado, hash de edición, justificación, secciones examinadas y fuentes. El registro de revisión debe contener `status: approved`, responsable real, fecha real válida y no futura, alcance, referencia a constancia, fuentes HTTPS, versión de política, categoría, hash de edición y `classificationHash`. B exige además profesión y acreditación en `professionalReview`. Las constancias privadas quedan fuera del repositorio; se registra una referencia verificable, no información privada innecesaria.

`classificationHash` se calcula con la función homónima sobre categoría, justificación, apartados y fuentes. El hash de edición incluye contenido, metadatos y hashes de recursos del registro de origen. Cualquier cambio debe reconciliarse con la aprobación; no se actualizan automáticamente hashes de aprobación. `healthContent` se conserva como dato de alcance, pero ni su valor falso ni el antiguo `healthReview` aislado habilitan una obra.

Los controles verifican estructura, fechas y correspondencia de edición, no la identidad real ni competencia del revisor. El responsable editorial debe comprobar esas evidencias antes de autorizar el registro. No hay aprobaciones profesionales automáticas.

## IA para el día a día

Se prepara A — educación general con contenido sanitario incidental para la edición `IA_dia_a_dia_ES_SANITARIO`. El registro tiene `status: pending`, `editorialReview: null` y `professionalReview: null`. No hay responsable ni fecha de revisión inventados. La autorización para implementar la política no equivale a aprobar la constancia editorial del libro.

Alcance: créditos y avisos; capítulo 3 (alimentación, alergias, conservación y huevo pasteurizado); capítulo 8 (ítems 112–123, plantilla de medicación, consultas, bienestar y ejemplo de Roberto); derivaciones de capítulos 6, 7 y privacidad del 10. Los ítems 119–123 son bienestar general, no solo tareas administrativas, y esa limitación forma parte de la justificación. No se atribuye carácter ficticio a Roberto.

Fuentes consultadas en esta implementación, sin convertir su consulta en aprobación profesional:
- FDA: https://www.fda.gov/food/buy-store-serve-safe-food/what-you-need-know-about-egg-safety — uso de huevo pasteurizado cuando queda crudo o poco cocido.
- Health Canada: https://www.canada.ca/en/health-canada/services/general-food-safety-tips/food-safety-you.html — olor/sabor no acreditan inocuidad; conservación y manipulación.
- OMS: https://www.who.int/news/item/16-05-2023-who-calls-for-safe-and-ethical-ai-for-health — riesgo de respuestas incorrectas y exposición de datos sensibles. El libro propone completar los datos sanitarios fuera del chat.

Para habilitar la edición completa: registrar aprobación editorial real de esta clasificación y edición, resolver sus observaciones, sin habilitar descargas de esta obra. No basta con cambiar `status`; se requieren todos los campos y hashes coincidentes. Alzheimer conserva su clasificación B pendiente y nunca se habilita por esta implementación.

Mientras la edición completa esté pendiente, el build público conserva la muestra publicada de IA, validada por hash, desde `.local/ia-dia-published-sample.json`. Ese archivo reproduce el JSON del checkout publicado f03673a; no contiene textos nuevos. La vista previa usa exclusivamente la edición SANITARIO completa. Si no se dispone de la fuente histórica exacta, el build no debe sustituirla por una muestra reconstruida: debe detenerse por los enlaces o recursos ausentes.

## Recursos y despliegue

`src/content/approved-resources.json` registra ruta pública, libro, edición, formato, tamaño, SHA-256, estado y evidencia. Los recursos históricos autorizados conservan su autorización; no se incluyen los PDF/EPUB completos de IA para el día a día. Un recurso solo se distribuye si su libro/edición es elegible y el recurso está aprobado. El hash del paquete no reemplaza estos controles.

`scripts/verify-public-artifact.mjs` es compartido por validación local, empaquetado y CI. Comprueba rutas, formatos PDF/EPUB y sus cabeceras, tamaño y hash, archivos faltantes/adicionales, rutas de libros, hashes de cuerpos de lectura y artículos, y exclusión de fuentes privadas. El workflow obtiene este código y los manifiestos desde `github.sha` mediante checkout separado. El paquete no puede autorizarse a sí mismo.

La extracción TAR valida todos los miembros antes de extraer: rechaza rutas absolutas, recorridos `..`, nombres Windows, enlaces, tipos especiales, duplicados y tamaño excesivo. El workflow conserva comprobación SHA-256 global, CNAME, archivos básicos, rechazo de `noindex`, ambiente Pages y dependencia del trabajo de verificación. Preview/dry-run no constituyen autorización.

El empaquetado conserva formato y ruta exacta; la comprobación posterior consulta esas rutas, sin asumir `.pdf`. Los originales y constancias no se suben al repositorio. No se ejecutó publicación durante esta implementación.

## Pruebas y operación

- `node --test tests/*.test.mjs`: matriz A/B/ambiguo, registros históricos, cambios de contenido/clasificación, descargas y regresiones editoriales.
- `python scripts/test-release-archive.py`: rechazo de TAR hostiles.
- `node scripts/build.mjs preview` y `node scripts/validate.mjs .preview`: ensayo completo local.
- `node scripts/build.mjs library` y `node scripts/validate.mjs dist-library`: salida pública conservadora.
- `node scripts/verify-public-artifact.mjs dist-library`: mismo verificador que CI, sin excepción preview.
- Pruebas de navegador para lectura, descargas, accesibilidad, privacidad y conservación de contenidos. GitHub CI real queda pendiente de una futura autorización de push/PR.

No se modifica automáticamente ninguna edición para completar una revisión. Esta política no evalúa por sí misma la corrección médica del texto: exige evidencia acorde con el alcance declarado.

## Distribución online de IA (alcance revisado)

La edición completa se propone exclusivamente para lectura web gratuita y sin registro. `distribution: online-only` impide autorizar descargas de esta obra incluso agregándolas al manifiesto. Los tres maestros SANITARIO y sus hashes se conservan privados; no hay recursos PDF/EPUB del libro en el catálogo ni en el manifiesto público. El borrador de revisión registra alcance, fuentes y hash; responsable, fecha y evidencia permanecen nulos hasta disponer de la constancia real.

Se conserva la verificación central de artefactos, el manifiesto de recursos históricos y la extracción TAR segura: son controles de integridad y privacidad necesarios para aplicar la política en CI. No se agregan nuevos cambios al workflow por este modelo de distribución. El soporte genérico previo de formatos no concede autorización: todo recurso no registrado se rechaza. No se eliminan archivos ni descargas de otros libros.

El enlace histórico Payhip https://payhip.com/b/FmX4P no pudo verificarse en la comprobación actual. No se incorpora un botón comercial ni se afirman precio, formato o disponibilidad. No se encontró un enlace Kindle específico verificable.

## Cierre editorial confirmado — 2026-11-02

El estado pendiente descrito en la preparación anterior queda como historial. El usuario confirmó la aprobación del titular de Galumio Studio para la edición SANITARIO y sus 16 cuerpos web. La constancia persistente es `docs/APROBACION-EDITORIAL-IA-DIA-20261102.txt`; el registro operativo contiene la aprobación A, fecha, responsable por su función y hashes exactos. No se atribuye revisión profesional externa. La edición completa es ahora elegible para build público, exclusivamente online; el lanzamiento continúa sujeto a autorización.

## Aprobación Alzheimer — edición FOCALIZADO_CIERRE

Las referencias anteriores a B pendiente describen el estado histórico. El titular de Galumio Studio confirmó, mediante el usuario, la aprobación editorial A de la edición CIERRE el 2026-11-02, con P1/P2 corregidos. La constancia es `docs/APROBACION-EDITORIAL-ALZHEIMER-20261102.txt`. Los 39 cuerpos se conservan por hash; solo cambia el estado editorial del catálogo. No se atribuye revisión profesional. La regla B continúa vigente para asesoramiento especializado. Esta aprobación prepara lectura online sin descargas y no autoriza el despliegue actual.
