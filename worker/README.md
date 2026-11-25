# Contador global de clics

Worker y base D1 para contar cuántas veces se abre cada servidor desde WowBrowser.

## Privacidad

- Solo se guarda `server_id` y un contador entero en D1.
- No se guardan IP, cookies, identificadores de usuario, URL completa ni marcas de tiempo por clic.
- El Worker no escribe logs de aplicación.
- Cloudflare procesa la petición y puede aplicar sus propias políticas de logs; revisa la retención de tu cuenta.

## Endpoints

- `GET /api/stats` devuelve `{ "counts": { "grimfall-wow": 12 } }`.
- `POST /api/servers/:id/click` incrementa el contador de un ID permitido.
- `GET /api/health` comprueba que el Worker está disponible.

`SERVER_IDS` en `wrangler.toml` es la lista permitida. Añade aquí cada nuevo servidor del catálogo antes de publicarlo.

## Pruebas locales

```sh
cd worker
npm install
npm test
npx wrangler dev --local --assets ..
```

El servidor local escucha en `http://127.0.0.1:8787`. `--assets ..` sirve el catálogo y el Worker en el mismo origen, por lo que `CLICK_STATS_URL="/api"` funciona sin cambios. Aplica antes la migración local:

```sh
npx wrangler d1 migrations apply wowbrowser-click-counts --local
```

## Despliegue

1. Autenticarse con `npx wrangler login`.
2. Crear D1:

   ```sh
   npx wrangler d1 create wowbrowser-click-counts
   ```

3. Copiar el `database_id` devuelto en `wrangler.toml`.
4. Aplicar la migración remota:

   ```sh
   npx wrangler d1 migrations apply wowbrowser-click-counts --remote
   ```

5. Desplegar el Worker y su ruta `/api/*`:

   ```sh
   npm run deploy
   ```

El script incluye el ID de la zona `pixplix.com` para registrar la ruta de forma explícita. Intercepta solo `wowbrowser.pixplix.com/api/*`; el resto del catálogo sigue sirviéndose desde su hosting actual.

## Protección contra abuso

Además de la lista permitida y la validación same-origin, configura una regla **Rate Limiting** de Cloudflare para `/api/servers/*/click`. Recomendado: 60 peticiones por minuto por IP. La IP se usa solo en la regla de Cloudflare, no en D1.
