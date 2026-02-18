import { AnyHandler, Honocord } from "honocord";
import * as _handlers from "./handlers";
import webhookHandler from "./webhook";

const bot = new Honocord({ debugRest: true, isCFWorker: true });

const handlers = [...Object.values(_handlers), webhookHandler];

// Load all handlers
bot.loadHandlers(handlers);

// For Cloudflare Workers
export default bot.getApp();
