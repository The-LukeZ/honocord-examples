# Node.js Server Example

Honocord mounted inside an existing Hono app, served with `@hono/node-server`.

## Features

- Mounting `bot.interactionsHandler` on your own route next to other routes
- Passing `process.env` as bindings so Honocord can read `DISCORD_*` from `c.env`
- `/ping`, `/color` (string select menu, updating the message), `/admin stats|echo` (subcommands, deferred reply, follow-up)
- `/admin` as a guild command when `DEV_GUILD_ID` is set
- `MemoryCacheAdapter` from `honocord/cache/memory`
- Middleware that sets a typed custom variable

## Setup

```bash
cp .env.example .env    # fill in your credentials
pnpm register           # register commands with Discord
pnpm dev                # http://localhost:3000, restarts on changes
```

Expose the server (e.g. `cloudflared tunnel --url http://localhost:3000`) and set the
**Interactions Endpoint URL** to `https://<your-url>/interactions`.

## Routes

- `GET /` - greeting
- `GET /health` - health check
- `POST /interactions` - Discord interactions
