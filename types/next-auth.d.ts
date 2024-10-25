import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: number; // Prisma User 모델과 일치하도록 id를 number로 설정
    name: string;
    username: string;
    password: string;
    createdAt: Date;
  }

  interface Session {
    user: User;
  }
}
