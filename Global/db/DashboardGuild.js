import { model, Schema } from "mongoose";

const DashboardGuildSchema = new Schema(
  {
    guildId: { type: String, required: true, unique: true, index: true },
    enabled: { type: Boolean, default: true },
    allowedUsers: { type: [String], default: [] },
    allowedRoles: { type: [String], default: [] },
    features: {
      discordInfo: { type: Boolean, default: true },
      actions: { type: Boolean, default: true }
    }
  },
  {
    timestamps: true
  }
);

export default model("DashboardGuild", DashboardGuildSchema);
