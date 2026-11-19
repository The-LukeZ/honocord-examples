import { ApplicationIntegrationType, ApplicationWebhookEventType } from "discord-api-types/v10";
import { API, AttachmentBuilder, REST, WebhookEventHandler } from "honocord";

/**
 * Sent when a user installs the app (to a guild or their account).
 *
 * Worker mode (`true`): Honocord acknowledges Discord with 200 right away and runs this
 * handler in `waitUntil`, so it can take longer than Discord's 3 second limit.
 * The type parameters are <EventType, Env, Variables, ForWorker>.
 */
export const authorizedHandler = new WebhookEventHandler<ApplicationWebhookEventType.ApplicationAuthorized, Env, {}, true>(
  ApplicationWebhookEventType.ApplicationAuthorized,
  true,
).addHandler(async (c) => {
  // c.var.data is the event body ({ type, timestamp, data })
  const { data } = c.var.data;
  const api = new API(new REST().setToken(c.env.DISCORD_TOKEN));

  if (data.integration_type === ApplicationIntegrationType.GuildInstall) {
    console.log(`Added to guild ${data.guild?.name} (${data.guild?.id}) by ${data.user.username}`);
    return;
  }

  // User install: send them a welcome DM with a file attached
  try {
    const dm = await api.users.createDM(data.user.id);

    const file = new AttachmentBuilder(Buffer.from(`Hi ${data.user.username}, thanks for installing!\n`))
      .setName("welcome.txt")
      .setDescription("A welcome note");

    await api.channels.createMessage(dm.id, {
      content: "Thanks for installing the app! 🎉",
      // resolve() turns builders into the `files` + `attachments` the REST API expects
      ...AttachmentBuilder.resolve(file),
    });
  } catch (error) {
    // e.g. the user has DMs disabled
    console.error("Failed to DM user:", error);
  }
});

/**
 * Sent when a user removes the app from their account.
 * Not sent for guild installs.
 */
export const deauthorizedHandler = new WebhookEventHandler<
  ApplicationWebhookEventType.ApplicationDeauthorized,
  Env,
  {},
  true
>(ApplicationWebhookEventType.ApplicationDeauthorized, true).addHandler(async (c) => {
  console.log(`App removed by ${c.var.data.data.user.username}`);
});

/** Sent when a user buys an SKU (monetization). */
export const entitlementHandler = new WebhookEventHandler<ApplicationWebhookEventType.EntitlementCreate, Env, {}, true>(
  ApplicationWebhookEventType.EntitlementCreate,
  true,
).addHandler(async (c) => {
  const entitlement = c.var.data.data;
  console.log(`User ${entitlement.user_id} got SKU ${entitlement.sku_id}`);
  // Grant the purchase in your database here
});
