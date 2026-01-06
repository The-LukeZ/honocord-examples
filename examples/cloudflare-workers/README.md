# Honocord Cloudflare Workers Example

This example demonstrates how to deploy a basic Discord bot using HonoCord on Cloudflare Workers.

Refer to the [HonoCord Examples README](../README.md) for detailed setup and deployment instructions.

## Environment Variables

```
DISCORD_APPLICATION_ID=your_application_id_here
DISCORD_PUBLIC_KEY=your_public_key_here
DISCORD_TOKEN=your_bot_token_here
IS_CF_WORKER=true # IMPORTANT
```

## Scripts

- `pnpm run dev` - Run the development server with Wrangler
- `pnpm run deploy` - Deploy the bot to Cloudflare Workers
- `pnpm run register` - Register the bot commands with Discord
- `pnpm cf-typegen` - Generate Cloudflare Worker types for Honocord