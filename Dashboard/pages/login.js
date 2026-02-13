import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { authOptions } from "@/lib/auth";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) return { redirect: { destination: "/", permanent: false } };
  return { props: {} };
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
        <h1 className="text-2xl font-bold text-indigo-300">Pega Admin Dashboard</h1>
        <p className="mt-3 text-sm text-slate-400">Devam etmek için Discord ile giriş yap.</p>
        <button
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium hover:bg-indigo-500"
          onClick={() => signIn("discord", { callbackUrl: "/" })}
        >
          Discord ile Giriş Yap
        </button>
      </div>
    </div>
  );
}
