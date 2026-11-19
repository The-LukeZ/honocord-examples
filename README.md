# Honocord Examples

Example applications for [Honocord](https://honocord.thelukez.com) v4.

## Examples

| Example                                             | Runtime            | Shows                                                                                              |
| --------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------- |
| [cloudflare-workers](./examples/cloudflare-workers) | Cloudflare Workers | Slash commands, autocomplete, buttons, modals, context menus, middleware, Durable Object cache     |
| [node-server](./examples/node-server)               | Node.js            | Mounting Honocord in an existing Hono app, select menus, subcommands, guild commands, memory cache |
| [webhook-events](./examples/webhook-events)         | Cloudflare Workers | Webhook events (app authorized/deauthorized, entitlements), sending files with `AttachmentBuilder` |
| [dynamic-commands](./examples/dynamic-commands)     | Node.js            | Per-guild custom commands created at runtime, handled by dynamic command handlers                  |

## Getting Started

1. Clone and install:

   ```bash
   git clone https://github.com/The-LukeZ/honocord-examples.git
   cd honocord-examples
   pnpm install
   ```

2. Go to an example and create its `.env`:

   ```bash
   cd examples/cloudflare-workers
   cp .env.example .env
   # Fill in your Discord credentials
   ```

3. Follow the example's README.

Typecheck every example from the root with `pnpm typecheck`.

## Prerequisites

- Node.js 24+
- pnpm 12 (or any package manager)
- A Discord application from the [Developer Portal](https://discord.com/developers/applications)
- A Cloudflare account for the Workers examples

## Environment Variables

Every example needs these:

```env
DISCORD_APPLICATION_ID=your_application_id
DISCORD_PUBLIC_KEY=your_public_key
DISCORD_TOKEN=your_bot_token
```

## Exposing Your Local Server

Discord needs a public HTTPS URL. While developing, use a tunnel:

```bash
cloudflared tunnel --url http://localhost:8787  # or the port of the example
```

Then set the **Interactions Endpoint URL** (or the **Webhooks** URL for webhook events) in the Developer Portal.
