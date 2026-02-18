import { registerCommands } from "honocord";
import * as handlers from "./handlers";

await registerCommands(
  process.env.DISCORD_TOKEN!,
  process.env.DISCORD_APPLICATION_ID!,
  ...Object.values(handlers),
);
