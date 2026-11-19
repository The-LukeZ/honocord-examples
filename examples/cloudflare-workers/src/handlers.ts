import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentHandler,
  ComponentType,
  ContainerBuilder,
  ContextCommandHandler,
  ContextCommandType,
  LabelBuilder,
  MessageFlags,
  ModalHandler,
  SlashCommandHandler,
  type ModalInteractionResponseCallbackData,
  TextInputStyle,
  parseCustomId,
} from "honocord";
import type { Context } from "./types";

const GREETINGS = ["Hello", "Hi", "Hey", "Howdy", "Good day", "Greetings", "Yo"];

/**
 * `/greet name:<string> greeting:<autocomplete>`
 *
 * Shows: options, autocomplete, custom IDs with params, public replies.
 */
export const greetCommand = new SlashCommandHandler<Context>()
  .setName("greet")
  .setDescription("Greet someone")
  .addStringOption((option) =>
    option.setName("name").setDescription("Who to greet").setRequired(true).setMaxLength(80),
  )
  .addStringOption((option) =>
    option.setName("greeting").setDescription("How to greet them").setAutocomplete(true),
  )
  .addHandler(async (interaction) => {
    const name = interaction.options.getString("name", true);
    const greeting = interaction.options.getString("greeting") ?? "Hello";

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        // "feedback" is the prefix the ComponentHandler below listens to,
        // everything after "?" are params (see parseCustomId)
        .setCustomId(`feedback?${encodeURIComponent(name)}`)
        .setLabel("Send feedback")
        .setStyle(ButtonStyle.Primary),
    );

    // reply() is ephemeral by default, pass `false` to make it public
    await interaction.reply({ content: `${greeting}, ${name}! 👋`, components: [row] }, false);
  })
  .addAutocompleteHandler(async (interaction) => {
    const focused = interaction.options.getFocused();
    const query = String(focused?.value ?? "").toLowerCase();

    await interaction.respond(
      GREETINGS.filter((g) => g.toLowerCase().includes(query))
        .slice(0, 25)
        .map((g) => ({ name: g, value: g })),
    );
  });

/**
 * Button with the `feedback` prefix: opens a modal.
 *
 * Shows: parsing custom IDs, checking the invoking user, modals with all input types.
 */
export const feedbackButton = new ComponentHandler<Context, ComponentType.Button>(
  "feedback",
  ComponentType.Button,
).addHandler(async (interaction) => {
  if (interaction.message.interaction_metadata?.user.id !== interaction.user.id) {
    return interaction.reply("Only the person who ran the command can use this button.");
  }

  const { firstParam } = parseCustomId(interaction.customId);
  const name = decodeURIComponent(firstParam ?? "");

  // Builders and raw JSON can be mixed. Newer modal components
  // (radio group, checkbox group, checkbox) are written as raw JSON here.
  const modal: ModalInteractionResponseCallbackData = {
    custom_id: "feedback",
    title: `Feedback for ${name}`.slice(0, 45),
    components: [
      new LabelBuilder()
        .setLabel("Your message")
        .setTextInputComponent((input) =>
          input
            .setCustomId("message")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("What do you want to say?")
            .setRequired(true)
            .setMaxLength(1000),
        ),
      {
        type: ComponentType.Label,
        label: "Rating",
        component: {
          type: ComponentType.RadioGroup,
          custom_id: "rating",
          required: true,
          options: [
            { label: "Great", value: "great" },
            { label: "Okay", value: "okay" },
            { label: "Bad", value: "bad" },
          ],
        },
      },
      {
        type: ComponentType.Label,
        label: "Topics",
        description: "Pick everything that applies",
        component: {
          type: ComponentType.CheckboxGroup,
          custom_id: "topics",
          required: false,
          options: [
            { label: "Commands", value: "commands" },
            { label: "Buttons", value: "buttons" },
            { label: "Modals", value: "modals" },
          ],
        },
      },
      {
        type: ComponentType.Label,
        label: "Contact me about this",
        component: { type: ComponentType.Checkbox, custom_id: "contact" },
      },
    ],
  };

  await interaction.showModal(modal);
});

/**
 * Modal submit handler for the `feedback` modal.
 *
 * Shows: reading modal fields, Components V2 replies, accessing custom variables.
 */
export const feedbackModal = new ModalHandler<Context>("feedback").addHandler(async (interaction) => {
  const message = interaction.fields.getString("message", true);
  const rating = interaction.fields.getRadioGroupValue("rating", true);
  const topics = interaction.fields.getCheckboxGroupValues("topics") ?? [];
  const contact = interaction.fields.getCheckboxValue("contact") ?? false;

  const container = new ContainerBuilder().addTextDisplayComponents(
    (t) => t.setContent("## Thanks for your feedback!"),
    (t) => t.setContent(`>>> ${message}`),
    (t) =>
      t.setContent(
        [
          `**Rating:** ${rating}`,
          `**Topics:** ${topics.length ? topics.join(", ") : "none"}`,
          `**Contact:** ${contact ? "yes" : "no"}`,
          `-# Handled in ${Date.now() - interaction.context.get("receivedAt")}ms`,
        ].join("\n"),
      ),
  );

  await interaction.reply({ flags: MessageFlags.IsComponentsV2, components: [container] });
});

/**
 * User context menu command ("Apps" > "User info" when right-clicking a user).
 *
 * Shows: context commands and the cache-aware fetcher.
 */
export const userInfoCommand = new ContextCommandHandler<Context, ContextCommandType.User>(ContextCommandType.User)
  .setName("User info")
  .addHandler(async (interaction) => {
    // Served from the Durable Object cache if the user was seen before
    const user = await interaction.fetcher.users.get(interaction.targetUser.id);

    await interaction.reply(
      [
        `**Username:** ${user?.username ?? interaction.targetUser.username}`,
        `**ID:** ${interaction.targetUser.id}`,
        `**Bot:** ${user?.bot ? "yes" : "no"}`,
      ].join("\n"),
    );
  });
