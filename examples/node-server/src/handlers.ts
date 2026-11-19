import {
  ActionRowBuilder,
  ComponentHandler,
  ComponentType,
  SlashCommandHandler,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "honocord";
import type { Context } from "./types";

/** `/ping`: the simplest possible command. */
export const pingCommand = new SlashCommandHandler<Context>()
  .setName("ping")
  .setDescription("Replies with Pong!")
  .addHandler(async (interaction) => {
    await interaction.reply(`🏓 Pong! (request \`${interaction.context.get("requestId")}\`)`);
  });

/**
 * `/color`: replies with a select menu.
 *
 * Shows: string select menus and updating the original message.
 */
export const colorCommand = new SlashCommandHandler<Context>()
  .setName("color")
  .setDescription("Pick your favorite color")
  .addHandler(async (interaction) => {
    const select = new StringSelectMenuBuilder()
      .setCustomId("color")
      .setPlaceholder("Choose a color")
      .addOptions(
        new StringSelectMenuOptionBuilder().setLabel("Red").setValue("red").setEmoji({ name: "🟥" }),
        new StringSelectMenuOptionBuilder().setLabel("Green").setValue("green").setEmoji({ name: "🟩" }),
        new StringSelectMenuOptionBuilder().setLabel("Blue").setValue("blue").setEmoji({ name: "🟦" }),
      );

    await interaction.reply({
      content: "What's your favorite color?",
      components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)],
    });
  });

export const colorSelect = new ComponentHandler<Context, ComponentType.StringSelect>(
  "color",
  ComponentType.StringSelect,
).addHandler(async (interaction) => {
  const [color] = interaction.values;
  await interaction.update({ content: `Nice choice: **${color}**!`, components: [] });
});

/**
 * `/admin stats` and `/admin echo`: subcommands, deferred replies and follow-ups.
 *
 * Registered as a guild command if DEV_GUILD_ID is set (see register.ts).
 */
export const adminCommand = new SlashCommandHandler<Context>()
  .setName("admin")
  .setDescription("Admin utilities")
  .setDefaultMemberPermissions(0) // Only admins by default
  .addSubcommand((sub) => sub.setName("stats").setDescription("Show process stats"))
  .addSubcommand((sub) =>
    sub
      .setName("echo")
      .setDescription("Repeat a message")
      .addStringOption((o) => o.setName("text").setDescription("Text to repeat").setRequired(true)),
  )
  .addHandler(async (interaction) => {
    switch (interaction.options.getSubcommand(true)) {
      case "stats": {
        await interaction.deferReply();
        const mem = process.memoryUsage();
        await interaction.editReply(
          [
            `**Uptime:** ${Math.round(process.uptime())}s`,
            `**Heap used:** ${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB`,
            `**Node:** ${process.version}`,
          ].join("\n"),
        );
        return;
      }
      case "echo": {
        const text = interaction.options.getString("text", true);
        await interaction.reply("Sending...");
        // followUp() is public by default
        await interaction.followUp({ content: text, allowed_mentions: { parse: [] } });
        return;
      }
    }
  });

if (process.env.DEV_GUILD_ID) {
  adminCommand.setGuildIds([process.env.DEV_GUILD_ID]);
}
