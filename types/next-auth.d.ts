
// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      type: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    type: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    picture?: string;
    type: string;
  }
}
