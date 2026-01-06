import { BaseHonocordEnv, Honocord, BaseInteractionContext } from "honocord";
import * as handlers from "./handlers";
import { Hono } from "hono";
import { HonoEnv } from "./types";

const bot = new Honocord({ debugRest: true });

// Load all handlers
bot.loadHandlers(...Object.values(handlers));

const app = new Hono<HonoEnv>();

app.get("/", (c) => c.text("Hello from Hono!"));

app.get("/interactions", (c) =>
  c.text("This endpoint is for POST requests only.")
);
app.post("/interactions", bot.handle);

// Used by Bun
export default app;
