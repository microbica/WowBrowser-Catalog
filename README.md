# WowBrowser Catalog

Feed público y dashboard de WowBrowser. GitHub Pages lo publica tanto en `https://wowbrowser.pixplix.com/` como en `https://microbica.github.io/WowBrowser-Catalog/`.

- `catalog.json` — lista de servidores (schema usado por la app).
- `index.html`, `app.js`, `styles.css` y `splash.js` — dashboard completo.
- `version.json` — manifiesto de versión y enlaces de distribución; no está enlazado visiblemente desde el dashboard.
- `update.html` y `update.js` — página de actualización oculta, independiente del dashboard.
- `robots.txt` — solicita a los rastreadores no acceder a `version.json` ni a `update.html`.

Para actualizar el catálogo: edita `catalog.json`, commit y push. La app lo descarga al arrancar (con caché local para modo offline).

## Banner externo

Al terminar el splash (`wowbrowser:ready`), el dashboard muestra un banner fijo y cerrable solo si `window.__wowbrowser?.native !== true`. Su único CTA lleva a `update.html`, la página propia de descargas para Windows. El banner permanece oculto dentro de la app, reserva espacio para no tapar el catálogo y no guarda su cierre entre sesiones. Sus textos cambian con el idioma de la interfaz (es/en/pt/fr/de).

## Versión y actualización

Dentro de la app, `app.js` lee `version.json` con `cache: "no-store"` y compara esa versión con `window.__wowbrowser.version` (tres o cuatro componentes numéricos, con soporte para versiones previas SemVer). El modal «Nueva versión disponible» solo aparece si la versión remota es mayor. Muestra la versión instalada y la disponible, las notas de la release, un CTA a `update.html` y «Ahora no». Si el consentimiento de ubicación está abierto, el modal espera a que se cierre. Un fallo de red o un JSON inválido no interrumpe el dashboard.

`update.html` es una página oscura y sencilla con `robots: noindex,nofollow`. Lee la versión disponible del manifiesto y mantiene los enlaces de release/EXE/ZIP utilizables aunque falle la consulta. No forma parte del instalador: el instalador solo incluye `offline.html`.

## Releases y descargas

Todos los enlaces de release y descarga usan `releases/latest`, nunca una etiqueta fija:

- Release: `https://github.com/microbica/WowBrowser-Releases/releases/latest`
- Instalador: `https://github.com/microbica/WowBrowser-Releases/releases/latest/download/WowBrowser-win-Setup.exe`
- Portátil: `https://github.com/microbica/WowBrowser-Releases/releases/latest/download/WowBrowser-win-Portable.zip`

Al publicar una versión, marca la release correspondiente como **Latest** en GitHub y conserva exactamente los nombres de archivo `WowBrowser-win-Setup.exe` y `WowBrowser-win-Portable.zip`. Actualiza también `version` en `version.json`. Así los enlaces siguen apuntando a la publicación más reciente sin cambiar el dashboard.

En `update.html`, los botones EXE/ZIP son descargas directas con atributo `download`. Desde un navegador externo descargan el archivo; dentro de WowBrowser delegan en el puente nativo `wowbrowser://open-external`, que solo acepta descargas HTTPS del repositorio público de releases y las abre en el navegador del sistema. Las notas de la release se abren externamente. Los puentes nativos de idioma y preferencias se omiten fuera de la app. No se usan enlaces `file://` ni descargas o actualizaciones automáticas.

## Validación local

```sh
node --check app.js
node --check update.js
node -e "JSON.parse(require('fs').readFileSync('version.json', 'utf8'))"
```
