if (!process.env.NEXTAUTH_URL && process.env.DISCORD_CALLBACK_URL) {
  process.env.NEXTAUTH_URL = process.env.DISCORD_CALLBACK_URL.replace("/api/auth/callback/discord", "");
}

import DiscordProvider from "next-auth/providers/discord";

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET
    })
  ],
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, profile, account }) {
      if (account && profile) {
        token.discordId = profile.id;
        token.username = profile.username;
        token.avatar = profile.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.discordId;
      session.user.username = token.username;
      session.user.avatar = token.avatar;
      return session;
    }
  }
};
