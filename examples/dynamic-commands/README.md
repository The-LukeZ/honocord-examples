# Dynamic Commands Example

Per-guild custom commands, created at runtime and handled by Honocord's
[dynamic command handlers](https://honocord.thelukez.com/guides/dynamic-commands).

## How It Works

1. `/custom-command add name:<name> response:<text>` registers a new guild command with Discord and saves it to `data/commands.json`.
2. When someone uses `/<name>`, Honocord finds no named handler for it and falls back to the `DynamicGuildSlashCommandHandler`.
3. That handler looks up the command by guild and name and replies with the stored response.

Also included:

- `/custom-command remove` (with autocomplete) and `/custom-command list`
- A `DynamicGlobalSlashCommandHandler` fallback for unknown commands in DMs

## Setup

```bash
cp .env.example .env    # fill in your credentials
pnpm register           # registers /custom-command
pnpm dev                # http://localhost:3000
```

Expose the server (e.g. `cloudflared tunnel --url http://localhost:3000`) and set the
**Interactions Endpoint URL** to `https://<your-url>/interactions`.

`data/commands.json` is a stand-in for a real database.
