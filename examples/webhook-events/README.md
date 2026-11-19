# Webhook Events Example

Receive Discord [webhook events](https://docs.discord.com/developers/events/webhook-events) on Cloudflare Workers.

## Features

- `APPLICATION_AUTHORIZED`: logs guild installs, DMs user installers a welcome message with a file (`AttachmentBuilder`)
- `APPLICATION_DEAUTHORIZED`: logs user uninstalls (Discord only sends this for user installs)
- `ENTITLEMENT_CREATE`: logs purchases
- Worker mode handlers: Honocord answers Discord with `200` right away and runs the handler in `waitUntil`

## Setup

```bash
cp .env.example .env    # fill in your credentials
pnpm cf-typegen         # regenerate worker-configuration.d.ts after changing wrangler.jsonc or .env
pnpm dev                # http://localhost:8788
```

Expose the dev server (e.g. `cloudflared tunnel --url http://localhost:8788`), then in the Developer Portal open
**Webhooks**, set the URL to `https://<your-url>/webhook`, enable events and select the events above.

## Deploy

```bash
pnpm wrangler secret bulk .env
pnpm deploy
```

## Routes

- `GET *` - health check
- `POST /webhook` - Discord webhook events
