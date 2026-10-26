/* Gym Tracker · Worker de respaldo en la nube (Cloudflare Workers + KV)
 *
 * Guarda una copia JSON por "código de sincronización". La app calcula en el teléfono
 * el SHA-256 de la frase elegida por el usuario y lo envía en la cabecera X-Sync-Key;
 * aquí se vuelve a derivar la clave de KV con un SALT secreto, de modo que la frase
 * nunca viaja ni se almacena en claro.
 *
 * Rutas (todas bajo /api/backup):
 *   GET    → devuelve la copia {data, savedAt} o {exists:false} si aún no hay copia
 *   PUT    → guarda la copia (cuerpo JSON {data, savedAt}, máx. 4 MB)
 *   DELETE → borra la copia
 */
const MAX_BYTES = 4 * 1024 * 1024;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    // Solo /api/* es del Worker. Cualquier otra ruta se deja pasar a la app (Cloudflare Pages),
    // así una ruta demasiado amplia (p. ej. gym.consultoriaconfia.com/*) no rompe el sitio.
    if (!url.pathname.startsWith('/api/')) return fetch(request);
    if (!url.pathname.endsWith('/api/backup')) return json({ error: 'No encontrado' }, 404, cors);

    const syncKey = request.headers.get('X-Sync-Key') || '';
    if (!/^[a-f0-9]{64}$/.test(syncKey)) return json({ error: 'Falta el código de sincronización' }, 401, cors);
    const kvKey = 'backup:' + (await sha256(`${syncKey}:${env.SALT || ''}`));

    if (request.method === 'GET') {
      const value = await env.GYM_KV.get(kvKey);
      if (!value) return json({ exists: false }, 200, cors);
      return new Response(value, { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...cors } });
    }

    if (request.method === 'PUT') {
      const text = await request.text();
      if (text.length > MAX_BYTES) return json({ error: 'Copia demasiado grande' }, 413, cors);
      let body;
      try { body = JSON.parse(text); } catch (_) { return json({ error: 'JSON no válido' }, 400, cors); }
      if (!body || typeof body !== 'object' || !body.data || typeof body.data !== 'object') return json({ error: 'Formato no válido' }, 400, cors);
      const savedAt = typeof body.savedAt === 'string' ? body.savedAt : new Date().toISOString();
      await env.GYM_KV.put(kvKey, JSON.stringify({ data: body.data, savedAt }));
      return json({ ok: true, savedAt }, 200, cors);
    }

    if (request.method === 'DELETE') {
      await env.GYM_KV.delete(kvKey);
      return json({ ok: true }, 200, cors);
    }

    return json({ error: 'Método no permitido' }, 405, cors);
  },
};

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const headers = {
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Sync-Key',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
  if (origin && allowed.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

function json(obj, status, extra) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra } });
}

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
