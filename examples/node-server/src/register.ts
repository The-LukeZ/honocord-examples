import { registerCommands } from "honocord";
import * as handlers from "./handlers";

// Global commands are bulk-overwritten, guild commands (here /admin, if DEV_GUILD_ID is set)
// are bulk-overwritten per guild.
await registerCommands(process.env.DISCORD_TOKEN!, process.env.DISCORD_APPLICATION_ID!, Object.values(handlers));

console.log("Commands registered.");
