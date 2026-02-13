import { model, Schema } from "mongoose";

const DashboardAuditSchema = new Schema(
  {
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    action: { type: String, required: true },
    meta: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false,
    updatedAt: false
  }
);

export default model("DashboardAudit", DashboardAuditSchema);
