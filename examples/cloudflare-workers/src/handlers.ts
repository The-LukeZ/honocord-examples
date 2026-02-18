import { APIMessageTopLevelComponent } from "discord-api-types/v10";
import {
  ActionRowBuilder,
  ButtonBuilder,
  LabelBuilder,
  ModalBuilder,
  SlashCommandHandler,
  ComponentHandler,
  ModalHandler,
  parseCustomId,
  ComponentType,
  ModalInteractionResponseCallbackData,
  ContainerBuilder,
  MessageFlags,
} from "honocord";

// Slash command
export const greetCommand = new SlashCommandHandler()
  .setName("greet")
  .setDescription("Sends a greeting")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Who to greet")
      .setRequired(true)
      .setMaxLength(80),
  )
  .addHandler(async (interaction) => {
    const name = interaction.options.getString("name", true);
    const ar = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`confirm?${encodeURIComponent(name)}`)
        .setLabel("Confirm")
        .setStyle(1),
    );
    await interaction.reply({
      content: `Hello, ${name}! 👋`,
      components: [ar],
    });
  });

// Component handler for buttons
export const confirmHandler = new ComponentHandler(
  "confirm",
  ComponentType.Button,
).addHandler(async (interaction) => {
  if (
    interaction.message.interaction_metadata?.user.id !== interaction.user.id
  ) {
    return interaction.reply({
      content: "You cannot confirm this greeting as you did not initiate it.",
      flags: 64, // Ephemeral
    });
  }

  const { firstParam: name } = parseCustomId(interaction.customId) as {
    firstParam: string;
  };

  const modalData: ModalInteractionResponseCallbackData = {
    title: "Send something",
    custom_id: "send",
    components: [
      new LabelBuilder()
        .setLabel("Name")
        .setTextInputComponent((ti) =>
          ti
            .setCustomId("reason")
            .setStyle(1)
            .setPlaceholder("Enter your name")
            .setRequired(true)
            .setValue(decodeURIComponent(name)),
        )
        .toJSON(),
      {
        type: ComponentType.Label,
        label: "This is a label",
        component: {
          type: ComponentType.Checkbox,
          custom_id: "checkbox_1",
        },
      },
      {
        type: ComponentType.Label,
        label: "This is a text input",
        component: {
          type: ComponentType.CheckboxGroup,
          custom_id: "checkbox_group_1",
          required: true,
          options: [
            {
              label: "Option 1",
              description: "This is option 1",
              value: "option_1",
            },
            {
              label: "Option 2",
              value: "option_2",
            },
          ],
        },
      },
      {
        type: ComponentType.Label,
        label: "This is a select menu",
        component: {
          type: ComponentType.RadioGroup,
          custom_id: "radio_group_1",
          required: false,
          options: [
            {
              label: "Option A",
              description: "This is option A",
              value: "option_a",
            },
            {
              label: "Option B",
              value: "option_b",
            },
          ],
        },
      },
    ],
  };

  await interaction.showModal(modalData);
});

// Modal handler
export const reportHandler = new ModalHandler("send").addHandler(
  async (interaction) => {
    const name = interaction.fields.getString("name", true).trim();
    const checkbox = interaction.fields.getCheckboxValue("checkbox_1", true);
    const checkboxGroup = interaction.fields.getCheckboxGroupValues(
      "checkbox_group_1",
      true,
    );
    const radioGroup = interaction.fields.getRadioGroupValue("radio_group_1");

    const container = new ContainerBuilder().addTextDisplayComponents(
      (t) => t.setContent(`Name: ${name}`),
      (t) => t.setContent(`Checkbox? ${checkbox ? "Yes" : "No"}`),
      (t) =>
        t.setContent(`Checkbox Group: ${checkboxGroup.join(", ") || "None"}`),
    );

    if (radioGroup) {
      container.addTextDisplayComponents((t) =>
        t.setContent(`Radio Group: ${radioGroup}`),
      );
    }

    await interaction.reply({
      flags: MessageFlags.IsComponentsV2,
      components: [container],
    });
  },
);
