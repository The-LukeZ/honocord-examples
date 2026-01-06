import { Honocord } from "honocord";
import * as handlers from "./handlers";

const bot = new Honocord({ debugRest: true });

// Load all handlers
bot.loadHandlers(...Object.values(handlers));

// For Cloudflare Workers
export default bot.getApp();
