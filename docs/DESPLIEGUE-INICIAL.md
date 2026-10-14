# Estado del despliegue inicial

Actualizado: 2026-10-13T15:26:24.937Z.

GitHub Pages habilitado con GitHub Actions y dominio personalizado lumendia.com.ar. Presentación institucional publicada en http://lumendia.com.ar/.

## Publicación verificada

- Nueva ejecución solicitada por el usuario: https://github.com/galumio/lumendia-web/actions/runs/38421785066. Resultado success tanto en verify como en deploy.
- Commit 012c00e2174c8f82f4645d0111cf56d875b1e438. Los 12 archivos del repositorio coinciden por SHA-256 con el manifiesto aprobado. Artefacto limitado a los 8 archivos de site/.
- Portada, estilos, favicon, robots, sitemap y 404.html públicos coinciden exactamente con los archivos aprobados.
- Las rutas del ebook Alzheimer, ambos PDF premium, PDF de emergencia, contenido fuente y originales privados devuelven 404.
- No se modificó Galumio, otros repositorios, Cloudflare ni NIC Argentina.

## DNS comprobado

La delegación realizada por el usuario ya aparece en 1.1.1.1 y 8.8.8.8:

- cartman.ns.cloudflare.com
- hattie.ns.cloudflare.com

Ambos resolutores muestran las cuatro A 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 y www CNAME galumio.github.io. Los registros están en DNS only según el usuario y las IP observadas corresponden a GitHub Pages.

## HTTPS pendiente

HTTPS en el ápice y www devuelve ERR_TLS_CERT_ALTNAME_INVALID. GitHub todavía no muestra certificado; el intento de habilitar https_enforced fue rechazado con HTTP 404: The certificate does not exist yet. No se ignoró la validación TLS.

Siguiente paso: esperar la emisión del certificado por GitHub, volver a comprobar HTTPS y activar Enforce HTTPS en https://github.com/galumio/lumendia-web/settings/pages cuando esté disponible. No hace falta repetir la delegación ni el despliegue. GitHub indica que HTTPS puede tardar hasta una hora después de configurar el dominio: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages .

## Evidencias locales excluidas de publicación

.local/pages-post-delegation.json, .local/dns-post-delegation.json, .local/live-institutional-verification.json e .local/initial-deployment-manifest.json. La biblioteca sanitaria permanece pendiente de aprobación y fuera del despliegue.
