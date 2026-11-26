# WowBrowser Catalog

Feed público y dashboard de WowBrowser. GitHub Pages lo publica tanto en `https://wowbrowser.pixplix.com/` como en `https://microbica.github.io/WowBrowser-Catalog/`.

- `catalog.json` — lista de servidores (schema usado por la app).
- `index.html`, `app.js`, `styles.css` y `splash.js` — dashboard completo.
- `version.json` — manifiesto de versión y enlaces de distribución; no está enlazado visiblemente desde el dashboard.
- `update.html` y `update.js` — página de actualización oculta, independiente del dashboard.
- `robots.txt` — solicita a los rastreadores no acceder a `version.json` ni a `update.html`.

Para actualizar el catálogo: edita `catalog.json`, commit y push. La app lo descarga al arrancar (con caché local para modo offline).

## Servidores incluidos

Comprobación realizada el **25-11-2026 (UTC)**. Se verificaron las webs oficiales, las URLs de juego y los recursos o APIs públicas; no se crearon cuentas ni se jugaron partidas. Se excluyen clientes locales, cloud gaming, servidores ceridos, directorios y proyectos sin acceso web confirmado.

| Servidor | Versión | Idioma | Acceso |
|---|---|---|---|
| Lasthavens | WotLK 3.3.5a | Inglés | https://lasthavens.com/play |
| Keldurn — Classic | Vanilla 1.12.1 | Inglés / español | https://play.keldurn.com/ |
| Keldurn — Ascension | WotLK 3.3.5 custom | Inglés / español | https://ascension.keldurn.com/ |
| Shadopan | MoP 5.4.8 | Inglés / multilingüe | https://play.shadopan.com/ |
| WoW Perú Land | WotLK 3.3.5a, fase Vanilla | Español | https://play.wowperuland.com/ |
| Grimfall WoW — Classless y Conquest | WotLK 3.3.5a custom | Inglés | https://webclient-live.grimfallwow.com/?mode=embed |
| Club WoW — Main y Arena | WotLK 3.3.5a custom | Inglés | https://clubwow.gg/wow/ |
| Gravespire | WotLK 3.3.5a | Inglés | https://play.gravespire.com/ |
| FrostEvil — WotLK | WotLK 3.3.5a | Inglés / multilingüe | https://frostevil.eu/play/ |
| FrostEvil — TBC | TBC 2.4.3 | Inglés / multilingüe | https://frostevil.eu/tbc/play/ |
| WoW Kraken — Classic y Vanilla+ | Vanilla / Vanilla+ | Ruso / inglés | https://wow-kraken.ru/classic-browser-test/?lang=en |

La disponibilidad puede cambiar. Algunos proyectos están en desarrollo o beta y varios exigen una cuenta gratuita. Son servidores no oficiales: utiliza credenciales únicas y no introduzcas una cuenta de Battle.net.

## Contador global de clics

Cada tarjeta muestra los clics globales acumulados al abrir ese servidor. El dashboard consulta `/api/stats` y envía un `POST` anónimo a `/api/servers/:id/click` cuando se pulsa «Abrir cliente». Los servidores añadidos manualmente no se contabilizan.

El backend está en `worker/`: un Cloudflare Worker con D1 guarda únicamente el ID del servidor y un contador entero. No guarda IP, cookies, identificadores de usuario, URL completa ni historial. Las instrucciones de despliegue y la lista de servidores permitidos están en `worker/README.md` y `worker/wrangler.toml`.

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
cd worker && npm test
```
