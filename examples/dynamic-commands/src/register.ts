// Registers only /custom-command. Dynamic handlers have no name, so registerCommands skips them.
// Custom commands themselves are created per guild at runtime by /custom-command add.
import { registerCommands } from "honocord";
import * as handlers from "./handlers";

await registerCommands(process.env.DISCORD_TOKEN!, process.env.DISCORD_APPLICATION_ID!, Object.values(handlers));

console.log("Commands registered.");
