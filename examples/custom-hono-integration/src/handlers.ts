import {
  ActionRowBuilder,
  ButtonBuilder,
  LabelBuilder,
  ModalBuilder,
  SlashCommandHandler,
  ComponentHandler,
  ModalHandler,
  parseCustomId,
} from "honocord";

// Slash command
const greetCommand = new SlashCommandHandler()
  .setName("greet")
  .setDescription("Sends a greeting")
  .addStringOption((option) =>
    option.setName("name").setDescription("Who to greet").setRequired(true)
  )
  .addHandler(async (interaction) => {
    const name = interaction.options.getString("name", true);
    await interaction.reply({
      content: `Hello, ${name}! 👋`,
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`confirm?${name}`)
              .setLabel("Confirm")
              .setStyle(1)
          )
          .toJSON(),
      ],
    });
  });

// Component handler for buttons
const confirmHandler = new ComponentHandler("confirm").addHandler(
  async (interaction) => {
    const { firstParam } = parseCustomId(interaction.custom_id);
    const action = firstParam!;

    await interaction.update({
      content: `You confirmed: ${action}`,
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId("startreport")
              .setLabel("Report an Issue")
              .setStyle(2)
          )
          .toJSON(),
      ],
    });
  }
);

const startReportHandler = new ComponentHandler("startreport").addHandler(
  async (interaction) => {
    await interaction.showModal(
      new ModalBuilder({
        custom_id: "report",
        title: "Report an Issue",
      }).addLabelComponents(
        new LabelBuilder()
          .setLabel("Reason")
          .setTextInputComponent((t) =>
            t
              .setCustomId("reason")
              .setStyle(1)
              .setPlaceholder("Enter the reason for your report")
              .setRequired(true)
          ),
        new LabelBuilder()
          .setLabel("Details")
          .setTextInputComponent((t) =>
            t
              .setCustomId("details")
              .setStyle(2)
              .setPlaceholder("Enter additional details (optional)")
              .setRequired(false)
          )
      )
    );
  }
);

// Modal handler
const reportHandler = new ModalHandler("report").addHandler(
  async (interaction) => {
    const reason = interaction.fields.getString("reason");
    const details = interaction.fields.getString("details");

    await interaction.reply(
      {
        content: "Report submitted successfully!",
      },
      true
    );

    // Process the report...
    console.log(`Report received: Reason - ${reason}, Details - ${details}`);
  }
);

export { greetCommand, confirmHandler, startReportHandler, reportHandler };
