import type { BaseInteractionContext } from "honocord";

/** Bindings passed to `app.fetch()` (see index.ts). Honocord reads the DISCORD_* keys from here. */
export interface Env {
  DISCORD_APPLICATION_ID: string;
  DISCORD_PUBLIC_KEY: string;
  DISCORD_TOKEN: string;
  DEV_GUILD_ID?: string;
}

/** Custom Hono variables, set by the Honocord middleware in index.ts. */
export interface Variables {
  requestId: string;
}

export type Context = BaseInteractionContext<Env, Variables>;
