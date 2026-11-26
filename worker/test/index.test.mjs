import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import worker from "../src/index.js";

const catalog = JSON.parse(readFileSync(new URL("../../catalog.json", import.meta.url), "utf8"));
const catalogServerIds = catalog.map((server) => server.id);
const zeroCounts = Object.fromEntries(catalogServerIds.map((id) => [id, 0]));

class MockD1 {
  counts = new Map();

  prepare(sql) {
    return {
      bind: (...params) => ({
        first: async () => {
          const [serverId] = params;
          const clicks = (this.counts.get(serverId) || 0) + 1;
          this.counts.set(serverId, clicks);
          return { clicks };
        }
      }),
      all: async () => ({
        results: [...this.counts].map(([server_id, clicks]) => ({ server_id, clicks }))
      })
    };
  }
}

function environment() {
  return {
    DB: new MockD1(),
    SERVER_IDS: catalogServerIds.join(","),
    ALLOWED_ORIGINS: "https://wowbrowser.pixplix.com,http://localhost:8787"
  };
}

function request(path, options = {}) {
  return new Request("https://wowbrowser.pixplix.com" + path, options);
}

test("responde CORS preflight para el catálogo", async () => {
  const response = await worker.fetch(request("/api/servers/grimfall-wow/click", {
    method: "OPTIONS",
    headers: { Origin: "https://wowbrowser.pixplix.com" }
  }), environment());
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://wowbrowser.pixplix.com");
});

test("devuelve los contadores agregados con ceros iniciales", async () => {
  const env = environment();
  const empty = await worker.fetch(request("/api/stats"), env);
  assert.deepEqual(await empty.json(), { counts: zeroCounts });

  await worker.fetch(request("/api/servers/grimfall-wow/click", { method: "POST" }), env);
  const response = await worker.fetch(request("/api/stats"), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    counts: { ...zeroCounts, "grimfall-wow": 1 }
  });
});

test("incrementa un servidor permitido", async () => {
  const env = environment();
  const first = await worker.fetch(request("/api/servers/wow-peru-land/click", { method: "POST" }), env);
  const second = await worker.fetch(request("/api/servers/wow-peru-land/click", { method: "POST" }), env);
  assert.deepEqual(await first.json(), { serverId: "wow-peru-land", clicks: 1 });
  assert.deepEqual(await second.json(), { serverId: "wow-peru-land", clicks: 2 });
});

test("rechaza identificadores no incluidos en la lista permitida", async () => {
  const env = environment();
  const response = await worker.fetch(request("/api/servers/otro-servidor/click", { method: "POST" }), env);
  assert.equal(response.status, 404);
  assert.equal(env.DB.counts.size, 0);
});

test("rechaza identificadores malformados sin generar un error 500", async () => {
  const env = environment();
  const response = await worker.fetch(request("/api/servers/%E0%A4%A/click", { method: "POST" }), env);
  assert.equal(response.status, 404);
  assert.equal(env.DB.counts.size, 0);
});

test("rechaza solicitudes cross-site", async () => {
  const env = environment();
  const response = await worker.fetch(request("/api/servers/grimfall-wow/click", {
    method: "POST",
    headers: { "Sec-Fetch-Site": "cross-site" }
  }), env);
  assert.equal(response.status, 403);
  assert.equal(env.DB.counts.size, 0);
});

test("no expone contadores de servidores retirados de la lista permitida", async () => {
  const env = environment();
  env.DB.counts.set("servidor-retirado", 5);
  const response = await worker.fetch(request("/api/stats"), env);
  assert.deepEqual(await response.json(), { counts: zeroCounts });
});

test("no expone rutas desconocidas", async () => {
  const response = await worker.fetch(request("/api/desconocido"), environment());
  assert.equal(response.status, 404);
});

test("el catálogo de respaldo coincide con catalog.json", () => {
  const app = readFileSync(new URL("../../app.js", import.meta.url), "utf8");
  const match = app.match(/const seedServers\s*=\s*(\[[\s\S]*?\n\]);/);
  assert.ok(match, "app.js debe declarar seedServers");
  const seeds = Function(`"use strict"; return (${match[1]});`)().map(({ id, name, playUrl, language, region, version, description }) => ({
    id, name, playUrl, language, region, version, description
  }));
  const expected = catalog.map(({ id, name, playUrl, language, region, version, description }) => ({
    id, name, playUrl, language, region, version, description
  }));
  assert.deepEqual(seeds, expected);
});

test("el catálogo y la lista permitida del Worker están sincronizados", () => {
  const config = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
  const match = config.match(/^SERVER_IDS\s*=\s*"([^"]+)"$/m);
  assert.ok(match, "wrangler.toml debe declarar SERVER_IDS");
  assert.deepEqual(match[1].split(","), catalogServerIds);
  assert.equal(new Set(catalogServerIds).size, catalog.length, "los IDs deben ser únicos");
});

test("el catálogo contiene registros completos y URLs HTTPS directas", () => {
  const languages = new Set(["es", "en", "pt", "fr", "de", "other"]);
  const regions = new Set(["americas", "europe", "asia", "oceania", "other"]);
  const versions = new Set([
    "classic", "hardcore", "sod", "tbc", "wotlk", "cata", "mop", "wod", "legion",
    "bfa", "shadowlands", "dragonflight", "warwithin", "midnight", "forever", "other"
  ]);
  for (const server of catalog) {
    assert.match(server.id, /^[a-z0-9][a-z0-9_-]{0,63}$/);
    assert.ok(server.name.trim());
    assert.ok(server.description.trim());
    assert.equal(new URL(server.playUrl).protocol, "https:");
    assert.ok(languages.has(server.language));
    assert.ok(regions.has(server.region));
    assert.ok(versions.has(server.version));
  }
});
