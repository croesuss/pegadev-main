export default {
  mongo: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pegadev",
  discord: {
    guildId: process.env.DISCORD_GUILD_ID || "",
    token: process.env.DISCORD_TOKEN || "",
    owners: (process.env.DISCORD_OWNERS || "").split(",").filter(Boolean),
    welcomeChannel: process.env.DISCORD_WELCOME_CHANNEL || "",
    InviteLog: process.env.DISCORD_INVITE_LOG || "",
    defaultRole: process.env.DISCORD_DEFAULT_ROLE || ""
  }
};
