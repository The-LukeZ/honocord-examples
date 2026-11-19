import {
  ApplicationCommandType,
  DynamicGlobalSlashCommandHandler,
  DynamicGuildSlashCommandHandler,
  InteractionContextType,
  SlashCommandHandler,
} from "honocord";
import { addCommand, getCommand, listCommands, removeCommand } from "./store";

const NAME_PATTERN = /^[-_\p{L}\p{N}]{1,32}$/u;

/**
 * `/custom-command add|remove|list`
 *
 * A normal, statically registered command that creates and deletes guild commands at runtime.
 * Honocord has no named handler for those, so they end up in the dynamic handler below.
 */
export const customCommandAdmin = new SlashCommandHandler()
  .setName("custom-command")
  .setDescription("Manage this server's custom commands")
  .setContexts(InteractionContextType.Guild)
  .setDefaultMemberPermissions(0) // Only admins by default
  .addSubcommand((sub) =>
    sub
      .setName("add")
      .setDescription("Create a custom command")
      .addStringOption((o) => o.setName("name").setDescription("Command name").setRequired(true).setMaxLength(32))
      .addStringOption((o) =>
        o.setName("response").setDescription("What the command replies with").setRequired(true).setMaxLength(2000),
      ),
  )
  .addSubcommand((sub) =>
    sub
      .setName("remove")
      .setDescription("Delete a custom command")
      .addStringOption((o) =>
        o.setName("name").setDescription("Command name").setRequired(true).setAutocomplete(true),
      ),
  )
  .addSubcommand((sub) => sub.setName("list").setDescription("List custom commands"))
  .addHandler(async (interaction) => {
    const guildId = interaction.guildId!;
    const api = interaction.fetcher.api;

    switch (interaction.options.getSubcommand(true)) {
      case "add": {
        const name = interaction.options.getString("name", true).toLowerCase();
        const response = interaction.options.getString("response", true);

        if (!NAME_PATTERN.test(name)) {
          return interaction.reply("Names may only contain letters, numbers, `-` and `_`.");
        }
        if (name === "custom-command" || (await getCommand(guildId, name))) {
          return interaction.reply(`\`/${name}\` already exists.`);
        }

        await interaction.deferReply();
        const created = await api.applicationCommands.createGuildCommand(interaction.applicationId, guildId, {
          type: ApplicationCommandType.ChatInput,
          name,
          description: "Custom command",
        });
        await addCommand({ id: created.id, guildId, name, response });
        return interaction.editReply(`Created \`/${name}\`. It may take a moment to show up.`);
      }

      case "remove": {
        const name = interaction.options.getString("name", true);
        const removed = await removeCommand(guildId, name);
        if (!removed) return interaction.reply(`\`/${name}\` doesn't exist.`);

        await api.applicationCommands.deleteGuildCommand(interaction.applicationId, guildId, removed.id);
        return interaction.reply(`Deleted \`/${name}\`.`);
      }

      case "list": {
        const commands = await listCommands(guildId);
        return interaction.reply(
          commands.length ? commands.map((c) => `- \`/${c.name}\``).join("\n") : "No custom commands yet.",
        );
      }
    }
  })
  .addAutocompleteHandler(async (interaction) => {
    const query = String(interaction.options.getFocused()?.value ?? "").toLowerCase();
    const commands = await listCommands(interaction.guildId!);
    await interaction.respond(
      commands
        .filter((c) => c.name.includes(query))
        .slice(0, 25)
        .map((c) => ({ name: c.name, value: c.name })),
    );
  });

/**
 * Catches every slash command used in a guild that has no named handler.
 * Looks the command up by name and replies with the stored response.
 */
export const customCommandRunner = new DynamicGuildSlashCommandHandler().addHandler(async (interaction) => {
  const command = await getCommand(interaction.guildId!, interaction.commandName);

  if (!command) {
    // Registered with Discord but not in our store (e.g. data was wiped)
    return interaction.reply("This command is no longer configured.");
  }

  await interaction.reply({ content: command.response, allowed_mentions: { parse: [] } }, false);
});

/** Fallback for unknown commands used in DMs (or if no guild dynamic handler existed). */
export const unknownCommandFallback = new DynamicGlobalSlashCommandHandler().addHandler(async (interaction) => {
  console.warn(`Unknown command "/${interaction.commandName}"`);
  await interaction.reply("This command isn't available right now.");
});
