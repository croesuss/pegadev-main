import { useState } from "react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth";
import Layout from "@/components/Layout";
import { authOptions } from "@/lib/auth";
import { internalFetch } from "@/lib/internalApi";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: "/login", permanent: false } };

  const guildId = context.params.id;
  const access = await internalFetch(`/api/guild/${guildId}/access?userId=${session.user.id}`);
  if (!access.response.ok) return { props: { forbidden: true, user: session.user, guildId } };

  const [{ data: overviewData }, { data: settingsData }] = await Promise.all([
    internalFetch(`/api/guild/${guildId}/overview`),
    internalFetch(`/api/guild/${guildId}/settings`)
  ]);

  return {
    props: {
      user: session.user,
      guildId,
      overview: overviewData.overview,
      settings: settingsData.settings,
      forbidden: false
    }
  };
}

export default function GuildPage({ user, guildId, overview, settings, forbidden }) {
  const router = useRouter();
  const [form, setForm] = useState(settings || {});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (forbidden) {
    return (
      <Layout user={user}>
        <div className="rounded-lg border border-rose-700 bg-rose-950/20 p-6">
          <h1 className="text-xl font-semibold text-rose-300">403 - Yetkisiz</h1>
          <p className="mt-2 text-sm text-rose-200">Bu guild için dashboard erişim iznin yok.</p>
        </div>
      </Layout>
    );
  }

  async function saveSettings(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      enabled: form.enabled,
      allowedUsers: String(form.allowedUsers || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      allowedRoles: String(form.allowedRoles || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      features: {
        discordInfo: Boolean(form?.features?.discordInfo),
        actions: Boolean(form?.features?.actions)
      }
    };

    const res = await fetch(`/api/dashboard/guild/${guildId}/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    setLoading(false);
    if (!res.ok) return setMessage(json.error || "Kaydedilemedi");
    setMessage("Ayarlar kaydedildi.");
    router.replace(router.asPath);
  }

  return (
    <Layout user={user}>
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h2 className="mb-4 text-lg font-semibold">Guild Overview</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><b>Ad:</b> {overview.name}</li>
            <li><b>ID:</b> {overview.id}</li>
            <li><b>Owner ID:</b> {overview.ownerId}</li>
            <li><b>Üye:</b> {overview.memberCount}</li>
            <li><b>Kanal:</b> {overview.channelsCount}</li>
            <li><b>Rol:</b> {overview.rolesCount}</li>
            <li><b>Boost Tier:</b> {overview.premiumTier}</li>
            <li><b>Boost Sayısı:</b> {overview.premiumSubscriptionCount || 0}</li>
            <li><b>Bot Ping:</b> {overview.botPing} ms</li>
          </ul>
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h2 className="mb-4 text-lg font-semibold">Settings</h2>
          <form className="space-y-4" onSubmit={saveSettings}>
            <label className="block text-sm">
              <span className="mb-1 block text-slate-400">Allowed Users (virgül ile)</span>
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-950 p-2"
                defaultValue={(settings.allowedUsers || []).join(",")}
                onChange={(e) => setForm((prev) => ({ ...prev, allowedUsers: e.target.value }))}
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-slate-400">Allowed Roles (virgül ile)</span>
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-950 p-2"
                defaultValue={(settings.allowedRoles || []).join(",")}
                onChange={(e) => setForm((prev) => ({ ...prev, allowedRoles: e.target.value }))}
              />
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked={settings.enabled !== false} onChange={(e) => setForm((prev) => ({ ...prev, enabled: e.target.checked }))} />
              Dashboard Enabled
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked={settings?.features?.discordInfo !== false} onChange={(e) => setForm((prev) => ({ ...prev, features: { ...prev.features, discordInfo: e.target.checked } }))} />
              Feature: Discord Info
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked={settings?.features?.actions !== false} onChange={(e) => setForm((prev) => ({ ...prev, features: { ...prev.features, actions: e.target.checked } }))} />
              Feature: Actions
            </label>

            <button disabled={loading} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium disabled:opacity-50">{loading ? "Kaydediliyor..." : "Kaydet"}</button>
            {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
          </form>
        </section>
      </div>
    </Layout>
  );
}
