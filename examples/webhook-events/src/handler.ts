import { DiscordAPIError } from "@discordjs/rest";
import {
  APIDMChannel,
  ApplicationWebhookEventType,
  Routes,
} from "discord-api-types/v10";
import { REST, WebhookEventHandler, AttachmentBuilder } from "honocord";

const handler = new WebhookEventHandler<
  ApplicationWebhookEventType.ApplicationAuthorized,
  Cloudflare.Env,
  {},
  true
>(
  ApplicationWebhookEventType.ApplicationAuthorized,
  true, // Enable worker mode
).addHandler(async (c) => {
  const { data } = c.var.data;

  const rest = new REST().setToken(c.env.DISCORD_TOKEN);

  let dm: APIDMChannel | undefined;
  try {
    dm = (await rest.post(Routes.userChannels(), {
      body: {
        recipient_id: "123456789012345678",
      },
    })) as APIDMChannel;
  } catch (error) {
    if (error instanceof DiscordAPIError)
      console.error("Discord API Error:", error);
    else console.error("Unexpected Error:", error);
  }

  // just in case
  if (!dm) {
    console.error("Failed to create DM channel");
    return;
  }

  const attachment = new AttachmentBuilder(
    Buffer.from("Hello, world!"),
  ).setName("hello.txt");
  const { files, attachments } = attachment.resolve();

  await rest.post(Routes.channelMessages(dm.id), {
    body: {
      content:
        "Hello! This is a message sent in response to the Application Authorized event.",
      attachments,
    },
    files,
  });
});
