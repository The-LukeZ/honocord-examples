import { Honocord } from "honocord";
import * as handlers from "./handlers";

const bot = new Honocord({ isCFWorker: true });

bot.loadHandlers(Object.values(handlers));

// GET * -> health check, POST /webhook -> Discord webhook events
// (No interaction handlers are loaded, so /interactions is not mounted.)
export default bot.getApp({ webhookPath: "/webhook" });
