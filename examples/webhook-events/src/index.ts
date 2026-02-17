import { Honocord } from "honocord";
import handler from "./handler";

const bot = new Honocord({ isCFWorker: true });

bot.loadHandlers(handler);

export default bot.getApp({
  interactionsPath: "/interactions", // not actually needed for this example
  webhookPath: "/webhooks", // default is "/webhook" - you can change it to whatever you want
});
