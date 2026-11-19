import { serve } from "@hono/node-server";
import { Honocord } from "honocord";
import * as handlers from "./handlers";

const bot = new Honocord();
bot.loadHandlers(Object.values(handlers));

const app = bot.getApp();
const port = Number(process.env.PORT ?? 3000);

serve(
  {
    // Honocord reads DISCORD_TOKEN and DISCORD_PUBLIC_KEY from `c.env`
    fetch: (req) => app.fetch(req, process.env),
    port,
  },
  (info) => console.log(`Listening on http://localhost:${info.port}`),
);
