import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Layout({ user, children }) {
  const avatar = user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : null;

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold text-indigo-300">Pega Dashboard</Link>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-slate-300">{user?.username}</p>
              <p className="text-xs text-slate-500">{user?.id}</p>
            </div>
            {avatar ? <img src={avatar} alt="avatar" className="h-9 w-9 rounded-full" /> : null}
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="rounded-md bg-rose-600 px-3 py-1 text-sm">Çıkış</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
