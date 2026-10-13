# Lumendia: presentación institucional temporal

Este repositorio contiene únicamente la presentación institucional pública de Lumendia. No contiene ebooks, PDF, materiales sanitarios, archivos privados ni credenciales. No requiere dependencias de npm ni compilación en la nube.

- Dominio principal previsto: https://lumendia.com.ar
- www redirige al dominio principal una vez configurado GitHub Pages y DNS.
- `site/`: lista cerrada de archivos que se publica.
- `scripts/verify.mjs`: control de contenido y enlaces antes del despliegue.
- `.github/workflows/deploy.yml`: publicación exclusivamente manual.

Verificar: `node scripts/verify.mjs site`.

Después de autorizar la publicación: Settings > Pages > GitHub Actions. Configurar el dominio personalizado `lumendia.com.ar` también en Settings (CNAME no sustituye esa configuración con Actions). Ejecutar manualmente el workflow, revisar el resultado y habilitar Enforce HTTPS cuando el certificado esté disponible.

No agregar la carpeta de desarrollo completa a este repositorio. La biblioteca permanece separada mientras se revisa. El sitio temporal no carga anuncios, analítica, formularios ni scripts.
