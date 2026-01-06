# HonoCord Examples

A collection of example applications demonstrating how to use [HonoCord](https://github.com/yourusername/honocord).

## Examples

- **[cloudflare-workers](./examples/cloudflare-workers)** - Basic bot deployed on Cloudflare Workers
- **[advanced-components](./examples/advanced-components)** - Buttons, select menus, and component interactions
- **[modal-forms](./examples/modal-forms)** - Modal forms and form handling
- **[custom-hono-integration](./examples/custom-hono-integration)** - Using HonoCord with an existing Hono app

## Getting Started

1. Clone this repository:

```bash
git clone https://github.com/yourusername/honocord-examples.git
cd honocord-examples
```

2. Install dependencies:

```bash
pnpm install
```

3. Navigate to an example:

```bash
cd examples/basic-bot
```

4. Copy the environment file and configure:

```bash
cp .env.example .env
# Edit .env with your Discord credentials
```

5. Register commands:

```bash
pnpm register
```

6. Run the development server:

```bash
pnpm dev
```

## Prerequisites

- Node.js 18+
- pnpm
- A Discord application (get credentials from [Discord Developer Portal](https://discord.com/developers/applications))
- Cloudflare account (for deployment)

## Environment Variables

Each example needs these environment variables:

```env
DISCORD_APPLICATION_ID=your_application_id
DISCORD_TOKEN=your_bot_token
DISCORD_PUBLIC_KEY=your_public_key
IS_CF_WORKER=true
```
