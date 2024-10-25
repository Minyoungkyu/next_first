// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  const { username, name, password } = await request.json();

  // 유효성 검사
  if (!username || !name || !password) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 사용자 생성
    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        password: hashedPassword,
      },
    });
    return NextResponse.json({ message: 'User created successfully', user: { id: newUser.id, username: newUser.username, name: newUser.name } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
  }
}
