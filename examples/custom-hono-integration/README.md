# Honocord Integration in an Existing Hono App Example

This example demonstrates how to deploy a basic Discord bot using HonoCord within an existing Hono application, deployed with Bun.

## Environment Variables

```
DISCORD_APPLICATION_ID=your_application_id_here
DISCORD_PUBLIC_KEY=your_public_key_here
DISCORD_TOKEN=your_bot_token_here

MY_VARIABLE=some_value
```

## Scripts

- `bun run dev` - Run the development server with Wrangler
- `bun run start` - Start the bot with Bun
- `bun run register` - Register the bot commands with Discord
