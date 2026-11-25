import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

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
    SERVER_IDS: "grimfall-wow,wow-peru-land",
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
  assert.deepEqual(await empty.json(), {
    counts: { "grimfall-wow": 0, "wow-peru-land": 0 }
  });

  await worker.fetch(request("/api/servers/grimfall-wow/click", { method: "POST" }), env);
  const response = await worker.fetch(request("/api/stats"), env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    counts: { "grimfall-wow": 1, "wow-peru-land": 0 }
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
  assert.deepEqual(await response.json(), {
    counts: { "grimfall-wow": 0, "wow-peru-land": 0 }
  });
});

test("no expone rutas desconocidas", async () => {
  const response = await worker.fetch(request("/api/desconocido"), environment());
  assert.equal(response.status, 404);
});
