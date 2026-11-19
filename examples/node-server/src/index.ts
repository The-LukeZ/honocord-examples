import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { Honocord } from "honocord";
import { MemoryCacheAdapter } from "honocord/cache/memory";
import * as handlers from "./handlers";
import type { Context, Env, Variables } from "./types";

// --- Honocord ---

const cache = new MemoryCacheAdapter({
  ttl: 300, // seconds
  cleanupInterval: 600, // seconds
});

const bot = new Honocord()
  .withCache(() => cache)
  .use<Context>(async (c, next) => {
    c.set("requestId", crypto.randomUUID().slice(0, 8));
    await next();
  });

bot.loadHandlers(Object.values(handlers));

// --- Your existing Hono app ---

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.use(logger());
app.get("/", (c) => c.text("Hello from Hono!"));
app.get("/health", (c) => c.json({ ok: true }));

// Mount Honocord on any route you like
app.post("/interactions", bot.interactionsHandler);

// --- Node server ---

const port = Number(process.env.PORT ?? 3000);

serve(
  {
    // Honocord reads DISCORD_TOKEN and DISCORD_PUBLIC_KEY from `c.env`,
    // so pass process.env as the bindings.
    fetch: (req) => app.fetch(req, process.env as unknown as Env),
    port,
  },
  (info) => console.log(`Listening on http://localhost:${info.port}`),
);
