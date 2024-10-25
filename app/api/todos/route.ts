// app/api/todos/route.ts
import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

// GET 요청 - 모든 할 일 조회
export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(todos);
}

// POST 요청 - 새로운 할 일 추가
export async function POST(request: Request) {
  const { task } = await request.json();
  if (!task) return NextResponse.json({ error: 'Task is required' }, { status: 400 });

  const newTodo = await prisma.todo.create({
    data: { task },
  });
  return NextResponse.json(newTodo);
}

// PUT 요청 - 할 일 수정
export async function PUT(request: Request) {
  const { id, task, completed } = await request.json();
  if (!id || task === undefined || completed === undefined) {
    return NextResponse.json({ error: 'ID, task and completed status are required' }, { status: 400 });
  }

  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: { task, completed },
  });
  return NextResponse.json(updatedTodo);
}

// DELETE 요청 - 할 일 삭제
export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  await prisma.todo.delete({ where: { id } });
  return NextResponse.json({ id });
}
