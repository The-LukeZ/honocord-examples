# Honocord Cloudflare Workers Example

This example demonstrates how to deploy a basic Discord bot using Honocord on Cloudflare Workers.

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

## Notes

After starting this example, the development server will accept the following routes:

- `GET *` - A simple greeting endpoint
- `POST /interactions` - The Discord interactions endpoint handled by Honocord
- `POST /webhooks` - The webhooks endpoint for receiving events from Discord, handled by Honocord
