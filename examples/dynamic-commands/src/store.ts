// A tiny JSON file "database" for custom commands. Swap for a real database in production.
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";

export interface CustomCommand {
  /** Discord's ID of the registered guild command */
  id: string;
  guildId: string;
  name: string;
  response: string;
}

const FILE = new URL("../data/commands.json", import.meta.url);

let commands: CustomCommand[] | null = null;

async function load(): Promise<CustomCommand[]> {
  if (commands) return commands;
  commands = existsSync(FILE) ? JSON.parse(await readFile(FILE, "utf8")) : [];
  return commands!;
}

async function save() {
  await mkdir(new URL("./", FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(commands, null, 2));
}

export async function listCommands(guildId: string) {
  return (await load()).filter((c) => c.guildId === guildId);
}

export async function getCommand(guildId: string, name: string) {
  return (await load()).find((c) => c.guildId === guildId && c.name === name);
}

export async function addCommand(command: CustomCommand) {
  const all = await load();
  all.push(command);
  await save();
}

export async function removeCommand(guildId: string, name: string) {
  const all = await load();
  const index = all.findIndex((c) => c.guildId === guildId && c.name === name);
  if (index === -1) return undefined;
  const [removed] = all.splice(index, 1);
  await save();
  return removed;
}
