# Cloudflare Workers Example

A Discord bot on Cloudflare Workers with a Durable Object cache.

## Features

- `/greet` with a required option and an autocompleted option
- A button whose custom ID carries data (`feedback?<name>`), parsed with `parseCustomId`
- A modal with a text input, radio group, checkbox group and checkbox
- A Components V2 reply
- A user context menu command ("User info") using the cache-aware `fetcher`
- Middleware that sets a typed custom variable
- `DurableObjectCacheAdapter` from `honocord/cache/do`

## Setup

```bash
cp .env.example .env    # fill in your credentials
pnpm cf-typegen         # regenerate worker-configuration.d.ts after changing wrangler.jsonc or .env
pnpm register           # register commands with Discord
pnpm dev                # http://localhost:8787
```

Expose the dev server (e.g. `cloudflared tunnel --url http://localhost:8787`) and set the
**Interactions Endpoint URL** to `https://<your-url>/interactions`.

## Deploy

```bash
pnpm wrangler secret bulk .env
pnpm deploy
```

## Routes

- `GET *` - health check
- `POST /` and `POST /interactions` - Discord interactions

## Files

- `src/index.ts` - Honocord setup, cache, middleware, Durable Object export
- `src/handlers.ts` - all command, component and modal handlers
- `src/types.ts` - typed interaction context
- `src/register.ts` - command registration (run locally)
