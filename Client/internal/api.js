import http from "node:http";
import { URL } from "node:url";
import connectMongo from "@global/db/connect";
import DashboardGuild from "@global/db/DashboardGuild";
import DashboardAudit from "@global/db/DashboardAudit";

function isLocalRequest(req) {
  const ip = req.socket.remoteAddress;
  return ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1";
}

function sendJson(res, code, payload) {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function getGuildSettings(guildId) {
  const doc = await DashboardGuild.findOneAndUpdate(
    { guildId },
    { $setOnInsert: { guildId } },
    { new: true, upsert: true }
  ).lean();

  return doc;
}

export default function startInternalApi(client) {
  const port = Number(process.env.INTERNAL_API_PORT || 4501);

  const server = http.createServer(async (req, res) => {
    try {
      if (!isLocalRequest(req)) return sendJson(res, 403, { error: "forbidden" });
      await connectMongo();

      const url = new URL(req.url, "http://127.0.0.1");
      const path = url.pathname;
      const method = req.method || "GET";

      if (method === "GET" && path === "/api/guilds") {
        const guilds = client.guilds.cache.map((guild) => ({
          id: guild.id,
          name: guild.name,
          icon: guild.iconURL({ size: 256 }),
          memberCount: guild.memberCount
        }));

        return sendJson(res, 200, { guilds });
      }

      const overviewMatch = path.match(/^\/api\/guild\/([^/]+)\/overview$/);
      if (method === "GET" && overviewMatch) {
        const guildId = overviewMatch[1];
        const guild = await client.guilds.fetch(guildId);
        if (!guild) return sendJson(res, 404, { error: "guild_not_found" });
        await guild.fetch();

        const channels = await guild.channels.fetch();
        const roles = await guild.roles.fetch();

        return sendJson(res, 200, {
          overview: {
            name: guild.name,
            id: guild.id,
            icon: guild.iconURL({ size: 256 }),
            ownerId: guild.ownerId,
            memberCount: guild.memberCount,
            createdAt: guild.createdAt,
            premiumTier: guild.premiumTier,
            premiumSubscriptionCount: guild.premiumSubscriptionCount,
            channelsCount: channels.filter(Boolean).size,
            rolesCount: roles.filter(Boolean).size,
            botPing: client.ws.ping
          }
        });
      }

      const settingsMatch = path.match(/^\/api\/guild\/([^/]+)\/settings$/);
      if (settingsMatch && method === "GET") {
        const guildId = settingsMatch[1];
        const settings = await getGuildSettings(guildId);
        return sendJson(res, 200, { settings });
      }

      if (settingsMatch && method === "POST") {
        const guildId = settingsMatch[1];
        const body = await parseBody(req);
        const userId = req.headers["x-dashboard-user-id"];

        const update = {
          allowedUsers: Array.isArray(body.allowedUsers) ? body.allowedUsers : [],
          allowedRoles: Array.isArray(body.allowedRoles) ? body.allowedRoles : [],
          features: {
            discordInfo: body?.features?.discordInfo !== false,
            actions: body?.features?.actions !== false
          },
          enabled: body?.enabled !== false
        };

        const settings = await DashboardGuild.findOneAndUpdate(
          { guildId },
          { $set: update, $setOnInsert: { guildId } },
          { new: true, upsert: true }
        ).lean();

        await DashboardAudit.create({
          guildId,
          userId: typeof userId === "string" && userId.length ? userId : "system",
          action: "settings.update",
          meta: update
        });

        return sendJson(res, 200, { settings });
      }

      const accessMatch = path.match(/^\/api\/guild\/([^/]+)\/access$/);
      if (accessMatch && method === "GET") {
        const guildId = accessMatch[1];
        const userId = url.searchParams.get("userId");
        if (!userId) return sendJson(res, 400, { error: "user_id_required" });

        const guild = await client.guilds.fetch(guildId);
        if (!guild) return sendJson(res, 404, { error: "guild_not_found" });

        const settings = await getGuildSettings(guildId);
        if (guild.ownerId === userId) {
          return sendJson(res, 200, { allowed: true, reason: "owner" });
        }

        if (settings.allowedUsers.includes(userId)) {
          return sendJson(res, 200, { allowed: true, reason: "allowed_user" });
        }

        let member = null;
        try {
          member = await guild.members.fetch(userId);
        } catch (_error) {
          member = null;
        }

        if (!member) return sendJson(res, 403, { allowed: false, reason: "not_member" });

        const roleAllowed = settings.allowedRoles.some((roleId) => member.roles.cache.has(roleId));
        return sendJson(res, roleAllowed ? 200 : 403, {
          allowed: roleAllowed,
          reason: roleAllowed ? "allowed_role" : "not_authorized"
        });
      }

      sendJson(res, 404, { error: "not_found" });
    } catch (error) {
      sendJson(res, 500, { error: "internal_error", message: error.message });
    }
  });

  server.listen(port, "127.0.0.1", () => {
    console.log({ type: "success", prefix: "InternalAPI", message: `Listening on 127.0.0.1:${port}` });
  });

  return server;
}
