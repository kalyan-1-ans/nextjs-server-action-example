import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authenticateUser } from "@/server/services/user.service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  // Cookies are shared by every localhost port, so this demo cannot use Auth.js defaults.
  cookies: {
    sessionToken: { name: "jura-actions.session-token" },
    callbackUrl: { name: "jura-actions.callback-url" },
    csrfToken: { name: "jura-actions.csrf-token" },
    pkceCodeVerifier: { name: "jura-actions.pkce.code_verifier" },
    state: { name: "jura-actions.state" },
    nonce: { name: "jura-actions.nonce" },
    webauthnChallenge: { name: "jura-actions.challenge" },
  },
  providers: [
    Credentials({
      credentials: { username: {}, password: {} },
      async authorize(credentials) {
        const parsed = z
          .object({
            username: z.string().trim().min(1).max(100),
            password: z.string().min(1).max(200),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        return authenticateUser(parsed.data.username, parsed.data.password);
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.sub = user.id;

      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;

      return session;
    },
  },
});
