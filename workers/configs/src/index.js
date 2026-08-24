/**
 * configs.houbitan.com — tiny runtime config store backed by Cloudflare KV.
 *
 * Routes (path = config key):
 *   GET  /cv_enabled            → { key, value }        (read)
 *   POST /cv_enabled            → { key, value }        (write)
 *        body: { "value": true|false }
 *
 * Only keys in ALLOWED_KEYS are readable/writable, so the store can't be
 * abused to write arbitrary data.
 */

const ALLOWED_KEYS = ['cv_enabled']

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS })
    }

    const url = new URL(request.url)
    const key = url.pathname.replace(/^\/+|\/+$/g, '')

    if (!ALLOWED_KEYS.includes(key)) {
      return json({ error: 'Unknown config key' }, 404)
    }

    if (request.method === 'GET') {
      const raw = await env.CONFIGS.get(key)
      return json({ key, value: raw === 'true' })
    }

    if (request.method === 'POST') {
      let body
      try {
        body = await request.json()
      } catch {
        return json({ error: 'Invalid JSON' }, 400)
      }

      const value = body.value === true || body.value === 'true'
      await env.CONFIGS.put(key, value ? 'true' : 'false')
      return json({ key, value })
    }

    return json({ error: 'Method not allowed' }, 405)
  },
}
