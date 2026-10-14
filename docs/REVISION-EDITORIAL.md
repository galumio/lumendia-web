# Revisión editorial pendiente

Estado: **no aprobado para publicación sanitaria**. No se atribuye una revisión médica acreditada.

## Integridad de los archivos

- Libro: 83 páginas.
- Cuaderno independiente: 12 páginas.
- Hoja de emergencia gratuita: 1 página.
- ZIP: 38 HTML; la portada se sustituye por una presentación editorial nueva y se conservan 37 cuerpos de lectura.
- Índice: introducción, 25 capítulos, cuatro escenas y cierre/fuentes.
- 50 situaciones numeradas del 1 al 50, agrupadas en ocho temas, con cinco apartados cada una.
- Cuaderno excluido del HTML por decisión del material fuente. Disponible como parte del producto premium; no se presenta como contenido exclusivo adicional a las 83 páginas.

La importación compara hashes del texto retenido antes y después de adaptar enlaces. La comparación con el PDF normaliza espacios, signos y acentos. Las evidencias detalladas están en `.local/inspection.json` y `.local/pdf-comparison.json`.

## Adaptaciones de interfaz autorizadas por el pedido

Se retiraron formularios de email, placeholders publicitarios, llamadas a compra sin destino, navegación duplicada y pie que presentaba Lumendia como proyecto de Galumio. Se conserva la atribución editorial real del libro a Galumio Studio. Se preservan los textos educativos y las advertencias originales.

## Puntos que debe revisar el profesional

No se modificaron recomendaciones clínicas. Esta lista es una selección de pasajes sensibles para revisión, no un diagnóstico de errores:

1. Capítulo 9 y situación 8: dificultad para tragar/atragantamiento; revisar claridad de la distinción entre consulta y emergencia.
2. Situación 19 y hoja gratuita: cambios bruscos y criterios de atención urgente.
3. Situación 48: rechazo de medicación. El original indica consultar al profesional y no ocultar medicamentos ni cambiar administración, dosis u horarios.
4. Situación 50: expresiones de querer morir; verificar adecuación del texto de respuesta y derivación.
5. Capítulo de etapa avanzada: alimentación, confort, decisiones y acompañamiento.
6. Revisar fuentes, actualidad, alcance territorial y consistencia del material completo, incluidos cuaderno y hoja gratuita.

## Requisitos para aprobar

Registrar profesional, fecha, alcance de revisión y referencia a su constancia. Resolver observaciones mediante cambios aprobados, actualizar hashes y conservar un historial editorial. Completar `site.config.json` y `editorialStatus` del libro únicamente cuando exista aprobación real. Revisar también atribución y permisos de reproducción, responsable legal y contacto.

No se publicó ningún contenido ni se crearon repositorios remotos en esta etapa.

## Verificación contra el PDF

Se compararon 459 párrafos de los cuerpos web con el texto extraído del libro: 442 coincidieron tras normalizar espacios, signos y acentos. Los 17 restantes son los ocho resúmenes de los temas, ocho instrucciones para abrir las situaciones y una explicación del índice; todos proceden del ZIP. Los capítulos, escenas y textos de las fichas comparados coinciden. No se reemplazó el HTML por una transcripción del PDF.
