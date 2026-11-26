-- Conserva los contadores al unificar Keldurn y FrostEvil en una sola tarjeta.
INSERT INTO server_clicks (server_id, clicks)
SELECT 'keldurn', COALESCE(SUM(clicks), 0)
FROM server_clicks
WHERE server_id IN ('keldurn-classic', 'keldurn-ascension')
ON CONFLICT(server_id) DO UPDATE SET clicks = server_clicks.clicks + excluded.clicks;

INSERT INTO server_clicks (server_id, clicks)
SELECT 'frostevil', COALESCE(SUM(clicks), 0)
FROM server_clicks
WHERE server_id IN ('frostevil-wotlk', 'frostevil-tbc')
ON CONFLICT(server_id) DO UPDATE SET clicks = server_clicks.clicks + excluded.clicks;

DELETE FROM server_clicks
WHERE server_id IN ('keldurn-classic', 'keldurn-ascension', 'frostevil-wotlk', 'frostevil-tbc');
