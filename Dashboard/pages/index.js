import Link from "next/link";
import { getServerSession } from "next-auth";
import Layout from "@/components/Layout";
import { authOptions } from "@/lib/auth";
import { internalFetch } from "@/lib/internalApi";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) return { redirect: { destination: "/login", permanent: false } };

  const { data } = await internalFetch("/api/guilds");
  const guilds = data.guilds || [];

  const checks = await Promise.all(
    guilds.map(async (guild) => {
      const { response } = await internalFetch(`/api/guild/${guild.id}/access?userId=${session.user.id}`);
      return { ...guild, allowed: response.ok };
    })
  );

  return {
    props: {
      user: session.user,
      guilds: checks.filter((g) => g.allowed)
    }
  };
}

export default function HomePage({ user, guilds }) {
  return (
    <Layout user={user}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Guild Listesi</h1>
        <p className="text-sm text-slate-400">Erişimin olan sunucular.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {guilds.map((guild) => (
          <Link key={guild.id} href={`/guild/${guild.id}`} className="rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-indigo-500">
            <div className="flex items-center gap-3">
              {guild.icon ? <img className="h-12 w-12 rounded-md" src={guild.icon} alt={guild.name} /> : <div className="h-12 w-12 rounded-md bg-slate-700" />}
              <div>
                <h2 className="font-semibold">{guild.name}</h2>
                <p className="text-sm text-slate-400">{guild.memberCount ?? 0} üye</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
