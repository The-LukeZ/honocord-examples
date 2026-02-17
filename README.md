# Honocord Examples

A collection of example applications demonstrating how to use [Honocord](https://honocord.thelukez.com).

## Examples

- **[cloudflare-workers](./examples/cloudflare-workers)** - Basic bot deployed on Cloudflare Workers
- **[custom-hono-integration](./examples/custom-hono-integration)** - Using Honocord with an existing Hono app
- **[webhook-events](./examples/webhook-events)** - Responding to Discord webhook events

## Getting Started

1. Clone this repository:

```bash
git clone https://github.com/The-LukeZ/honocord-examples.git
cd honocord-examples
```

2. Install dependencies:

```bash
pnpm install
```

3. Navigate to an example:

```bash
cd examples/cloudflare-workers
```

4. Copy the environment file and configure:

```bash
cp .env.example .env
# Edit .env with your Discord credentials
```

## Prerequisites

- Node.js 22+
- pnpm or whatever package manager you prefer
- A Discord application (get credentials from [Discord Developer Portal](https://discord.com/developers/applications))
- Cloudflare account (for deployment, if using Cloudflare Workers)

## Environment Variables

Each example needs these environment variables:

```env
DISCORD_APPLICATION_ID=your_application_id
DISCORD_TOKEN=your_bot_token
DISCORD_PUBLIC_KEY=your_public_key
IS_CF_WORKER=true # omit if not deploying to Cloudflare Workers
```
