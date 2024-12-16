import NextAuth from "next-auth";

import { SupabaseAdapter } from "@auth/supabase-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import * as jose from "jose";
import { supabase } from "@/lib/supabase";
// import GithubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";

// Create a secret key for password hashing
const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "your-secret-key-something"
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        console.log("credentials", credentials);
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        console.log("user", user);
        if (error || !user) {
          return null;
        }

        // Verify the password using jose
        const storedPasswordJWT = user.password;
        try {
          const { payload } = await jose.jwtVerify(storedPasswordJWT, SECRET, {
            algorithms: ["HS256"],
          });

          const isPasswordValid = payload.password === credentials.password;

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (e) {
          console.error("Password verification failed:", e);
          return null;
        }
      },
    }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID!,
    //   clientSecret: process.env.GOOGLE_SECRET!,
    // }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
