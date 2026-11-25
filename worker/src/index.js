const SERVER_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;

function parseList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function allowedServerIds(env) {
  return new Set(parseList(env.SERVER_IDS));
}

function allowedOrigins(env) {
  return new Set(parseList(env.ALLOWED_ORIGINS));
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin || !allowedOrigins(env).has(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "600",
    "Vary": "Origin"
  };
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers
    }
  });
}

function noContent(headers = {}) {
  return new Response(null, { status: 204, headers });
}

function isCrossSite(request) {
  return request.headers.get("Sec-Fetch-Site") === "cross-site";
}

async function rateLimit(request, env) {
  // Enlace opcional de Cloudflare Rate Limiting. No guarda datos en D1.
  if (!env.CLICK_RATE_LIMITER) return true;
  const key = request.headers.get("CF-Connecting-IP") || "unknown";
  const result = await env.CLICK_RATE_LIMITER.limit({ key });
  return result?.success !== false;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return noContent(cors);
    }

    if (url.pathname === "/api/health" && request.method === "GET") {
      return json({ ok: true }, 200, cors);
    }

    if (url.pathname === "/api/stats" && request.method === "GET") {
      if (!env.DB) return json({ error: "unavailable" }, 503, cors);
      try {
        const { results } = await env.DB.prepare(
          "SELECT server_id, clicks FROM server_clicks"
        ).all();
        const serverIds = allowedServerIds(env);
        const counts = Object.fromEntries([...serverIds].map((id) => [id, 0]));
        for (const row of results || []) {
          if (serverIds.has(row.server_id) && Number.isSafeInteger(row.clicks) && row.clicks >= 0) {
            counts[row.server_id] = row.clicks;
          }
        }
        return json({ counts }, 200, {
          ...cors,
          "Cache-Control": "public, max-age=10, s-maxage=20, stale-while-revalidate=60"
        });
      } catch {
        return json({ error: "unavailable" }, 503, cors);
      }
    }

    const match = url.pathname.match(/^\/api\/servers\/([^/]+)\/click$/);
    if (match && request.method === "POST") {
      let serverId;
      try {
        serverId = decodeURIComponent(match[1]);
      } catch {
        return json({ error: "unknown_server" }, 404, cors);
      }
      if (!SERVER_ID_PATTERN.test(serverId) || !allowedServerIds(env).has(serverId)) {
        return json({ error: "unknown_server" }, 404, cors);
      }
      if (isCrossSite(request)) {
        return json({ error: "forbidden" }, 403, cors);
      }
      if (!env.DB) return json({ error: "unavailable" }, 503, cors);
      if (!(await rateLimit(request, env))) {
        return json({ error: "rate_limited" }, 429, {
          ...cors,
          "Retry-After": "60"
        });
      }

      try {
        const row = await env.DB.prepare(
          `INSERT INTO server_clicks (server_id, clicks)
           VALUES (?, 1)
           ON CONFLICT(server_id) DO UPDATE SET clicks = clicks + 1
           RETURNING clicks`
        ).bind(serverId).first();
        return json({ serverId, clicks: row.clicks }, 200, cors);
      } catch {
        return json({ error: "unavailable" }, 503, cors);
      }
    }

    const allowedMethods = url.pathname === "/api/stats"
      ? "GET, OPTIONS"
      : match
        ? "POST, OPTIONS"
        : "GET, POST, OPTIONS";
    return json({ error: "not_found" }, 404, {
      ...cors,
      "Allow": allowedMethods
    });
  }
};
