import { Honocord } from "honocord";
import { DurableObjectCacheAdapter } from "honocord/cache/do";
import * as handlers from "./handlers";
import type { Context } from "./types";

const bot = new Honocord({ isCFWorker: true })
  // Cache users, members, roles and channels from interactions in a Durable Object
  .withCache<Env>((env) => new DurableObjectCacheAdapter(env.CACHE))
  // Middleware runs before every interaction handler
  .use<Context>(async (c, next) => {
    c.set("receivedAt", Date.now());
    await next();
  });

bot.loadHandlers(Object.values(handlers));

// GET * -> health check, POST / and POST /interactions -> Discord interactions
export default bot.getApp();

// The Durable Object class must be exported from the Worker entry point
export { HonocordCacheDO } from "honocord/cache/do";
