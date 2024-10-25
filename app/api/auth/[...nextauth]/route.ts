import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<User | null> => {
        const user = await prisma.user.findUnique({
          where: { username: credentials?.username },
        });
        if (user && credentials?.password) {
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isValidPassword) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as const, // 'jwt'를 상수로 설정하여 타입 오류 해결
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as User;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = { id: user.id, username: user.username, name: user.name };
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
