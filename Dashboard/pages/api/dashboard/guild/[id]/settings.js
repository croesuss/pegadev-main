import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { internalFetch } from "@/lib/internalApi";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "unauthorized" });

  const guildId = req.query.id;
  const access = await internalFetch(`/api/guild/${guildId}/access?userId=${session.user.id}`);
  if (!access.response.ok) return res.status(403).json({ error: "forbidden" });

  const { response, data } = await internalFetch(`/api/guild/${guildId}/settings`, {
    method: "POST",
    headers: {
      "x-dashboard-user-id": session.user.id
    },
    body: JSON.stringify(req.body)
  });

  return res.status(response.status).json(data);
}
