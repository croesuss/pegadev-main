process.on("unhandledRejection", (reason) => console.log("rejection", reason));
process.on("uncaughtException", (error) => console.log("Error", error));
import "@global/interfaces/index";
import config from "@global/config";
import Client from "./Client";
import { glob } from "glob";
import InviteManager from 'discord-invite';
import connectMongo from "@global/db/connect";
import startInternalApi from "./internal/api.js";

const paths = {
  commands: {
    contextMenu: await glob("./commands/context-menu/**/*.js", { cwd: import.meta.dirname }),
    message: await glob("./commands/message/**/*.js", { cwd: import.meta.dirname }),
    slash: await glob("./commands/slash-command/**/*.js", { cwd: import.meta.dirname }),
  },
  events: await glob("./events/**/*.js", { cwd: import.meta.dirname }),
};

await connectMongo();

const client = new Client();
client.InviteManager = new InviteManager(client);
startInternalApi(client);

client.read(paths);
client.login(config.discord.token).catch(function(error) {
  console.log({ type: "error", prefix: "Client", message: "Login Failed", error });
});