# configs worker

A tiny Cloudflare Worker + KV store for runtime site config flags, served at
`configs.houbitan.com`. Currently holds a single flag, `cv_enabled`, which
controls whether the **CV** link appears in the site navigation for all
visitors — flipped from the `/manage` page without a redeploy.

## API

| Method | Path          | Body                    | Response         |
| ------ | ------------- | ----------------------- | ---------------- |
| `GET`  | `/cv_enabled` | —                       | `{ key, value }` |
| `POST` | `/cv_enabled` | `{ "value": true }`     | `{ key, value }` |

`value` is a boolean. Only keys in `ALLOWED_KEYS` (see `src/index.js`) are
accepted. Both reads and writes are public (no auth) — the flag is low-stakes
(it only toggles whether the CV nav link is shown).

## One-time setup

From this directory (`workers/configs/`), using [wrangler](https://developers.cloudflare.com/workers/wrangler/):

```sh
# 1. Create the KV namespace and copy the printed id into wrangler.toml
npx wrangler kv namespace create CONFIGS

# 2. Deploy (provisions configs.houbitan.com via the custom_domain route)
npx wrangler deploy

# 3. (optional) Seed the initial value
npx wrangler kv key put --binding=CONFIGS cv_enabled false --remote
```

## Deploying updates

```sh
npx wrangler deploy
```

## Adding more flags later

Add the key name to `ALLOWED_KEYS` in `src/index.js` and redeploy. The same
GET/POST endpoints then work for `/<new_key>`.
