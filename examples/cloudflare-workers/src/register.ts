// Run locally with `pnpm register`, not on the Worker.
import { registerCommands } from "honocord";
import * as handlers from "./handlers";

await registerCommands(process.env.DISCORD_TOKEN!, process.env.DISCORD_APPLICATION_ID!, Object.values(handlers));

console.log("Commands registered.");
