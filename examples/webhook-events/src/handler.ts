import { REST } from "@discordjs/rest";
import {
  APIDMChannel,
  ApplicationWebhookEventType,
  Routes,
} from "discord-api-types/v10";
import { WebhookEventHandler } from "honocord";

const handler = new WebhookEventHandler<true, Cloudflare.Env>(
  ApplicationWebhookEventType.ApplicationAuthorized,
  true, // Enable worker mode
).addHandler(async (c) => {
  const { data } = c.get("data");

  const rest = new REST().setToken(c.env.DISCORD_TOKEN);

  (await rest.post(Routes.userChannels(), {
    body: {
      recipient_id: "123456789012345678",
    },
  })) as APIDMChannel;

  // No return statement required!
});
