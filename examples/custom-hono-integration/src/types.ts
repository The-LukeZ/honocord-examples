import type { BaseHonocordEnv, BaseInteractionContext } from "honocord";

type MyEnv = {
  MY_VARIABLE: string;
  DISCORD_TOKEN: string;
  DISCORD_PUBLIC_KEY: string;
  DISCORD_APPLICATION_ID: string;
};

export type HonoEnv = BaseHonocordEnv<MyEnv>;
export type MyContext = BaseInteractionContext<MyEnv>;
