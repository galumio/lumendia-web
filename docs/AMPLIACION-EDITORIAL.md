# Primera ampliación: estructura y plan para revisión

Este documento es planificación, no contenido publicable. No asigna autorías ni fechas a futuras obras. No autoriza publicar manuscritos comerciales. La fase actual no crea rutas nuevas ni cambia el despliegue.

## Implementado

- Etiquetas editoriales fuera de los JSON privados: lectura completa, guía con contenido adicional de pago y muestra comercial. IA para docentes se clasifica como guía con contenido adicional; las cuatro muestras conservan su alcance. Cómo estudiar ofrece sus diez capítulos completos, sin prometer plantillas comerciales gratuitas.
- Destacado manual: Cómo estudiar para un final. Si faltara, solo se elige una lectura completa aprobada en español; no se promueve automáticamente una muestra inglesa.
- Categorías limitadas a las publicaciones disponibles en cada salida. Portada y biblioteca enlazan las categorías con contenido y los recursos existentes. La portada muestra ambos recursos gratuitos.
- Aclaración visible en ficha y lectores de IA para docentes: seis prompts disponibles; referencias a 17, 22 y 33 no incluidas. Se conserva literalmente el HTML original.
- Contrato preparatorio `src/lib/editorial-content.mjs`: validación de metadatos, rutas, selección por aprobación y fecha, índices no vacíos y grupos temáticos. No tiene cargador ni generador de páginas conectado.

## Arquitectura pendiente de conectar

| Destino futuro | Modelo y criterio |
|---|---|
| `/guias/` y `/guias/<slug>/` | format=guide; lectura completa organizada por secciones |
| `/tutoriales/` y `/tutoriales/<slug>/` | format=tutorial; una tarea verificable de principio a fin |
| `/tips/` y `/tips/<slug>/` | format=tip; consejo autónomo, URL permanente y archivo |
| `/relatos/` y `/relatos/<slug>/` | format=story; obra original íntegra y derechos acreditados |
| `/temas/` y `/temas/<slug>/` | Colecciones derivadas de contenido elegible; registro editorial de slug/título/introducción por tema, sin crear temas vacíos |

Las URL `/libros/…` no se trasladan. No hay enlaces de navegación a las nuevas secciones hasta que existan contenidos aprobados. Los lectores actuales permanecen operativos.

Dimensiones independientes: `topics` (tema/categoría), `audiences` (públicos), `format`, `language` y `scope`. Los recursos tendrán su propio registro; una herramienta interactiva necesitará un contrato separado, revisión de privacidad y pruebas funcionales. No se incrustan scripts en artículos.

Metadatos comunes: título, descripción, idioma, autor real, publicación y revisión reales, temas, públicos, fuentes, enlaces relacionados y evidencia de derechos. `publishedAt` y `reviewedAt` son null mientras no se conozcan. Autor pendiente no se sustituye por una atribución automática. Aprobación editorial y fecha de publicación son decisiones distintas. No cambiar fechas para simular novedades.

Almacenamiento: borradores y originales en `.local/editorial/`; textos íntegros autorizados para web en `src/content/editorial/<slug>.md` y sus metadatos JSON. Ese directorio no está en `public/` y hoy solo contiene instrucciones. Mantener los JSON de libros excluidos de Git. No mover archivos comerciales ni ampliar exclusiones o listas de PDF permitidos.

Antes de habilitar rutas: adaptador de lectura explícito, comprobación de cuerpo no vacío, Markdown sin HTML arbitrario, resolución de relaciones contra entradas publicables, detección de archivos fuera del directorio, fuentes seguras y ausencia de borradores en salida. La plantilla debe reutilizar Base, consentimiento, estilos y lector accesible. Integrar sitemap e índices desde la misma selección, nunca desde todos los archivos. Mantener publicación por artefacto local; no cambiar workflows.

## Plan de contenidos (no son manuscritos)

Primer lote en español; traducciones posteriores requieren revisión propia. Ningún contenido recibe todavía autor ni fecha. Todos son redacción original nueva y no ampliaciones de los extractos comerciales.

Fuentes que deben revisarse al redactar y probar:

- **F1:** documentación oficial vigente de la herramienta elegida, condiciones de acceso, privacidad y pruebas reproducibles propias con ejemplos ficticios. Elegir herramienta/dispositivo antes de redactar instrucciones de interfaz; no asumir funciones o planes gratuitos.
- **F2:** fuentes primarias de cada dato de ejemplo: documento original, organismo competente o cálculo independiente. Pedir una fuente a la IA no prueba que exista.
- **F3:** [UNESCO, orientación sobre IA generativa en educación](https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research), más la normativa de la institución cuando corresponda. No usar datos identificables del alumnado.
- **F4:** documentación oficial del sistema y de la aplicación para dictado, permisos y transcripción; punto de partida: [dictado en Windows](https://support.microsoft.com/en-us/accessibility/windows/use-voice-typing-to-talk-instead-of-type-on-your-pc) y [privacidad de voz](https://support.microsoft.com/en-gb/windows/privacy/speech-voice-activation-inking-typing-and-privacy). Diferenciar dictado del teclado y conversación por voz; probar en el dispositivo definido.

### Guía y tutoriales

| ID / título | Objetivo y público | Estructura prevista | Extensión | Fuentes | Relación con libros |
|---|---|---|---|---|---|
| G1 · Empezar con la IA: cinco tareas sencillas y cómo revisar las respuestas | Resolver tareas cotidianas sin delegar el criterio; principiantes adultos | Alcance y privacidad; redactar un mensaje; resumir un texto propio; organizar una lista; comprender un concepto; practicar preguntas de estudio; revisar cada resultado; ejercicio y checklist | 2.500–3.500 palabras | F1, F2; F3 para estudio | Complementa IA para el día a día y adultos mayores; enlaza Cómo estudiar y docentes cuando corresponde |
| T1 · Cómo escribir un buen pedido a la IA | Formular objetivo, contexto y resultado; principiantes y docentes | Pedido inicial; contexto no sensible; formato; ejemplo original antes/después; revisión; ejercicio | 800–1.100 | F1, F3 para uso docente | IA para docentes y día a día; no copiar sus prompts comerciales |
| T2 · Cómo comprobar una respuesta de la IA | Separar propuesta y dato verificable; público general | Detectar afirmaciones; abrir fuentes originales; contrastar fecha/ámbito; comprobar cálculo; resolver incertidumbre; checklist | 900–1.200 | F1, F2 | Todas las guías de IA; Cómo estudiar para comprobar materiales |
| T3 · Tu primera conversación con una IA | Completar una primera tarea sencilla; adultos mayores y acompañantes | Requisitos y acceso oficial; orientación de pantalla; primer mensaje; respuesta; corrección; cerrar; límites y privacidad | 900–1.200 | F1; prueba de comprensión con lectores del público | IA cotidiana para adultos mayores; enlaces a T1 y T2 |
| T4 · Cómo pedir ayuda por voz y corregir un pedido | Dictar y corregir sin depender de teclear; adultos mayores y personas que prefieran voz | Dispositivo elegido; permiso; dictado; revisión antes de enviar; corregir palabras; detener micrófono; alternativa escrita | 800–1.100 | F1, F4 | Adultos mayores y T3; no prometer soporte universal |

### Doce tips originales

Cada uno tendrá entre 150 y 250 palabras: situación, acción, ejemplo original probado, límite y enlace para profundizar. No son frases comerciales recicladas ni páginas duplicadas con otra fecha.

| Tip propuesto | Objetivo / público | Estructura específica | Fuentes | Relación |
|---|---|---|---|---|
| 1. Decí para qué necesitás la respuesta | Mejorar pertinencia; principiantes | Pedido ambiguo, objetivo concreto, comparación | F1 | T1; día a día |
| 2. Pedí un ejemplo antes de seguir | Comprender conceptos; adultos mayores | Explicación abstracta, ejemplo cotidiano, comprobar comprensión | F1, F2 | T3; adultos mayores |
| 3. Una tarea por mensaje | Reducir confusión; principiantes | Pedido múltiple, división, siguiente paso | F1 | G1; día a día |
| 4. Elegí el formato de salida | Obtener una lista utilizable; público general | Párrafo, lista, revisión de elementos | F1 | T1; día a día |
| 5. Quitá los datos personales del ejemplo | Practicar sin exponer personas; docentes y familias | Dato identificable ficticio, sustitución, revisión | F1, F3 | IA para docentes; T1 |
| 6. Abrí la fuente antes de confiar | Verificar referencias; estudiantes y docentes | Afirmación, enlace original, contraste | F2 | T2; Cómo estudiar |
| 7. Comprobá las cuentas por separado | Evitar errores numéricos; público general | Cuenta de práctica, cálculo independiente, corrección | F2 | T2; Cómo estudiar |
| 8. Pedí que señale qué falta saber | Detectar información insuficiente; principiantes | Pregunta incompleta, datos faltantes, revisión humana | F1, F2 | T2; día a día |
| 9. Revisá el dictado antes de enviarlo | Evitar transcripciones erróneas; usuarios de voz | Frase ficticia, error, edición antes de enviar | F4 | T4; adultos mayores |
| 10. Decí exactamente qué querés corregir | Mejorar una respuesta; principiantes | Error localizado, corrección solicitada, nueva comprobación | F1, F2 | T1 y T4; día a día |
| 11. Pedí una pregunta de práctica a la vez | Practicar activamente; estudiantes | Tema propio, pregunta, respuesta propia, contraste | F1, F2, F3 | Cómo estudiar; G1 |
| 12. Guardá el pedido que funcionó y su contexto | Reutilizar sin perder condiciones; docentes y público general | Registro local, contexto, fecha de prueba, revisión al reutilizar | F1 | IA para docentes; G1 |

«Tip de IA del día» será un destacado editorial con archivo permanente. No se promete una publicación nueva diaria antes de contar con responsables y calendario. Si rota un tip ya publicado, conservar su fecha original y explicitar que es una selección. Compartir cada URL estable desde Instagram, sin widgets ni rastreo nuevo.

### Dos recursos complementarios

| Recurso | Objetivo / público | Estructura y extensión | Fuentes | Relación |
|---|---|---|---|---|
| R1 · Mi primer pedido a la IA | Preparar un pedido; principiantes y adultos mayores | Una hoja A4, 200–300 palabras más espacios: objetivo, contexto sin datos personales, formato, comprobación | F1; prueba de impresión y comprensión | T1 y T3; muestras de día a día y adultos mayores |
| R2 · Antes de usar una respuesta de la IA | Registrar una revisión; estudiantes, docentes y público general | Una hoja A4, 200–300 palabras: datos, fuentes, fecha/ámbito, cuentas, privacidad, decisión | F2, F3; distinguir de la hoja docente ya existente | T2 y G1; Cómo estudiar e IA para docentes |

Ambos tendrán equivalente HTML accesible. No son formularios enviados a Lumendia. Evitar duplicar la hoja de referencia docente; redactar y diseñar desde cero. PDF solo después de aprobar contenido, revisar accesibilidad, calcular hash y autorizar su inclusión específica.

## SEO y navegación: propuesta, no implementada en esta etapa

1. Descripciones específicas por página, que indiquen tarea, público y alcance. Mantener los títulos de los libros y las URL existentes. Revisar textos genéricos de biblioteca y fichas sin alterar manuscritos.
2. Imagen social institucional propia para portada, temas e índices; no heredar una portada comercial. Preparar diseño con recursos autorizados, texto legible y variantes por idioma; comprobar vista previa antes de incorporarla.
3. Enlaces relacionados declarados por tipo y slug, resueltos solo si existen y están publicados. G1 enlaza T1–T4 y R1–R2; cada tip enlaza su tutorial; libros reciben enlaces a nuevas lecturas cuando estén aprobadas. Temas agrupan formatos y públicos sin duplicar contenido.
4. Búsqueda inicial por título, descripción, tema y público; filtros combinables de idioma y alcance. Después, índice de texto de contenido público, sin HTML ni originales: carga diferida, tamaño medido en móvil, sin servicios externos ni envío de búsquedas. Separar filtros de formato y alcance. Preservar acceso a todas las fichas sin JavaScript.
5. Datos estructurados: la ficha de una muestra debe describir la muestra gratuita (CreativeWork/Article con isPartOf del libro), sin declarar gratuito todo el producto. Las lecturas completas pueden describirse como Book; la guía docente explicitará el alcance parcial. No inventar número de páginas web a partir del PDF, autor, ofertas, valoraciones ni fechas. Revisar este cambio antes de aplicarlo.
6. Equivalencias de idioma mediante un registro explícito y revisión del contenido completo. No inferirlas por slug o título. Hreflang recíproco y canonical propio solo en equivalencias reales; un enlace a otro idioma no equivale por sí solo a una traducción equivalente.
7. Temas con introducción propia y contenido real; enlaces HTML rastreables. Sin páginas vacías, índices de búsqueda indexables ni fechas lastmod generadas a cada build.

Referencias SEO: [contenido útil](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [enlaces rastreables](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [versiones localizadas](https://developers.google.com/search/docs/specialty/international/localized-versions). No hay garantía de posicionamiento ni metas de palabras dictadas por Google. Confirmar acceso a Search Console antes de priorizar por demanda.

## Puertas de revisión y riesgos

1. Revisar esta claridad editorial y el modelo técnico. Nada se publica todavía.
2. Elegir autor/revisor, herramienta y dispositivo para cada tutorial; redactar y probar contenidos originales. Acreditar derechos y fuentes. Fechas solo cuando correspondan.
3. Revisar adaptador Markdown, rutas, temas, relaciones, SEO y seguridad antes de conectar contenido aprobado al build. Probar que un borrador o archivo privado no pueda filtrarse. Mantener el flujo de artefacto local.
4. Autorizar por separado recursos PDF y futuros interactivos. No relajar validadores para admitir extensiones indiscriminadamente.
5. Repetir compilaciones institucional, biblioteca y preview; validadores de enlaces/canonical/sitemap; móvil, teclado y axe; búsqueda; regresiones de todos los libros; hashes del HTML original y recursos; consentimiento ES/EN, cierre, rechazo, retiro y carga única; auditoría npm y del repositorio.

Riesgos principales: confundir completo con muestra, referencias ausentes, derechos de reproducción, capturas obsoletas, datos sensibles en ejemplos, fechas/autorías ficticias, duplicación SEO, índices con borradores y un calendario diario insostenible. Publicidad y Google Analytics permanecen apagados; Cloudflare conserva consentimiento opcional, token, proveedor y almacenamiento actuales.
