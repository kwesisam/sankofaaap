import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmail } from "@/app/provider/supabaseProvider";
import { SiweMessage } from "siwe";
import { getCsrfToken } from "next-auth/react";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      type?: string | null;
    };
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "Ethereum",
      id: "ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}")
          );

          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL as string);

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: siwe.nonce,
          });

          console.log("SIWE verification result:", result);

          if (result.success) {
            console.log("SIWE user address:", siwe.address);
            console.log("SIWE user message:", siwe.domain);
            console.log("SIWE user nonce:", siwe.nonce);
            console.log("SIWE user signature:", credentials?.signature);
            console.log("SIWE user issued at:", siwe.chainId);
            return {
              id: siwe.address,
              name: siwe.address,
              email: `${siwe.address}@ethereum.local`,
              image: undefined,
              type: "user",
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            return null;
          }

          const supaData = await signInWithEmail(
            credentials.email,
            credentials.password
          );

          if (supaData.status === "success" && supaData.data?.user) {
            console.log("Supabase user data:", supaData.data.user.id);
            console.log("Supabase user email:", supaData.data.user.email);
            console.log(
              "Supabase user name:",
              supaData.data.user.user_metadata?.fullname
            );
            console.log(supaData.data.user.user_metadata);
            return {
              id: supaData.data.user.id,
              name: supaData.data.user.user_metadata?.fullname || "",
              email: supaData.data.user.email || credentials.email,
              type: supaData.data.user.user_metadata?.type ?? "user",
            };
          } else {
            console.error(supaData);
            return null;
          }
        } catch (err) {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 3 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    jwt: async ({ token, account, profile, user }) => {
      if (user) {
        token.id = user.id ?? profile?.sub ?? account?.providerAccountId;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.type = user.type ?? "user";
      }
      return token;
    },
    async session({ session, token }) {

      if (token && session.user) {
        session.user.id = typeof token.id === "string" ? token.id : undefined;
        session.user.name = token.name || "";
        session.user.email = token.email || "";
        session.user.image = token.picture || "";
        session.user.type = token.type || "";
      }

      return session;
    },
  },
  logger: {
    error(code, metadata) {
      console.error("[NextAuth error]", code, metadata);
    },
    warn(code) {
      console.warn("[NextAuth warning]", code);
    },
    debug(code, metadata) {
      console.debug("[NextAuth debug]", code, metadata);
    },
  },
});

export { handler as GET, handler as POST };
