# Publicación en GitHub Pages, Cloudflare y NIC Argentina

Estado: preparación local. No se creó un repositorio remoto, zona Cloudflare ni delegación. No se modificó Galumio. Las operaciones externas requieren tu autorización, conforme al pedido.

## Antes de publicar

1. Aprobar el material sanitario con profesional identificado y conservar constancia. Completar los campos editoriales y el estado del libro.
2. Completar identidad del responsable, contacto, jurisdicción, permisos de reproducción y textos legales definitivos. No basta con cambiar los indicadores de configuración: actualizar las páginas redactadas como borradores.
3. Copiar exclusivamente `Hoja-de-emergencia-del-cuidador.pdf` a `resources/` después de aprobarla. Los otros PDF y el ZIP permanecen en `.local/` y fuera de Git.
4. Configurar enlace real de compra si existe; sin él, el kit permanece sin botón. Publicidad y analítica siguen desactivadas.
5. Ejecutar `npm ci`, `npm run check`, `npm run build:preview`, `npm run build`, `npm test`, `npm run test:browser`, `npm run release:check` y `npm audit`. Revisar el informe y el contenido de `dist/`.
6. Verificar archivos de Git y ausencia de secretos, originales privados y PDF premium, incluido el historial. No hacer público el repositorio mientras las fuentes sanitarias sigan pendientes.

## GitHub

Crear un repositorio independiente llamado `lumendia-web`. No se detectó GitHub CLI disponible ni se configuró acceso remoto. Podés crearlo desde tu cuenta de GitHub; comenzar privado mientras se revisa el contenido. Para GitHub Pages gratuito, publicar el repositorio solo una vez aprobados el contenido y la inspección de seguridad.

Antes del primer push:

```powershell
git status --short
git ls-files
npm run release:check
```

Agregar un remoto con la URL REAL del repositorio creado; no usar nombres de usuario de ejemplo como destino. Hacer push de la rama principal cuando la revisión esté completa. En Settings > Pages, elegir GitHub Actions. El workflow preparado se ejecuta manualmente; no despliega con cada push.

Configurar `lumendia.com.ar` como dominio personalizado en GitHub Pages y verificar su propiedad con el TXT que GitHub genere para tu cuenta. El archivo CNAME incluido documenta el dominio, pero con Actions debe configurarse también en Settings. Consultar [documentación oficial de GitHub](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Cloudflare Free

Agregar únicamente `lumendia.com.ar` a una cuenta autorizada y seleccionar Free. Revisar los registros importados antes de cambiarlos. Cloudflare asigna dos servidores de nombres reales: copiarlos exactamente desde Overview/DNS. **Aún no se obtuvieron porque no se creó ni se accedió a la zona. No hay valores para inventar o cargar en NIC.**

Con el dominio personalizado ya asociado en GitHub, preparar estos registros DNS, inicialmente con proxy desactivado (DNS only / nube gris):

| Tipo | Nombre | Destino |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | Dominio REAL de Pages de tu usuario u organización, terminado en `.github.io` |

El CNAME no lleva nombre de repositorio ni ruta. Confirmar que no haya registros A/AAAA antiguos en conflicto. No usar comodines. Mantener los registros de otros servicios que existan y no hayan sido autorizados para modificar.

Los valores A y la redirección del dominio están documentados por [GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). El proceso de asignación de NS está en [Cloudflare](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/).

## Delegación en NIC Argentina

Solo después de tener los dos NS asignados y tu autorización:

1. Entrar personalmente a NIC Argentina y acceder a Trámites a Distancia.
2. En Lista de dominios, elegir **Delegar** para `lumendia.com.ar`.
3. Elegir **Agregar una nueva delegación**, cargar cada servidor real de Cloudflare y guardar. Deben ser al menos dos.
4. Revisar dominio y nombres; pulsar **Ejecutar Cambios** para confirmar.

No es autodelegación. No compartir Clave Fiscal ni contraseñas. No seleccionar ni modificar dominios de Galumio. Fuente: [instructivo oficial de NIC Argentina](https://nic.ar/es/ayuda/instructivos/delegacion-de-dominios).

## Verificación y HTTPS

```powershell
Resolve-DnsName lumendia.com.ar -Type NS -Server 1.1.1.1
Resolve-DnsName lumendia.com.ar -Type A -Server 1.1.1.1
Resolve-DnsName www.lumendia.com.ar -Type CNAME -Server 1.1.1.1
curl.exe -I https://lumendia.com.ar
curl.exe -I https://www.lumendia.com.ar
```

Los NS deben coincidir con los dos asignados, A con los destinos indicados y www con el dominio real de Pages. Esperar la verificación DNS y emisión del certificado en GitHub Pages; luego habilitar Enforce HTTPS. El dominio principal es el ápice `lumendia.com.ar`; GitHub realiza la redirección de www cuando ambos registros están correctamente configurados. No afirmar que está publicado hasta comprobar respuesta HTTPS, redirección, certificado, páginas de lectura y descarga.

Agregar sitemap en Search Console una vez verificado el sitio. No activar AdSense ni Analytics sin IDs reales, políticas revisadas y consentimiento aplicable.

## Primer commit, después de la revisión

Antes de agregar archivos ejecutar `npm run audit:repository`, que revisa los candidatos de Git, hashes de los PDF premium y patrones comunes de credenciales. La comprobación no sustituye la revisión humana ni el control de un historial remoto existente.

```powershell
npm run audit:repository
git add .github .gitignore README.md astro.config.mjs docs package.json package-lock.json playwright.config.ts public scripts site.config.json src tests tsconfig.json
# Agregar resources solo cuando contenga la hoja gratuita aprobada.
git diff --cached --stat
git diff --cached --name-only
git commit -m "Implementar biblioteca digital Lumendia"
```

Usar tu identidad Git configurada, sin inventar autor. Luego añadir la URL real del remoto y hacer push. No se realizó commit ni push durante la preparación local.
