import { model, Schema } from "mongoose";

export default model("Setup", new Schema({
  guildId: { type: String, required: true },
  staffs: {
    
  },
  roles: {
    fivem_cheater: { type: String, default: null },
  },
  channels: {
    welcome: { type: String, default: null},
    chat: { type: String, default: null},
    commands: { type: String, default: null},
    coin: { type: String, default: null},
    giveaway: { type: String, default: null},
    botVoice: { type: String, default: null},
  },
  logs: {
    // Guard
    guard_guild: { type: String, default: null }, // Sunucu Güncelleme / URL / Bot Ekleme
    guard_ban: { type: String, default: null }, // Ban / Kick
    guard_role: { type: String, default: null }, // Rol Sil / Oluştur / Düzenle
    guard_member: { type: String, default: null }, // Voice / timeout
    guard_member_role: { type: String, default: null }, // Sağ Tık Rol Ver, Vb.
    guard_channel: { type: String, default: null }, // Kanal Sil / Oluştur / Düzenle
    guard_emoji: { type: String, default: null },
    // Moderation
    name: { type: String, default: null },
    jail: { type: String, default: null },
    mute: { type: String, default: null },
    warn: { type: String, default: null },
    // Event
    voice: { type: String, default: null },
    message: { type: String, default: null },
    ban: { type: String, default: null },
    role: { type: String, default: null },
    invite: { type: String, default: null },
    command: { type: String, default: null},
    
  }
}));