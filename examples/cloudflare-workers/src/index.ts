import { AnyHandler, Honocord } from "honocord";
import * as handlers from "./handlers";

const bot = new Honocord({ debugRest: true, isCFWorker: true });

// Load all handlers
bot.loadHandlers(...(Object.values(handlers) as AnyHandler[]));

// For Cloudflare Workers
export default bot.getApp();
